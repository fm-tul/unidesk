using Microsoft.OpenApi.Extensions;
using Unidesk.Db.Models;
using Unidesk.Db.Models.UserPreferences;

namespace Unidesk.Security;

public static class GrantsExtensions
{
    private static AttributeInfo GetGrantInfo(Grants grant) =>
        grant.GetAttributeOfType<AttributeInfo>()
     ?? throw new Exception($"Grant {grant} has no GrantInfoAttribute");
    
    private static AttributeInfo GetGrantInfo(Preferences pref) =>
        pref.GetAttributeOfType<AttributeInfo>()
     ?? throw new Exception($"Grant {pref} has no GrantInfoAttribute");

    public static string GrantName(this Grants grant) => GetGrantInfo(grant).Name;
    public static string GrantDescription(this Grants grant) => GetGrantInfo(grant).Description;
    public static Guid GrantId(this Grants grant) => GetGrantInfo(grant).Id;
    
    public static AttributeInfoItem AsAttributeInfo(this Grants grant) => GetGrantInfo(grant).AsAttributeInfoItem();
    public static AttributeInfoItem AsAttributeInfo(this Preferences pref) => GetGrantInfo(pref).AsAttributeInfoItem();
}