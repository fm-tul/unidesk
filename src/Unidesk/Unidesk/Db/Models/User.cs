using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;
using Unidesk.Db.Models.UserPreferences;
using Unidesk.Security;
using Unidesk.Server;
using Unidesk.Utils.Extensions;

namespace Unidesk.Db.Models;

public class User : TrackedEntity, ISimpleUser, IStateEntity
{
    public string? Username { get; set; }
    public string? StagId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MiddleName { get; set; }
    public string? TitleBefore { get; set; }
    public string? TitleAfter { get; set; }

    [NotMapped]
    public string FullName => this.FullName();

    public string? Email { get; set; }
    /// <summary>
    /// for local accounts
    /// </summary>
    public string? PasswordHash { get; set; }
    
    public string? RecoveryToken { get; set; }
    
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

    [NotMapped]
    public List<Grant> Grants => Roles.SelectMany(r => r.Grants).Distinct().ToList();

    public UserFunction UserFunction { get; set; }

    public List<UserInTeam> UserInTeams { get; set; } = new();

    public List<ThesisUser> Theses { get; set; } = new();

    public bool HasGrant(Grants grant)
    {
        return Roles.Any(r => r.Grants.Any(g => g.Id == grant.GrantId()));
    }

    public List<User> Aliases { get; set; } = new();

    public StateEntity State { get; set; }
    
    public UserPreferenceOptions? Preferences { get; set; }
    
    
    public static bool Compare(User? user1, User? user2)
    {
        return user1?.Id == user2?.Id;
    }
    
    public bool? HasPreferenceChecked(Guid preferenceId)
    {
        var preference = Preferences?.Preferences
           .FirstOrDefault(i => i.PreferenceId == preferenceId);
        return preference is null ? null : preference.Value == "true";
    }
    public bool? HasPreferenceChecked(Preferences preference)
    {
        return HasPreferenceChecked(preference.AsAttributeInfo().Id);
    }
}

public class UserPreferenceOptions
{
    [Required]
    public List<UserPreference> Preferences { get; set; } = new(); 
}

public class UserPreference
{
    [Required]
    public Guid PreferenceId { get; set; }
    
    [Required]
    public string Value { get; set; }
    
    [Required]
    public string Type { get; set; }
}
