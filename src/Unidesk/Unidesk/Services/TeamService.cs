using System.Text;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Documents;
using Unidesk.Dtos.Requests;
using Unidesk.Exceptions;
using Unidesk.Security;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class TeamService
{
    private readonly UnideskDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<TeamService> _logger;
    private readonly DocumentService _documentService;

    public TeamService(UnideskDbContext db, IMapper mapper, ILogger<TeamService> logger, DocumentService documentService)
    {
        _db = db;
        _mapper = mapper;
        _logger = logger;
        _documentService = documentService;
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
           .Include(i => i.ProfileImage)
           .ThenInclude(i => i.DocumentContent)
           .FirstAsync(id);
    }

    public async Task<UserInTeam?> GetOneUserInTeamAsync(Guid teamId, Guid userId)
    {
        return await _db.UserInTeams
           .Include(i => i.Team)
           .Include(i => i.User)
           .FirstAsync(x => x.TeamId == teamId && x.UserId == userId);
    }

    public async Task<Team> UpsertAsync(TeamDto dto)
    {
        var (isNew, item) = await _db.Teams.Query().GetOrCreateFromDto(_mapper, dto);
        NotFoundException.ThrowIfNullOrEmpty(item);
        
        if (isNew)
        {
            // newly created team should have the creator as admin only
            item.UserInTeams = new List<UserInTeam>();
            _db.Teams.Add(item);
        }
        else
        {
            var userInTeamOther = dto.Users.Select(i => UserInTeam.Convert(i.User.Id, item.Id, i.Status, i.Role)).ToList();
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
        
        // manual mapping
        var profileImage = await _documentService.UpdateDocumentAsync(item.ProfileImageId, dto.ProfileImage);
        item.ProfileImageId = profileImage?.Id;

        MakeSureOwnerIsValid(item);
        await _db.SaveChangesAsync();

        var fresh = await _db.Teams.Query().FirstOrDefaultAsync(item.Id);
        NotFoundException.ThrowIfNullOrEmpty(fresh);
        return fresh;
    }
    
    public TeamDto ToDto(Team item)
    {
        var dto = _mapper.Map<TeamDto>(item);
        if (dto.ProfileImage is not null && item.ProfileImage is not null)
        {
            dto.ProfileImage.DocumentContent = Encoding.ASCII.GetString(item.ProfileImage.DocumentContent.Content);
        }
        
        return dto;
    }

    public void MakeSureOwnerIsValid(Team item)
    {
        // make sure the team has a owner
        if (item.UserInTeams.All(x => x.Role != TeamRole.Owner))
        {
            var newOwner = item.UserInTeams.MinBy(i => (int)i.Role);
            if (newOwner != null)
            {
                newOwner.Role = TeamRole.Owner;
            }
        }
        
        // multiple owners are not allowed
        if (item.UserInTeams.Count(x => x.Role == TeamRole.Owner) > 1)
        {
            throw new NotAllowedException($"There can only be one owner of a team. Please assign other roles such as {nameof(TeamRole.Editor)} or {nameof(TeamRole.Viewer)} to other users.");
        }
    }

    public async Task<Team> ChangeStatus(UserInTeam userInTeam, UserInTeamStatus status)
    {
        var team = await _db.Teams.Query().FirstOrDefaultAsync(userInTeam.TeamId);
        NotFoundException.ThrowIfNullOrEmpty(team);
        
        switch (status)
        {
            case UserInTeamStatus.Removed:
                team.UserInTeams.Remove(userInTeam);
                break;
            case UserInTeamStatus.Unknown:
            case UserInTeamStatus.Accepted:
            case UserInTeamStatus.Declined:
            case UserInTeamStatus.Pending:
            case UserInTeamStatus.Requested:
            default:
                userInTeam.Status = status;
                break;
        }

        MakeSureOwnerIsValid(team);
        await _db.SaveChangesAsync();
        return team;
    }
    
    public async Task<bool> DeleteAsync(Team team)
    {
        _db.UserInTeams.RemoveRange(team.UserInTeams);
        _db.Documents.RemoveIfExists(team.ProfileImage);
        _db.Teams.Remove(team);
        // TODO: soft delete?
        
        await _db.SaveChangesAsync();
        return true;
    }
}