using Unidesk.Db.Models;

namespace Unidesk.Utils.Extensions;

public static class UserFunctionExtensions
{
    
    /// <summary>
    /// Combine enumarable of enums bitwise
    /// </summary>
    /// <param name="functions"></param>
    /// <returns></returns>
    public static UserFunction Combine(this IEnumerable<UserFunction> functions)
    {
        var userFunctions = functions as UserFunction[] ?? functions.ToArray();
        
        if (!userFunctions.Any())
        {
            return UserFunction.None;
        }
        
        return userFunctions.Aggregate((x, y) => x | y);
    }
}