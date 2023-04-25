using Unidesk.Db.Core;
using Unidesk.Db.Models;

namespace Unidesk.Utils.Extensions;

public static class UserExtensions
{
    public static string FullName(this ISimpleUser user)
    {
        if (!string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName))
        {
            return $"{user.LastName.ToUpper()} {user.FirstName}";
        }

        if (!string.IsNullOrEmpty(user.Email))
        {
            return user.Email.Split('@')[0];
        }
            
        if (!string.IsNullOrEmpty(user.Username))
        {
            return user.Username;
        }
        
        return user.Id.ToString();

    }
    
    public static bool HasAll(this User user, params UserFunction[] functions)
    {
        var combined = functions.Combine();
        return (user.UserFunction & combined) == combined;
    }
    
    public static bool Is(this User user, UserFunction function)
    {
        return (user.UserFunction & function) > 0;
    }
    
    public static bool IsNot(this User user, UserFunction function)
    {
        return (user.UserFunction & function) == 0;
    }
    
    public static bool HasAny(this User user, params UserFunction[] functions)
    {
        var combined = functions.Combine();
        return (user.UserFunction & combined) > 0;
    }
    
    public static string? GetEmail(this User user)
    {
        return user.Email ?? user.Aliases.FirstOrDefault()?.Email;
    }
    
    public static bool IsAdmin(this User user)
    {
        return user.Email == "admin@temata.fm.tul.cz";
    }
}