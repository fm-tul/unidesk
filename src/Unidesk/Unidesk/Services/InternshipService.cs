using MapsterMapper;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Db.Models.UserPreferences;
using Unidesk.Dtos.Internships;
using Unidesk.Dtos.Requests;
using Unidesk.Exceptions;
using Unidesk.Reports;
using Unidesk.Security;
using Unidesk.Services.Email;
using Unidesk.Services.Email.Templates;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class InternshipService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly WordGeneratorService _wordGeneratorService;
    private readonly IUserProvider _userProvider;
    private readonly EmailService _emailService;
    private readonly TemplateFactory _templateFactory;
    private readonly ServerService _serverService;
    private readonly ILogger<InternshipService> _logger;
    private readonly IClock _clock;

    public InternshipService(UnideskDbContext db, IMapper mapper, WordGeneratorService wordGeneratorService, IUserProvider userProvider, EmailService emailService, TemplateFactory templateFactory,
        ILogger<InternshipService> logger, ServerService serverService, IClock clock)
    {
        _db = db;
        _mapper = mapper;
        _wordGeneratorService = wordGeneratorService;
        _userProvider = userProvider;
        _emailService = emailService;
        _templateFactory = templateFactory;
        _logger = logger;
        _serverService = serverService;
        _clock = clock;
    }

    public async Task<Internship?> GetOneAsync(Guid id, CancellationToken ct)
    {
        return await _db.Internships
           .Query()
           .FirstOrDefaultAsync(i => i.Id == id, ct);
    }

    public IQueryable<Internship> Where(InternshipFilter filter)
    {
        var query = _db.Internships.Query();

        query.WhereIf(filter.StudentId.HasValue, i => i.StudentId == filter.StudentId);
        query.WhereIf(filter.Status.HasValue, i => i.Status == filter.Status);

        return query;
    }

    public async Task<Internship> UpsertAsync(InternshipDto dto, CancellationToken ct, Action<Internship, IEnumerable<string>>? onBeforeSave = null)
    {
        var (isNew, item) = await _db.Internships.Query()
           .GetOrCreateFromDto(_mapper, dto);
        
        NotFoundException.ThrowIfNullOrEmpty(item);

        if (isNew)
        {
            _db.Internships.Add(item);
        }

        var newKeywordThesis = dto.Keywords
           .Select(i => new KeywordInternship { InternshipId = item.Id, KeywordId = i.Id })
           .ToList();

        item.StudentId = dto.Student.Id;
        item.KeywordInternship.SynchronizeDbSet(newKeywordThesis, _db.KeywordInternships, (i, j) => i.KeywordId == j.KeywordId);
        onBeforeSave?.Invoke(item, _db.ModifiedPropertiesFor(item));
        await _db.SaveChangesAsync(ct);

        return _db.Internships.Query()
           .FirstOrDefault(i => i.Id == item.Id)!;
    }

    public async Task DeleteAsync(Internship item, CancellationToken ct)
    {
        NotFoundException.ThrowIfNullOrEmpty(item);

        _db.KeywordInternships.RemoveRange(item.KeywordInternship);
        _db.Internships.Remove(item);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<Internship> ChangeStatusAsync(Internship item, InternshipStatus status, bool isManager, CancellationToken ct)
    {
        var oldStatus = item.Status;
        item.Status = (item.Status, status, isManager) switch
        {
            (InternshipStatus.Draft, InternshipStatus.Submitted, _)    => InternshipStatus.Submitted,
            (InternshipStatus.Reopened, InternshipStatus.Submitted, _) => InternshipStatus.Submitted,

            (InternshipStatus.Submitted, InternshipStatus.Approved, true) => InternshipStatus.Approved,
            (InternshipStatus.Submitted, InternshipStatus.Rejected, true) => InternshipStatus.Rejected,
            (InternshipStatus.Submitted, InternshipStatus.Reopened, true) => InternshipStatus.Reopened,

            (InternshipStatus.Approved, InternshipStatus.Finished, true) => InternshipStatus.Finished,
            (InternshipStatus.Finished, InternshipStatus.Defended, true) => InternshipStatus.Defended,

            // can be canceled anytime by manager, or by student if in draft, TODO: clarification needed
            (_, InternshipStatus.Cancelled, true)                       => InternshipStatus.Cancelled,
            (_, InternshipStatus.Reopened, true)                        => InternshipStatus.Reopened,
            (InternshipStatus.Draft, InternshipStatus.Cancelled, false) => InternshipStatus.Cancelled,

            _ => throw new NotAllowedException($"Cannot change status from {item.Status} to {status} or you are not allowed to do it"),
        };

        if (oldStatus != item.Status)
        {
            var email = item.Student.GetEmail();
            if (string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Student {UserName}:{StudentId} has no email", item.Student.FullName(), item.StudentId);
            }
            else
            {
                if (item.Status == InternshipStatus.Approved)
                {
                    var body = _templateFactory
                       .LoadTemplate(InternshipTemplates.InternshipApprovedCzeTemplate.TemplateBody)
                       .RenderTemplate(new InternshipTemplates.InternshipApprovedCzeTemplate
                        {
                            InternshipUrl = $"{_serverService.UrlBase}/internships/{item.Id}",
                        });
                    await _emailService.QueueTextEmailAsync(email, InternshipTemplates.InternshipApprovedCzeTemplate.Subject, body, ct);
                }
                else
                {
                    var body = _templateFactory
                       .LoadTemplate(InternshipTemplates.InternshipUpdatedCzeTemplate.TemplateBody)
                       .RenderTemplate(new InternshipTemplates.InternshipUpdatedCzeTemplate
                        {
                            InternshipUrl = $"{_serverService.UrlBase}/internships/{item.Id}",
                        });
                    await _emailService.QueueTextEmailAsync(email, InternshipTemplates.InternshipUpdatedCzeTemplate.Subject, body, ct);
                }
            }
        }

        await _db.SaveChangesAsync(ct);

        return item;
    }

    public async Task<List<Internship>> GetSubmittedInternships(CancellationToken ct)
    {
        return await _db.Internships
           .Query()
           .Where(i => i.Status == InternshipStatus.Submitted)
           .ToListAsync(ct);
    }

    public async Task<List<Internship>> GetInternshipsWithMissingContactPersonAsync(CancellationToken ct)
    {
        // two weeks after the start of the internship contact person should be filled in
        var now = _clock.Now;
        return await _db.Internships
           .Query()
           .Where(i => string.IsNullOrEmpty(i.SupervisorEmail) || string.IsNullOrEmpty(i.SupervisorPhone) || string.IsNullOrEmpty(i.SupervisorName))
           .Where(i => i.Status == InternshipStatus.Approved)
           .Where(i => EF.Functions.DateDiffDay(i.StartDate, now) > 14)
           .ToListAsync(ct);
    }

    public async Task NotifyManagerAboutSubmittedInternshipAsync(CancellationToken ct)
    {
        var submittedInternships = await GetSubmittedInternships(ct);
        if (submittedInternships.Empty())
        {
            _logger.LogInformation("No submitted internships found");
            return;
        }

        var managerGrantId = Grants.Internship_Manage.GrantId();
        var managers = await _db.UserRoles
           .Where(i => i._grantsRaw.Contains(managerGrantId.ToString()))
           .SelectMany(i => i.Users)
           .IgnoreQueryFilters()
           .Include(i => i.Aliases)
           .ToListAsync(ct);

        managers = managers
           .Where(i => !i.IsAdmin())
           .ToList();


        var emailsSent = new HashSet<string>();
        foreach (var manager in managers)
        {
            if (manager.HasPreferenceChecked(Preferences.OptOutFromEmailsAboutInternships) == true)
            {
                _logger.LogDebug("Manager {UserName} has opted out from emails", manager.FullName());
                continue;
            }
            
            var email = manager.GetEmail();
            if (email.IsNotNullOrEmpty())
            {
                if (emailsSent.Contains(email))
                {
                    _logger.LogWarning("Manager {UserName} has already been notified", manager.FullName());
                    continue;
                }

                var message = _templateFactory
                   .LoadTemplate(InternshipTemplates.NewInternshipSubmittedCzeTemplate.TemplateBody)
                   .RenderTemplate(new InternshipTemplates.NewInternshipSubmittedCzeTemplate
                    {
                        InternshipCount = submittedInternships.Count,
                        InternshipUrl = $"{_serverService.UrlBase}/internships",
                    });

                await _emailService.QueueTextEmailAsync(email, InternshipTemplates.NewInternshipSubmittedCzeTemplate.Subject, message, ct);
                emailsSent.Add(email);
            }
            else
            {
                _logger.LogWarning("Manager {UserName} has no email", manager.FullName());
            }
        }

        if (emailsSent.Count > 0)
        {
            _logger.LogInformation("Emails about new submitted internships were sent to {EmailsCount} managers", emailsSent.Count);
        }
        else
        {
            _logger.LogWarning("No emails about new submitted internships were sent! "
                             + "There are {ManagersCount} managers, but none of them has email set or has opted out from emails. "
                             + "There are {SubmittedInternshipsCount} submitted internships",
                managers.Count, submittedInternships.Count);
        }
    }

    public async Task NotifyStudentsContactPersonMissingAsync(CancellationToken ct)
    {
        var items = await GetInternshipsWithMissingContactPersonAsync(ct);
        if (items.Empty())
        {
            _logger.LogDebug("No internships with missing contact person found");
            return;
        }

        var notified = 0;

        foreach (var item in items)
        {
            // to not spam the student, we will check the item.Modified DateTime. This way we will send the email only once a day
            var durationSinceLastEmail = _clock.Now - item.Modified;
            if (durationSinceLastEmail.TotalDays < 1)
            {
                _logger.LogDebug("Not sending email to {Student} about missing contact person, because it was edited {DurationSinceLastEmail} ago", item.Student.Username, durationSinceLastEmail);
                continue;
            }

            var email = item.Student.GetEmail();
            if (email.IsNotNullOrEmpty())
            {
                var message = _templateFactory
                   .LoadTemplate(InternshipTemplates.InternshipContactPersonMissingCzeTemplate.TemplateBody)
                   .RenderTemplate(new InternshipTemplates.InternshipContactPersonMissingCzeTemplate
                    {
                        InternshipUrl = $"{_serverService.UrlBase}/internships/{item.Id}",
                    });

                await _emailService.QueueTextEmailAsync(email, InternshipTemplates.InternshipContactPersonMissingCzeTemplate.Subject, message, ct);
                item.Modified = _clock.Now;
                notified++;
            } 
            else
            {
                _logger.LogWarning("Student {UserName} has no email", item.Student.FullName());
            }
        }
        
        _logger.LogInformation("Emails about missing contact person were sent to {NotifiedCount} students", notified);
        await _db.SaveChangesAsync(ct);
    }
}