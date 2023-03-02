using Unidesk.Db.Models;

namespace Unidesk.Utils.Extensions;

public static class ThesisUserExtensions
{

    public static ThesisUser? InThesis(this User? user, Thesis thesis, UserFunction function)
    {
        if (user is null)
        {
            return null;
        }

        return new ThesisUser
        {
            User = user,
            UserId = user.Id,
            Thesis = thesis,
            ThesisId = thesis.Id,
            Function = function,
        };
    }
}