using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Exceptions;
using Unidesk.Reports;
using Unidesk.Security;
using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Server;

public class ThesisEvaluationService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly WordGeneratorService _wordGeneratorService;
    private readonly IUserProvider _userProvider;
    private readonly IEnumerable<IThesisEvaluation> _thesisEvaluations;

    public ThesisEvaluationService(UnideskDbContext db, IMapper mapper, WordGeneratorService wordGeneratorService, IUserProvider userProvider,
        IEnumerable<IThesisEvaluation> thesisEvaluations)
    {
        _db = db;
        _mapper = mapper;
        _wordGeneratorService = wordGeneratorService;
        _userProvider = userProvider;
        _thesisEvaluations = thesisEvaluations;
    }

    private async Task<ThesisEvaluation> GetWithPassword(Guid id, string pass, CancellationToken ct)
    {
        var item = await _db.ThesisEvaluations
                      .Include(i => i.Thesis)
                      .ThenInclude(i => i.ThesisType)
                      .Include(i => i.Thesis)
                      .ThenInclude(i => i.ThesisUsers)
                      .ThenInclude(i => i.User)
                      .Include(i => i.User)
                      .FirstOrDefaultAsync(i => i.Id == id, ct)
                ?? throw new NotFoundException("Thesis evaluation not found");

        if (!BCrypt.Net.BCrypt.Verify(pass, item.PassphraseHash))
        {
            throw new NotAllowedException("Invalid passphrase");
        }

        return item;
    }

    private async Task<ThesisEvaluation> GetWithGrant(Guid id, CancellationToken ct)
    {
        if (!_userProvider.HasSomeOfGrants(Grants.User_SuperAdmin, Grants.Action_ThesisEvaluation_Manage))
        {
            throw new NotAllowedException("You are not allowed to manage this thesis evaluations");
        }

        return await _db.ThesisEvaluations
                  .Include(i => i.Thesis)
                  .ThenInclude(i => i.ThesisType)
                  .Include(i => i.Thesis)
                  .ThenInclude(i => i.ThesisUsers)
                  .ThenInclude(i => i.User)
                  .Include(i => i.User)
                  .FirstOrDefaultAsync(i => i.Id == id, ct)
            ?? throw new NotFoundException("Thesis evaluation not found");
    }

    public async Task<List<ThesisEvaluationDto>> GetAllAsync(Guid id, CancellationToken ct)
    {
        var items = await _db.ThesisEvaluations
           .Include(i => i.User)
           .Where(i => i.ThesisId == id).ToListAsync(ct);
        var dtos = _mapper.Map<List<ThesisEvaluationDto>>(items);
        return dtos;
    }

    public async Task<ThesisEvaluationDetailDto> GetOneAsync(Guid id, string pass, CancellationToken ct)
    {
        var item = await GetWithPassword(id, pass, ct);
        // when first time opened, check status, set it to accepted if it is not already
        await TryUpdateStatusWhenUnclockedAsync(ct, item);

        var dto = _mapper.Map<ThesisEvaluationDetailDto>(item);

        var context = GetContext(item);
        var candidates = _thesisEvaluations.Where(i => i.CanProcess(context)).ToList();
        dto.FormatCandidates = candidates.Select(i => i.TemplateName).ToList();
        if (dto.Format.IsNotNullOrEmpty())
        {
            var model = GetModel(dto.Format)!;
            dto.Response = model.GetModel(context);
            dto.Questions = model.GetQuestions(context);
        }

        return dto;
    }
    
    private ThesisEvaluationContext GetContext(ThesisEvaluation item)
    {
        return new ThesisEvaluationContext
        {
            Evaluator = _userProvider.CurrentUser,
            Language = item.Language,
            Thesis = item.Thesis,
            UserFunction = item.UserFunction,
            ThesisEvaluation = item,
        };
    }

    private IThesisEvaluation? GetModel(string templateName)
    {
        return _thesisEvaluations.FirstOrDefault(i => i.TemplateName == templateName);
    }

    private async Task TryUpdateStatusWhenUnclockedAsync(CancellationToken ct, ThesisEvaluation item)
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

    public async Task<OneOf<ThesisEvaluationDto, Exception>> Upsert(ThesisEvaluationDto dto, CancellationToken ct)
    {
        ThesisEvaluationDto.Validate(dto);
        var item = await _db.ThesisEvaluations.FirstOrDefaultAsync(i => i.Id == dto.Id, ct);
        if (item == null)
        {
            item = _mapper.Map<ThesisEvaluation>(dto);
            item.CreatedByUserId = _userProvider.CurrentUserId;
            item.Status = EvaluationStatus.Prepared;
            await _db.ThesisEvaluations.AddAsync(item, ct);
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
        return _mapper.Map<ThesisEvaluationDto>(item);
    }

    public async Task<ThesisEvaluationDto> ChangeStatus(Guid id, EvaluationStatus status, string? pass, CancellationToken ct)
    {
        if (status == EvaluationStatus.Invited)
        {
            // need grant to be able to invite
            var item = await GetWithGrant(id, ct);

            if (item.Status == EvaluationStatus.Prepared)
            {
                await ChangeToInvitedAsync(item, ct);
                await _db.SaveChangesAsync(ct);
                return _mapper.Map<ThesisEvaluationDto>(item);
            }
        }

        if (status == EvaluationStatus.Submitted)
        {
            var password = pass ?? throw new NotAllowedException("Passphrase is required");
            var item = await GetWithPassword(id, password, ct);
            
            if (item.Status.In(EvaluationStatus.Accepted, EvaluationStatus.Draft, EvaluationStatus.Invited, EvaluationStatus.Reopened) && item.Format.IsNotNullOrEmpty())
            {
                var model = GetModel(item.Format)
                    ?? throw new NotAllowedException("Invalid format");
                await model.ValidateAndThrowAsync(GetContext(item));
                await ChangeStatusToSubmittedAsync(item, ct);
                await _db.SaveChangesAsync(ct);
                return _mapper.Map<ThesisEvaluationDto>(item);
            }
        }

        throw new NotAllowedException("Cannot change status of the evaluation this way");
    }

    private async Task ChangeToInvitedAsync(ThesisEvaluation item, CancellationToken ct)
    {
        var passphrase = _wordGeneratorService.GeneratePassPhrase();
        item.PassphraseHash = BCrypt.Net.BCrypt.HashPassword(passphrase);
        item.Status = EvaluationStatus.Invited;
        // TODO: email service here
        // TODO: save email to db
    }

    private async Task ChangeStatusToSubmittedAsync(ThesisEvaluation item, CancellationToken ct)
    {
        item.Status = EvaluationStatus.Submitted;
        // TODO: generate PDF
        // TODO: save PDF to db
        // TODO: email service here
    }

    public async Task DeleteOne(Guid id, CancellationToken ct)
    {
        var item = await GetWithGrant(id, ct);

        if (item.Status != EvaluationStatus.Prepared)
        {
            throw new NotAllowedException("Cannot delete evaluation that is already in progress");
        }

        _db.ThesisEvaluations.Remove(item);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<OneOf<ThesisEvaluationDetailDto, Exception>> UpdateOne(ThesisEvaluationDetailDto dto, string pass, CancellationToken ct)
    {
        var item = await GetWithPassword(dto.Id, pass, ct);

        _mapper.Map(dto, item);
        if (!_db.ModifiedPropertiesFor(item).ToList().ContainsOnly(nameof(ThesisEvaluation.Response), nameof(ThesisEvaluation.Format), nameof(ThesisEvaluation.Modified)))
        {
            throw new NotAllowedException("Detected attempt to change other properties than evaluation data");
        }

        await _db.SaveChangesAsync(ct);
        return await GetOneAsync(item.Id, pass, ct);
    }

    public async Task<ThesisEvaluationPeekDto> PeekAsync(Guid id, CancellationToken ct)
    {
        var item = await _db.ThesisEvaluations
                      .Include(i => i.User)
                      .Include(i => i.Thesis)
                      .ThenInclude(i => i.ThesisType)
                      .FirstOrDefaultAsync(i => i.Id == id, ct)
                ?? throw new NotFoundException("Thesis evaluation not found");

        var dto = _mapper.Map<ThesisEvaluationPeekDto>(item);
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
}