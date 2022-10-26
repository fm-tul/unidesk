using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;
using Unidesk.Services.ThesisTransitions;
using Unidesk.Utils.Extensions;
using Unidesk.Validations;

namespace Unidesk.Controllers;

[Route("api/[controller]")]
public class ThesisController : Controller
{
    private readonly IMapper _mapper;
    private readonly UnideskDbContext _db;
    private readonly ILogger<ThesisController> _logger;
    private readonly IUserProvider _userProvider;
    private readonly ThesisTransitionService _thesisTransitionService;

    public ThesisController(IMapper mapper, UnideskDbContext db, ILogger<ThesisController> logger, IUserProvider userProvider, ThesisTransitionService thesisTransitionService)
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
    [ProducesResponseType(typeof(PagedResponse<ThesisDto>), 200)]
    public async Task<IActionResult> Find([FromBody] ThesisFilter requestFilter)
    {
        var query = _db.Theses.Query();

        if (requestFilter.UserId.HasValue)
        {
            query = query.Where(i => i.ThesisUsers.Any(j => j.UserId == requestFilter.UserId));
        }

        if (requestFilter.Keyword.IsNotNullOrEmpty())
        {
            var pattern = $"%{requestFilter.Keyword}%";
            query = query.Where(i =>
                EF.Functions.Like(i.NameCze, pattern)
             || EF.Functions.Like(i.NameEng, pattern)
             || (i.AbstractCze != null && EF.Functions.Like(i.AbstractCze, pattern))
             || (i.AbstractEng != null && EF.Functions.Like(i.AbstractEng, pattern))
             || (i.Adipidno != null && EF.Functions.Like(i.Adipidno.ToString()!, pattern))
             || (i.ThesisUsers.Any(j =>
                    (j.User.FirstName != null && EF.Functions.Like(j.User.FirstName, pattern))
                 || (j.User.LastName != null && EF.Functions.Like(j.User.LastName, pattern))
                ))
            );
        }

        if (requestFilter.Keywords.Any() && requestFilter.Keywords.Count == 1)
        {
            var kw = requestFilter.Keywords.First();
            query = query.Where(i => i.KeywordThesis.Any(j => j.KeywordId == kw));
        }

        if (requestFilter.Status.HasValue)
        {
            query = query.Where(i => i.Status == requestFilter.Status.Value);
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
           .ToListWithPagingAsync<Thesis, ThesisDto>(requestFilter.Filter, _mapper);

        return Ok(response);
    }

    [HttpPost, Route("upsert")]
    [SwaggerOperation(OperationId = nameof(Upsert))]
    [ProducesResponseType(typeof(ThesisDto), 200)]
    [ProducesResponseType(typeof(SimpleJsonResponse), 500)]
    [RequireGrant(UserGrants.Entity_Thesis_Edit_Id)]
    public async Task<IActionResult> Upsert([FromBody] ThesisDto dto)
    {
        ThesisDtoValidator.ValidateAndThrow(dto);
        var isNew = dto.Id == Guid.Empty;
        var item = isNew
            ? new Thesis()
            : await _db.Theses
                 .Query()
                 .FirstOrDefaultAsync(dto.Id)
           ?? throw new Exception("Thesis not found");

        var newState = dto.Status;
        var context = new TransitionContext(item, newState, _userProvider.CurrentUser);
        await _thesisTransitionService
           .ChangeStateAsync(context)
           .MatchAsync(
                i => item.Status = i,
                i => throw new ValidationException(i.Message, new[] { new ValidationFailure { ErrorMessage = i.Description, PropertyName = nameof(item.Status) } })
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
        item.KeywordThesis = dto.Keywords.Select(i => new KeywordThesis { ThesisId = item.Id, KeywordId = i.Id }).ToList();

        var studentsDto = _mapper.Map<List<User>>(dto.Authors).Select(i => i.InThesis(item, UserFunction.Author)!);
        var supervisorsDto = _mapper.Map<List<User>>(dto.Supervisors).Select(i => i.InThesis(item, UserFunction.Supervisor)!);
        var opponentsDto = _mapper.Map<List<User>>(dto.Opponents).Select(i => i.InThesis(item, UserFunction.Opponent)!);

        var newThesisUsers = new List<ThesisUser>();
        newThesisUsers.AddRange(studentsDto);
        newThesisUsers.AddRange(supervisorsDto);
        newThesisUsers.AddRange(opponentsDto);

        if (isNew)
        {
            // new thesis, simple users
            item.ThesisUsers = newThesisUsers.Select(i => i.StripToGuids()).ToList();
            await _db.Theses.AddAsync(item);
        }
        else
        {
            // handling students/authors/supervisors/oppontents is bit more complicated
            var (_, _, toBeAdded, toBeDeleted) = item.ThesisUsers.Synchronize(newThesisUsers, (i, j) => i.UserId == j.UserId);
            _db.ThesisUsers.AddRange(toBeAdded.Select(i => i.StripToGuids()));
            _db.ThesisUsers.RemoveRange(toBeDeleted);

            _logger.LogInformation("Removed {Count} users from thesis {ThesisId}", toBeDeleted.Count, item.Id);
            _db.Theses.Update(item);
        }

        await _db.SaveChangesAsync();
        return Ok(_mapper.Map<ThesisDto>(await _db.Theses.Query().FirstAsync(item.Id)));
    }
}