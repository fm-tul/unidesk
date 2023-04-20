using MapsterMapper;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
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
    private readonly IServer _server;

    public InternshipService(UnideskDbContext db, IMapper mapper, WordGeneratorService wordGeneratorService, IUserProvider userProvider, EmailService emailService, TemplateFactory templateFactory,
        IServer server)
    {
        _db = db;
        _mapper = mapper;
        _wordGeneratorService = wordGeneratorService;
        _userProvider = userProvider;
        _emailService = emailService;
        _templateFactory = templateFactory;
        _server = server;
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

    public async Task<Internship> UpsertAsync(InternshipDto dto, CancellationToken ct)
    {
        var (isNew, item) = await _db.Internships.Query().GetOrCreateFromDto(_mapper, dto);
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
        await _db.SaveChangesAsync(ct);

        return _db.Internships.Query().FirstOrDefault(i => i.Id == item.Id)!;
    }

    public async Task<Internship> ChangeStatusAsync(Internship item, InternshipStatus status, bool isManager, CancellationToken ct)
    {
        item.Status = (item.Status, status, isManager) switch
        {
            (InternshipStatus.Draft, InternshipStatus.Submitted, _) => InternshipStatus.Submitted,
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

        await _db.SaveChangesAsync(ct);

        return item;
    }
}