using System.Security.Cryptography;
using System.Text;
using Unidesk.Configurations;
using Unidesk.Db.Models;

namespace Unidesk.Utils;

public class CryptographyUtils
{
    private static char[] paddingCharacters = Enumerable.Range(0, 16).Select(i => (char) i).ToArray();
    private readonly AppOptions _appOptions;
    
    public CryptographyUtils(AppOptions appOptions)
    {
        _appOptions = appOptions;
    }
    
    
    public static string Hash(User user)
    {
        return Hash(user.Id, user.Created);
    }

    public static string Hash(Guid userId, DateTime userCreated)
    {
        return Hash(userId.ToString(), $"{userCreated:O}");
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
    
    

    public string DecryptText(string base64Text)
    {
        var cipherText = Convert.FromBase64String(base64Text);
        var decryptor = CreateAesCipherInstance().CreateDecryptor();
        var bytes = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);
        
        var plainText = Encoding.UTF8.GetString(bytes)
            .TrimEnd(paddingCharacters)
            .Trim();
        
        return plainText;
    }
    
    public string EncryptText(string plainText)
    {
        var encryptor = CreateAesCipherInstance().CreateEncryptor();
        var bytes = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(plainText), 0, plainText.Length);
        var base64Text = Convert.ToBase64String(bytes);
        return base64Text;
    }

    private Aes CreateAesCipherInstance()
    {
        // using AES-256-CBC with a 256-bit key and a 128-bit IV and PKCS7 padding
        var cipher = Aes.Create();
        cipher.Mode = CipherMode.CBC;
        cipher.Padding = PaddingMode.PKCS7;
        cipher.Key = Encoding.UTF8.GetBytes(_appOptions.AesKey);
        cipher.IV = Encoding.UTF8.GetBytes(_appOptions.AesIV);
        return cipher;
    }
}