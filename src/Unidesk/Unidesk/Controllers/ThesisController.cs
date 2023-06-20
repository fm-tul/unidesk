using FluentValidation;
using FluentValidation.Results;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.ThesisTransitions;
using Unidesk.Utils.Extensions;
using Unidesk.Validations;

namespace Unidesk.Controllers;

[Route("/api/[controller]")]
[Authorize]
public class ThesisController : Controller
{
    private readonly IMapper _mapper;
    private readonly UnideskDbContext _db;
    private readonly ILogger<ThesisController> _logger;
    private readonly IUserProvider _userProvider;
    private readonly ThesisTransitionService _thesisTransitionService;

    public ThesisController(IMapper mapper, UnideskDbContext db, ILogger<ThesisController> logger,
        IUserProvider userProvider, ThesisTransitionService thesisTransitionService)
    {
        _mapper = mapper;
        _db = db;
        _logger = logger;
        _userProvider = userProvider;
        _thesisTransitionService = thesisTransitionService;
    }

    [HttpGet, Route("get-one")]
    [SwaggerOperation(OperationId = nameof(GetOne))]
    [ProducesResponseType(typeof(ThesisDto), 200)]
    public async Task<IActionResult> GetOne(string id)
    {
        var item = (Thesis?)null;

        var queryBase = _db.Theses.Query();

        if (Guid.TryParse(id, out var guid))
        {
            item = await queryBase
               .FirstOrDefaultAsync(i => i.Id == guid);
        }
        else if (long.TryParse(id, out var longId))
        {
            item = await queryBase
               .FirstOrDefaultAsync(i => i.Adipidno == longId);
        }

        if (item is null)
        {
            return BadRequest();
        }

        var dto = _mapper.Map<ThesisDto>(item);
        return Ok(dto);
    }


    [HttpPost, Route("find")]
    [SwaggerOperation(OperationId = nameof(Find))]
    [ProducesResponseType(typeof(PagedResponse<ThesisLookupDto>), 200)]
    public async Task<IActionResult> Find([FromBody] ThesisFilter requestFilter, CancellationToken ct)
    {
        var query = _db.Theses.Query();

        if (requestFilter.UserId.HasValue)
        {
            query = query.Where(i => i.ThesisUsers.Any(j => j.UserId == requestFilter.UserId));
        }

        if (requestFilter.Keyword.IsNotNullOrEmpty())
        {
            var top5SimilarKeywordsIds = await _db.Keywords
               .Where(i => i.Value.Contains(requestFilter.Keyword))
               .Select(i => i.Id)
               .ToListAsync();

            var pattern = $"%{requestFilter.Keyword}%";
            query = query.Where(i =>
                EF.Functions.Like(i.NameCze, pattern)
             || EF.Functions.Like(i.NameEng, pattern)
                // || (i.AbstractCze != null && EF.Functions.Like(i.AbstractCze, pattern))
                // || (i.AbstractEng != null && EF.Functions.Like(i.AbstractEng, pattern))
             || (i.Adipidno != null && EF.Functions.Like(i.Adipidno.ToString()!, pattern))
             || (i.ThesisUsers.Any(j =>
                    (j.User.FirstName != null && EF.Functions.Like(j.User.FirstName, pattern))
                 || (j.User.LastName != null && EF.Functions.Like(j.User.LastName, pattern))
                ))
             || (i.KeywordThesis.Any(j =>
                    top5SimilarKeywordsIds.Contains(j.KeywordId)
                ))
             || (i.KeywordThesis.Any(j =>
                    EF.Functions.Like(j.Keyword.Value, pattern)
                ))
            );
        }

        if (requestFilter.Keywords.Any())
        {
            if (requestFilter.Operator == Operator.And)
            {
                foreach (var keywordId in requestFilter.Keywords)
                {
                    query = query.Where(i => i.KeywordThesis.Any(j => j.KeywordId == keywordId));
                }
            }
            else
            {
                query = query.Where(i => i.KeywordThesis.Any(j => requestFilter.Keywords.Contains(j.KeywordId)));
            }
        }

        if (requestFilter.Status.HasValue)
        {
            query = query.Where(i => i.Status == requestFilter.Status.Value);
        }

        if (requestFilter.SchoolYearId.HasValue)
        {
            query = query.Where(i => i.SchoolYearId == requestFilter.SchoolYearId.Value);
        }

        if (requestFilter.MyThesis)
        {
            var myIds = _userProvider.CurrentUser.Aliases
               .Select(i => i.Id)
               .Concat(new[] { _userProvider.CurrentUser.Id })
               .ToList();
            query = query.Where(i => i.ThesisUsers.Any(j => myIds.Contains(j.UserId)));
        }

        if (requestFilter.HasKeywords.HasValue)
        {
            query = requestFilter.HasKeywords.Value
                ? query.Where(i => i.KeywordThesis.Any())
                : query.Where(i => !i.KeywordThesis.Any());
        }

        var response = await query
           .OrderBy(i => i.Status)
           .ThenBy(i => i.Created)
           .ToListWithPagingAsync<Thesis, ThesisLookupDto>(requestFilter.Paging, _mapper, ct);

        return Ok(response);
    }

    [HttpPost, Route("upsert")]
    [SwaggerOperation(OperationId = nameof(Upsert))]
    [ProducesResponseType(typeof(ThesisDto), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    [RequireGrant(Grants.Entity_Thesis_Edit)]
    public async Task<IActionResult> Upsert([FromBody] ThesisDto dto, CancellationToken ct)
    {
        ThesisDtoValidator.ValidateAndThrow(dto);
        var isNew = dto.Id == Guid.Empty;
        var item = isNew
            ? new Thesis()
            : await _db.Theses
                 .Query()
                 .FirstOrDefaultAsync(dto.Id, ct)
           ?? throw new Exception("Thesis not found");

        await _thesisTransitionService
           .ChangeStateAsync(new TransitionContext(
                thesis: item,
                targetStatus: dto.Status,
                currentUser: _userProvider.CurrentUser))
           .MatchAsync(
                i => item.Status = i,
                i => throw new ValidationException(i.Message,
                    new[]
                    {
                        new ValidationFailure { ErrorMessage = i.Description, PropertyName = nameof(item.Status) }
                    })
            );


        item = isNew
            ? _mapper.Map<Thesis>(dto)
            : _mapper.Map(dto, item);

        if (isNew)
        {
            item.Id = Guid.NewGuid();
        }

        item.Outcomes = _db.ThesisOutcomes.Where(i => dto.OutcomeIds.Contains(i.Id)).ToList();
        item.ThesisTypeCandidates = _db.ThesisTypes.Where(i => dto.ThesisTypeCandidateIds.Contains(i.Id)).ToList();
        if (item.ThesisTypeCandidates.Count == 1)
        {
            item.ThesisTypeId = item.ThesisTypeCandidates.Single().Id;
        }
        else
        {
            item.ThesisTypeId = null;
        }

        var newKeywordThesis = dto.Keywords
           .Select(i => new KeywordThesis { ThesisId = item.Id, KeywordId = i.Id })
           .ToList();

        var newThesisUsers = dto.Authors
           .Concat(dto.Supervisors)
           .Concat(dto.Opponents)
           .Select(i => new ThesisUser { UserId = i.User.Id, ThesisId = item.Id, Function = i.Function })
           .ToList();

        var newTeams = dto.Teams
           .Select(i => new Team { Id = i.Id })
           .ToList();

        if (newThesisUsers.GroupBy(i => i.UserId).Any(i => i.Count() > 1))
        {
            throw new ValidationException("Duplicate users",
                new[]
                {
                    new ValidationFailure { ErrorMessage = "Duplicate users", PropertyName = nameof(item.ThesisUsers) }
                });
        }

        if (isNew)
        {
            // new thesis, simple users
            item.ThesisUsers = newThesisUsers;
            item.KeywordThesis = newKeywordThesis;
            item.Teams = newTeams;
            await _db.Theses.AddAsync(item, ct);
        }
        else
        {
            // handling students/authors/supervisors/opponents and keywords and teams is bit more complicated
            var (addThesisUsers, delThesisUsers) = item.ThesisUsers.SynchronizeDbSet(newThesisUsers, _db.ThesisUsers,
                (i, j) => i.UserId == j.UserId && i.Function == j.Function);
            var (addKeywordThesis, delKeywordThesis) = item.KeywordThesis.SynchronizeDbSet(newKeywordThesis,
                _db.KeywordThesis, (i, j) => i.KeywordId == j.KeywordId);
            var (_, _, a, b) = item.Teams.Synchronize(newTeams, (i, j) => i.Id == j.Id);
            item.Teams.AddRange(_db.Teams.Where(i => a.Select(j => j.Id).Contains(i.Id)).ToList());
            item.Teams.RemoveAll(i => b.Select(j => j.Id).Contains(i.Id));

            _db.Theses.Update(item);
        }

        await _db.SaveChangesAsync(ct);
        return Ok(_mapper.Map<ThesisDto>(await _db.Theses.Query().FirstAsync(item.Id)));
    }
}