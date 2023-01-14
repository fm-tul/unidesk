using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Requests;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class TeamService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<TeamService> _logger;

    public TeamService(UnideskDbContext db, IMapper mapper, ILogger<TeamService> logger)
    {
        _db = db;
        _mapper = mapper;
        _logger = logger;
    }

    public IQueryable<Team> WhereFilter(TeamFilter filter)
    {
        var query = _db.Teams.Query();

        if (filter.Keyword.IsNotNullOrEmpty())
        {
            var keyword = filter.Keyword;
            var keywordLike = $"%{keyword}%";
            var isGuid = Guid.TryParse(keyword, out var guid);

            query = query.Where(x =>
                (isGuid && x.Id == guid) ||
                (EF.Functions.Like(x.Name, keywordLike)) ||
                (EF.Functions.Like(x.Description, keywordLike)));
        }

        return query;
    }

    public async Task<Team?> GetOneAsync(Guid id)
    {
        return await _db.Teams
           .Query()
           .FirstAsync(id);
    }
    
    public async Task<UserInTeam?> GetOneUserInTeamAsync(Guid teamId, Guid userId)
    {
        return await _db.UserInTeams
           .FirstAsync(x => x.TeamId == teamId && x.UserId == userId);
    }

    public async Task<Team> UpsertAsync(TeamDto dto)
    {
        var isNew = dto.Id.IsEmpty();
        var item = isNew
            ? new Team()
            : await _db.Teams
                 .Query()
                 .FirstOrDefaultAsync(dto.Id)
           ?? throw new Exception("Team not found");

        item = isNew
            ? _mapper.Map<Team>(dto)
            : _mapper.Map(dto, item);

        if (isNew)
        {
            item.Id = Guid.NewGuid();
        }

        // TODO: use mapper for this
        var userInTeamOther = new List<UserInTeam>();
            /* _mapper.Map<List<UserInTeam>>(dto.UserInTeams)
           .Select(i => i.StripToGuids())
           .ToList();*/

        if (isNew)
        {
            item.UserInTeams = userInTeamOther;
            _db.Teams.Add(item);
        }
        else
        {
            var (same, sameNew, toBeAdded, toBeDeleted) = item.UserInTeams.SynchronizeWithAction(
                userInTeamOther,
                (x, y) => x.UserId == y.UserId,
                (a, b) =>
                {
                    a.Role = b.Role;
                    a.Status = b.Status;
                }
            );
            _db.UserInTeams.AddRange(toBeAdded);
            _db.UserInTeams.RemoveRange(toBeDeleted);

            _db.Teams.Update(item);
            _logger.LogInformation("Removed {Count} users from team {TeamId}", toBeDeleted.Count, item.Id);
        }

        await _db.SaveChangesAsync();

        return item;
    }
}