using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AutoMapper;
using Unidesk.Db.Core;
using Unidesk.Dtos;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Utils.Extensions;

namespace Unidesk.Db.Models;

[AutoMap(typeof(UserDto))]
public class User : TrackedEntity, ISimpleUser
{
    public string? Username { get; set; }
    public string? StagId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MiddleName { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }
    
    [NotMapped]
    public string? FullName => this.FullName();

    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Address { get; set; }
    public string? Position { get; set; }
    
    public Guid? AvatarId { get; set; }
    public Document? Avatar { get; set; }
    
    public string? Work { get; set; }
    public string? WorkAddress { get; set; }
    public string? WorkPosition { get; set; }
    public List<UserRole> Roles { get; set; } = new();

    public UserFunction UserFunction { get; set; }
    
    
    [NotMapped]
    public List<Team> Teams => UserInTeams.Select(x => x.Team).ToList();
    
    [IgnoreMapping]
    public List<UserInTeam> UserInTeams { get; set; } = new();
    
    public List<ThesisUser> Theses { get; set; } = new();

    [NotMapped]
    [IgnoreMapping]
    public List<Grant> Grants => Roles.SelectMany(r => r.Grants).ToList();
    
    [NotMapped]
    public List<Guid> GrantIds => Grants.Select(g => g.Id).ToList();

    [NotMapped]
    public int ThesisCount => Theses.Count;

    public bool HasGrant(string entityTeamEditId)
    {
        return Grants.Any(g => g.Name == entityTeamEditId);
    }
}