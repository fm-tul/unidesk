using System.Security.Cryptography;
using System.Text;
using Unidesk.Db.Models;

namespace Unidesk.Utils;

public static class CryptographyUtils
{
    public static string Hash(User user)
    {
        return Hash(user.Id.ToString(), $"{user.Created:O}");
    }
    
    public static string Hash(string userId, string created)
    {   
        var words = new[] {userId, created};
        var inputWord = string.Join("::", words);
        
        return Convert.ToBase64String(
            SHA256.Create()
            .ComputeHash(Encoding.UTF8.GetBytes(inputWord))
        );
    }
}