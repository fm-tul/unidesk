using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Elements;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Dtos;
using Unidesk.Exceptions;
using Unidesk.Reports;
using Unidesk.Reports.Elements;
using Unidesk.Reports.Templates;
using Unidesk.Security;
using Unidesk.Server.Permalinks;
using Unidesk.Services;
using Unidesk.Services.Email;
using Unidesk.Services.Email.Templates;
using Unidesk.Utils.Extensions;
using Document = Unidesk.Db.Models.Document;

namespace Unidesk.Server;

public partial class EvaluationService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly WordGeneratorService _wordGeneratorService;
    private readonly IUserProvider _userProvider;
    private readonly IEnumerable<IEvaluationTemplate> _evaluationsTemplates;
    private readonly EmailService _emailService;
    private readonly TemplateFactory _templateFactory;
    private readonly ServerService _serverService;
    private readonly DocumentService _documentService;
    private readonly InternshipService _internshipService;

    public EvaluationService(UnideskDbContext db, IMapper mapper, WordGeneratorService wordGeneratorService, IUserProvider userProvider,
        IEnumerable<IEvaluationTemplate> evaluationsTemplates, EmailService emailService, TemplateFactory templateFactory, ServerService serverService, DocumentService documentService,
        InternshipService internshipService)
    {
        _db = db;
        _mapper = mapper;
        _wordGeneratorService = wordGeneratorService;
        _userProvider = userProvider;
        _evaluationsTemplates = evaluationsTemplates;
        _emailService = emailService;
        _templateFactory = templateFactory;
        _serverService = serverService;
        _documentService = documentService;
        _internshipService = internshipService;
    }

    private async Task<Evaluation> GetWithPassword(Guid id, string pass, CancellationToken ct)
    {
        var item = await _db.Evaluations
                      .Query()
                      .FirstOrDefaultAsync(i => i.Id == id, ct)
                ?? throw new NotFoundException("Thesis evaluation not found");

        if (!BCrypt.Net.BCrypt.Verify(pass, item.PassphraseHash))
        {
            throw new NotAllowedException("Invalid passphrase");
        }

        return item;
    }

    private async Task<Evaluation> GetWithGrant(Guid id, CancellationToken ct)
    {
        if (!_userProvider.HasSomeOfGrants(Grants.User_SuperAdmin, Grants.Action_ThesisEvaluation_Manage))
        {
            throw new NotAllowedException("You are not allowed to manage this thesis evaluations");
        }

        return await _db.Evaluations
                  .Query()
                  .FirstOrDefaultAsync(i => i.Id == id, ct)
            ?? throw new NotFoundException("Thesis evaluation not found");
    }

    public async Task<List<EvaluationDto>> GetAllAsync(Guid id, CancellationToken ct)
    {
        var items = await _db.Evaluations
           .Include(i => i.Evaluator)
           .Where(i => i.ThesisId == id)
           .ToListAsync(ct);
        var dtos = _mapper.Map<List<EvaluationDto>>(items);
        return dtos;
    }

    public async Task<EvaluationDetailDto> GetOneAsync(Guid id, string? pass, CancellationToken ct)
    {
        var item = string.IsNullOrEmpty(pass)
            ? await GetWithGrant(id, ct)
            : await GetWithPassword(id, pass, ct);

        return await GetOneAsync(item, ct);
    }

    public async Task<EvaluationDetailDto> GetOneAsync(Evaluation item, CancellationToken ct)
    {
        // when first time opened, check status, set it to accepted if it is not already
        await TryUpdateStatusWhenUnlockedAsync(ct, item);

        var dto = _mapper.Map<EvaluationDetailDto>(item);

        var context = GetContext(item);

        var candidates = _evaluationsTemplates.Where(i => i.CanProcess(context))
           .ToList();

        dto.FormatCandidates = candidates.Select(i => i.TemplateName)
           .ToList();

        // if there is only one format candidate, set it as format
        if (dto.Format.IsNullOrEmpty() && dto.FormatCandidates.Count == 1)
        {
            dto.Format = dto.FormatCandidates.First();
            item.Format = dto.Format;
            await _db.SaveChangesAsync(ct);
        }

        if (dto.Format.IsNotNullOrEmpty())
        {
            var model = GetModel(dto.Format)!;
            dto.Response = model.GetModel(context);
            dto.Questions = model.GetQuestions(context);
        }

        return dto;
    }

    private ThesisEvaluationContext GetContext(Evaluation item)
    {
        return new ThesisEvaluationContext
        {
            Evaluator = item.Evaluator,
            CurrentUser = _userProvider.CurrentUser,
            Language = item.Language,
            Thesis = item.Thesis,
            UserFunction = item.UserFunction,
            Evaluation = item,
            Internship = item.Internship,
        };
    }

    public async Task<byte[]> PdfPreviewAsync(Guid id, string? pass, CancellationToken ct)
    {
        var detailDto = await GetOneAsync(id, pass, ct);
        return PdfPreview(detailDto);
    }

    public async Task<byte[]> PdfPreviewAsync(Evaluation item, CancellationToken ct, string? permalink = null)
    {
        var detailDto = await GetOneAsync(item, ct);
        return PdfPreview(detailDto, permalink);
    }

    private byte[] PdfPreview(EvaluationDetailDto detailDto, string? permalink = null)
    {
        if (detailDto.InternshipId is not null)
        {
            var internshipPdf = GetInternshipPdf(detailDto, permalink);
            return internshipPdf.GeneratePdf();
        }

        if (detailDto.ThesisId is not null)
        {
            var thesisPdf = GetThesisPdf(detailDto, permalink);
            return thesisPdf.GeneratePdf();
        }

        throw new NotSupportedException("Evaluation is not related to thesis or internship");
    }

    private IEvaluationTemplate? GetModel(string templateName)
    {
        return _evaluationsTemplates.FirstOrDefault(i => i.TemplateName == templateName);
    }

    private async Task TryUpdateStatusWhenUnlockedAsync(CancellationToken ct, Evaluation item)
    {
        var needsSave = false;
        if (item.Status.In(EvaluationStatus.Invited, EvaluationStatus.Reopened))
        {
            item.Status = EvaluationStatus.Accepted;
            needsSave = true;
        }

        if (item.Status == EvaluationStatus.Accepted && item.Response.IsNotNullOrEmpty())
        {
            item.Status = EvaluationStatus.Draft;
            needsSave = true;
        }

        if (needsSave)
        {
            await _db.SaveChangesAsync(ct);
        }
    }

    public async Task<OneOf<EvaluationPeekDto, Exception>> Upsert(EvaluationDto dto, CancellationToken ct)
    {
        EvaluationDto.Validate(dto);
        var item = await _db.Evaluations.FirstOrDefaultAsync(i => i.Id == dto.Id, ct);
        if (item == null)
        {
            item = _mapper.Map<Evaluation>(dto);
            item.CreatedByUserId = _userProvider.CurrentUserId;
            item.Status = EvaluationStatus.Prepared;
            await _db.Evaluations.AddAsync(item, ct);
        }
        else
        {
            if (item.Status != EvaluationStatus.Prepared)
            {
                return new NotAllowedException("Cannot update evaluation that is already in progress");
            }

            if (dto.Status != EvaluationStatus.Prepared)
            {
                return new NotAllowedException("Cannot change status of the evaluation this way");
            }

            _mapper.Map(dto, item);
        }

        await _db.SaveChangesAsync(ct);
        return await PeekAsync(item.Id, ct);
    }

    public async Task<EvaluationDto> ChangeStatus(Guid id, EvaluationStatus status, string? pass, CancellationToken ct)
    {
        if (status == EvaluationStatus.Invited)
        {
            // need grant to be able to invite
            var item = await GetWithGrant(id, ct);

            if (item.Status == EvaluationStatus.Prepared)
            {
                await InviteToThesisEvaluationAsync(item, ct);
                await _db.SaveChangesAsync(ct);
                return _mapper.Map<EvaluationDto>(item);
            }
        }

        if (status == EvaluationStatus.Submitted)
        {
            var password = pass ?? throw new NotAllowedException("Passphrase is required");
            var item = await GetWithPassword(id, password, ct);

            if (item.Status.In(EvaluationStatus.Accepted, EvaluationStatus.Draft, EvaluationStatus.Invited, EvaluationStatus.Reopened, EvaluationStatus.Submitted) && item.Format.IsNotNullOrEmpty())
            {
                var model = GetModel(item.Format)
                         ?? throw new NotAllowedException("Invalid format");
                await model.ValidateAndThrowAsync(GetContext(item));
                await ChangeStatusToSubmittedAsync(item, pass, ct);
                await _db.SaveChangesAsync(ct);
                return _mapper.Map<EvaluationDto>(item);
            }
        }

        // meaning someone checked the evaluation and approved it
        if (status == EvaluationStatus.Approved)
        {
            await ChangeStatusToApprovedAsync(id, ct);
            await _db.SaveChangesAsync(ct);
            return await GetOneAsync(id, pass, ct);
        }
        
        if (status == EvaluationStatus.Reopened)
        {
            await ChangeStatusToReopenedAsync(id, ct);
            await _db.SaveChangesAsync(ct);
            return await GetOneAsync(id, pass, ct);
        }

        throw new NotAllowedException("Cannot change status of the evaluation this way");
    }

    private async Task InviteToThesisEvaluationAsync(Evaluation item, CancellationToken ct)
    {
        var url = _serverService.UrlBase;
        var passphrase = _wordGeneratorService.GeneratePassPhrase();
        item.PassphraseHash = BCrypt.Net.BCrypt.HashPassword(passphrase);
        item.Status = EvaluationStatus.Invited;

        var thesis = item.Thesis
                  ?? throw new InvalidOperationException("Thesis is not set");

        var studentName = thesis.Authors.FirstOrDefault()
                            ?.FullName
                       ?? "student";

        var title = thesis.NameEng;
        var body = _templateFactory
           .LoadTemplate<ThesisTemplates.EvaluationInviteML>()
           .Render(new ThesisTemplates.EvaluationInviteML
            {
                SupervisorName = item.Evaluator?.FullName ?? item.EvaluatorFullName,
                StudentName = studentName,
                ThesisTitle = title,
                ContactEmail = "viroco@tul.cz",
                ThesisEvaluationDeadline = DateTime.Now.AddDays(14)
                   .ToLongDateString(),
                ThesisEvaluationPassword = passphrase,
                ThesisEvaluationUrl = $"{url}/evaluation/{item.Id}",
            });

        await _emailService.QueueTextEmailAsync(
            to: item.Email,
            subject: "Thesis evaluation invitation",
            body: body,
            ct: ct
        );
    }

    private async Task InviteToInternshipEvaluationAsync(Evaluation item, CancellationToken ct)
    {
        item.Status = EvaluationStatus.Invited;
        var passphrase = _wordGeneratorService.GeneratePassPhrase();
        item.PassphraseHash = BCrypt.Net.BCrypt.HashPassword(passphrase);

        var internship = item.Internship
                      ?? throw new InvalidOperationException("Internship is not set");
        var studentName = internship.Student.FullName ?? "student";
        var title = internship.InternshipTitle;
        var body = _templateFactory
           .LoadTemplate<InternshipTemplates.EvaluationInviteML>()
           .Render(new InternshipTemplates.EvaluationInviteML
            {
                SupervisorName = item.Evaluator?.FullName ?? item.EvaluatorFullName,
                StudentName = studentName,
                InternshipTitle = title,
                ContactEmail = _emailService.ContactEmail,
                InternshipEvaluationDeadline = DateTime.Now.AddDays(14)
                   .ToLongDateString(),
                InternshipEvaluationPassword = passphrase,
                InternshipEvaluationUrl = $"{_serverService.UrlBase}/evaluation/{item.Id}",
            });

        await _emailService.QueueTextEmailAsync(
            to: item.Email,
            subject: InternshipTemplates.EvaluationInviteML.Subject,
            body: body,
            ct: ct
        );
    }
    
    private async Task ChangeStatusToReopenedAsync(Guid id, CancellationToken ct)
    {
        var item = await _db.Evaluations
           .Query()
           .FirstOrDefaultAsync(i => i.Id == id, ct);
        if (item == null)
        {
            throw new NotFoundException("Evaluation not found");
        }

        item.Status = EvaluationStatus.Reopened;
        var passphrase = _wordGeneratorService.GeneratePassPhrase();
        item.PassphraseHash = BCrypt.Net.BCrypt.HashPassword(passphrase);

        var internship = item.Internship
                      ?? throw new InvalidOperationException("Internship is not set");
        var studentName = internship.Student.FullName;
        var body = _templateFactory
           .LoadTemplate<InternshipTemplates.EvaluationReopenedSupervisor>()
           .Render(new InternshipTemplates.EvaluationReopenedSupervisor
            {
                StudentName = studentName,
                InternshipEvaluationPassword = passphrase,
                InternshipEvaluationUrl = $"{_serverService.UrlBase}/evaluation/{item.Id}",
            });

        await _emailService.QueueTextEmailAsync(
            to: item.Email,
            subject: InternshipTemplates.EvaluationReopenedSupervisor.Subject,
            body: body,
            ct: ct
        );
    }

    private async Task ChangeStatusToSubmittedAsync(Evaluation item, string pass, CancellationToken ct)
    {
        var desiredAccessKey = Guid.NewGuid();
        var pdf = await PdfPreviewAsync(item, ct, permalink: desiredAccessKey.GetPermalinkForDocument());

        // we will delete the old document if it exists
        if (item.Document is not null)
        {
            _db.Documents.Remove(item.Document);
            item.Document = null;
            item.DocumentId = null;
            await _db.SaveChangesAsync(ct);
        }

        item.Status = EvaluationStatus.Submitted;
        if (item.Document is null)
        {
            item.Document = _documentService.CreateDocument(pdf, "internship-evaluation.pdf", desiredAccessKey: desiredAccessKey);
            item.DocumentId = item.Document.Id;

            // add document to db
            await _db.Documents.AddAsync(item.Document, ct);
            await _db.DocumentContents.AddAsync(item.Document.DocumentContent, ct);
        }
        else
        {
            // should never happen
            throw new InvalidOperationException("Document already exists");
        }

        // for internship evaluations, we will notify the manager, that the evaluation is ready to be reviewed
        if (item.IsForInternship)
        {
            var internship = item.Internship
                          ?? throw new InvalidOperationException("Internship is not set");

            await NotifyManagersAboutNewSubmissionAsync(internship, ct);
            await NotifySupervisorAboutNewSubmissionAsync(internship, item.DocumentId, ct);
        }
    }

    private async Task NotifyManagersAboutNewSubmissionAsync(Internship internship, CancellationToken ct)
    {
        var body = _templateFactory.LoadTemplate<InternshipTemplates.NewEvaluationSubmitted>()
           .Render(new InternshipTemplates.NewEvaluationSubmitted
            {
                StudentName = internship.Student.FullName,
                InternshipTitle = internship.InternshipTitle,
                InternshipEvaluationUrl = $"{_serverService.UrlBase}/{internship.GetPermalink()}",
                ContactEmail = _emailService.ContactEmail,
            });

        var (avail, all) = await _internshipService.GetManagerEmailsAvailableAsync(ct);
        if (avail.Empty())
        {
            avail.Add(_emailService.ContactEmail);
        }

        foreach (var emailAddress in avail)
        {
            await _emailService.QueueTextEmailAsync(
                to: emailAddress,
                body: body,
                subject: InternshipTemplates.NewEvaluationSubmitted.Subject,
                ct: ct);
        }
    }

    private async Task NotifySupervisorAboutNewSubmissionAsync(Internship internship, Guid? documentId, CancellationToken ct)
    {
        var body = _templateFactory.LoadTemplate<InternshipTemplates.NewEvaluationSubmittedSupervisor>()
           .Render(new InternshipTemplates.NewEvaluationSubmittedSupervisor
            {
                StudentName = internship.Student.FullName,
            });

        var email = internship.SupervisorEmail.Value()
                 ?? throw new InvalidOperationException("Supervisor email is not set");

        await _emailService.QueueTextEmailAsync(
            to: email,
            body: body,
            subject: InternshipTemplates.NewEvaluationSubmittedSupervisor.Subject,
            documentId: documentId,
            ct: ct);
    }
    
    private async Task ChangeStatusToApprovedAsync(Guid id, CancellationToken ct)
    {
        var item = await GetWithGrant(id, ct);
        item.Status = EvaluationStatus.Approved;

        // for internship evaluations, we will notify the student, that the evaluation was approved
        if (item.IsForInternship)
        {
            var internship = item.Internship
                          ?? throw new InvalidOperationException("Internship is not set");

            var email = internship.Student.GetEmail()
                     ?? throw new InvalidOperationException("Student email is not set");

            var body = _templateFactory.LoadTemplate<InternshipTemplates.EvaluationApproved>()
               .Render(new InternshipTemplates.EvaluationApproved
                {
                    InternshipEvaluationUrl = $"{_serverService.UrlBase}/{internship.GetPermalink()}",
                });

            await _emailService.QueueTextEmailAsync(
                to: email,
                body: body,
                subject: InternshipTemplates.EvaluationApproved.Subject,
                ct: ct);

            if (_internshipService.CanBeFinished(internship))
            {
                internship.Status = InternshipStatus.Finished;
            }
        }
    }

    public async Task DeleteOne(Guid id, CancellationToken ct)
    {
        var item = await GetWithGrant(id, ct);

        if (item.Status != EvaluationStatus.Prepared)
        {
            throw new NotAllowedException("Cannot delete evaluation that is already in progress");
        }

        _db.Evaluations.Remove(item);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<OneOf<EvaluationDetailDto, Exception>> UpdateOne(EvaluationDetailDto dto, string pass, CancellationToken ct)
    {
        var item = await GetWithPassword(dto.Id, pass, ct);

        _mapper.Map(dto, item);
        if (!_db.ModifiedPropertiesFor(item)
               .ToList()
               .ContainsOnly(nameof(Evaluation.Response), nameof(Evaluation.Format), nameof(Evaluation.Modified)))
        {
            throw new NotAllowedException("Detected attempt to change other properties than evaluation data");
        }

        await _db.SaveChangesAsync(ct);
        return await GetOneAsync(item.Id, pass, ct);
    }

    public async Task<EvaluationPeekDto> PeekAsync(Guid id, CancellationToken ct)
    {
        var item = await _db.Evaluations
                      .Query()
                      .FirstOrDefaultAsync(i => i.Id == id, ct)
                ?? throw new NotFoundException("Thesis evaluation not found");

        var dto = _mapper.Map<EvaluationPeekDto>(item);
        return dto;
    }

    public async Task RejectAsync(Guid id, string pass, string? reason, CancellationToken ct)
    {
        var item = await GetWithPassword(id, pass, ct);
        if (item.Status != EvaluationStatus.Invited)
        {
            throw new NotAllowedException("Cannot reject evaluation that is not in invited state");
        }

        item.Status = EvaluationStatus.Rejected;
        item.RejectionReason = reason;

        await _db.SaveChangesAsync(ct);
    }

    public async Task UploadFileAsync(Guid internshipId, Guid evaluationId, IFormFile file, CancellationToken ct)
    {
        var (isNew, evaluation) = await _db.Evaluations
           .Include(i => i.Document.DocumentContent)
           .GetOrCreateById(evaluationId, ct);

        var internship = await _db.Internships
                            .Query()
                            .FirstOrDefaultAsync(i => i.Id == internshipId, ct)
                      ?? throw new NotFoundException("Internship not found");

        NotFoundException.ThrowIfNullOrEmpty(evaluation);
        NotAllowedException.ThrowIf(!CasAccess(internship), "You are not allowed to access this internship");
        NotAllowedException.ThrowIf(!isNew && !CasAccess(evaluation), "You are not allowed to access this evaluation");

        if (isNew)
        {
            evaluation.CreatedByUserId = _userProvider.CurrentUserId;
            evaluation.UserFunction = UserFunction.Author;
            evaluation.Status = EvaluationStatus.Approved;
            evaluation.InternshipId = internshipId;
            evaluation.Document = _documentService.CreateDocument(file);
            evaluation.DocumentId = evaluation.Document.Id;
            evaluation.EvaluatorId = _userProvider.CurrentUserId;
            evaluation.EvaluatorFullName = _userProvider.CurrentUser.FullName
                                        ?? throw new NotAllowedException("Please set your full name in your profile first");
            evaluation.Email = _userProvider.CurrentUser.Email
                            ?? throw new NotAllowedException("Please set your email address in your profile first");

            await _db.Documents.AddAsync(evaluation.Document, ct);
            await _db.Evaluations.AddAsync(evaluation, ct);
        }
        else if (evaluation.Document != null)
        {
            // replace Content
            _documentService.UpdateDocument(evaluation.Document, file);
        }
        else
        {
            // create new document
            evaluation.Status = EvaluationStatus.Approved;
            evaluation.Document = _documentService.CreateDocument(file);
            evaluation.DocumentId = evaluation.Document.Id;
            await _db.Documents.AddAsync(evaluation.Document, ct);
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task<Document> DownloadEvaluationFileAsync(Guid id, CancellationToken ct)
    {
        var evaluation = await GetOneOrThrowAsync(id, ct);
        if (evaluation.Status != EvaluationStatus.Approved)
        {
            NotAllowedException.ThrowIf(!_userProvider.HasSomeOfGrants(Grants.Internship_Manage, Grants.User_SuperAdmin),
                "You cannot download evaluation file that is not approved");
        }

        var document = evaluation.Document
                    ?? throw new NotFoundException("Thesis evaluation document not found");
        return document;
    }

    public async Task<bool> RemoveFileAsync(Guid id, CancellationToken ct)
    {
        var evaluation = await GetOneOrThrowAsync(id, ct);

        if (evaluation.Document != null)
        {
            evaluation.Status = EvaluationStatus.Draft;
            _db.Documents.Remove(evaluation.Document);
            await _db.SaveChangesAsync(ct);
            return true;
        }

        return false;
    }


    public async Task<bool> InviteSupervisorToInternshipAsync(Guid internshipId, Guid evaluationId, CancellationToken ct)
    {
        var (isNew, evaluation) = await _db.Evaluations
           .Query()
           .GetOrCreateById(evaluationId, ct);

        var internship = await _db.Internships
                            .Query()
                            .FirstOrDefaultAsync(i => i.Id == internshipId, ct)
                      ?? throw new NotFoundException("Internship not found");

        NotFoundException.ThrowIfNullOrEmpty(evaluation);
        NotAllowedException.ThrowIf(!CasAccess(internship), "You are not allowed to access this internship");
        NotAllowedException.ThrowIf(!isNew, "Evaluation is already invited");
        NotAllowedException.ThrowIf(!isNew && !CasAccess(evaluation), "You are not allowed to access this evaluation");

        var supervisorEmail = internship.SupervisorEmail.ValidEmailOrDefault()
                           ?? throw new NotAllowedException("Please set supervisor email address in internship first");

        var evaluatorIdByEmail = await _db.Users
           .Where(i => i.Email == supervisorEmail)
           .Select(i => i.Id)
           .FirstOrDefaultAsync(ct);

        evaluation.CreatedByUserId = _userProvider.CurrentUserId;
        evaluation.UserFunction = UserFunction.Supervisor;
        evaluation.Status = EvaluationStatus.Prepared;
        evaluation.InternshipId = internshipId;
        evaluation.Internship = internship;

        // we try to find user with email of supervisor
        evaluation.EvaluatorId = evaluatorIdByEmail.IsEmpty() ? null : evaluatorIdByEmail;

        // the rest is filled by internship data
        evaluation.EvaluatorFullName = internship.SupervisorName.Value()
                                    ?? throw new NotAllowedException("Please set supervisor name in internship first");
        evaluation.Email = supervisorEmail;

        await _db.Evaluations.AddAsync(evaluation, ct);
        await InviteToInternshipEvaluationAsync(evaluation, ct);
        await _db.SaveChangesAsync(ct);
        return true;
    }


    private async Task<Evaluation> GetOneOrThrowAsync(Guid id, CancellationToken ct)
    {
        var evaluation = await _db.Evaluations
                            .Query()
                            .Include(i => i.Document.DocumentContent)
                            .FirstOrDefaultAsync(i => i.Id == id, ct)
                      ?? throw new NotFoundException("Thesis evaluation not found");

        NotAllowedException.ThrowIf(!CasAccess(evaluation), "You are not allowed to access this evaluation");
        return evaluation;
    }

    private bool CasAccess(Evaluation evaluation)
    {
        var currentUserId = _userProvider.CurrentUserId;
        return currentUserId == evaluation.CreatedByUserId
            || evaluation.EvaluatorId == currentUserId
            || _userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin, Grants.Internship_Manage);
    }

    private bool CasAccess(Internship internship)
    {
        var currentUserId = _userProvider.CurrentUserId;
        return currentUserId == internship.StudentId
            || _userProvider.HasSomeOfGrants(Grants.User_Admin, Grants.User_SuperAdmin, Grants.Internship_Manage);
    }
}

public class DashedLine : IDynamicComponent<int>
{
    public DashedLine(string prop)
    {
        Prop = prop;
    }

    public int State { get; set; }

    public string Prop { get; set; }

    public DynamicComponentComposeResult Compose(DynamicContext context)
    {
        var content = context.CreateElement(container =>
        {
            var width = context.AvailableSize.Width;
            var dashes = (int)Math.Floor(width / 4.8);

            container
               .Unconstrained()
               .Text(string.Join(" ", Enumerable.Repeat(".", dashes)));
        });

        return new DynamicComponentComposeResult
        {
            Content = content,
            HasMoreContent = false,
        };
    }
}