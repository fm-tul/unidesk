using System.Security.Cryptography;
using System.Text;
using Unidesk.Configurations;
using Unidesk.Db.Models;

namespace Unidesk.Utils;

public class CryptographyUtils
{
    private static readonly char[] PaddingCharacters = Enumerable.Range(0, 16).Select(i => (char) i).ToArray();
    private readonly AppOptions _appOptions;
    
    public CryptographyUtils(AppOptions appOptions)
    {
        _appOptions = appOptions;
    }
    
    
    public static string Hash(List<KeyValuePair<string, string>> props)
    {
        var words = new List<string>();
        foreach (var prop in props.OrderBy(i => i.Key))
        {
            if (prop.Key == "Fingerprint")
            {
                continue;
            }
            words.Add(prop.Key);
            words.Add(prop.Value);
        }
        
        var inputWord = string.Join("::", words);
        return Convert.ToBase64String(
            SHA256.Create()
                .ComputeHash(Encoding.UTF8.GetBytes(inputWord))
        );
    }

    public string DecryptText(string base64Text)
    {
        var safeBase64 = base64Text.Replace(":", "/");
        var cipherText = Convert.FromBase64String(safeBase64);
        var decryptor = CreateAesCipherInstance().CreateDecryptor();
        var bytes = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);
        
        var plainText = Encoding.UTF8.GetString(bytes)
            .TrimEnd(PaddingCharacters)
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
        cipher.Padding = PaddingMode.Zeros;
        cipher.Key = Encoding.UTF8.GetBytes(_appOptions.AesKey);
        cipher.IV = Encoding.UTF8.GetBytes(_appOptions.AesIV);
        return cipher;
    }

    public static PasswordIssues GetPasswordStrength(string requestPasswordBase64)
    {
        var requestPassword = Encoding.UTF8.GetString(Convert.FromBase64String(requestPasswordBase64));
        var issues = PasswordIssues.None;
        if (!requestPassword.Any(char.IsLower))
        {
            issues |= PasswordIssues.Min1Lowercase;
        }
        
        if (!requestPassword.Any(char.IsUpper))
        {
            issues |= PasswordIssues.Min1Uppercase;
        }
        
        if (!requestPassword.Any(char.IsNumber))
        {
            issues |= PasswordIssues.Min1Number;
        }
        
        if (!requestPassword.Any(char.IsSymbol) && !requestPassword.Any(i => "!@#$%^&*()_+`-=[]{}|;':\",./<>?".Contains(i)))
        {
            issues |= PasswordIssues.Min1SpecialChar;
        }

        return issues;
    }

    public static string GenerateToken()
    {
        var tokenStr = $"{Guid.NewGuid()}-{Guid.NewGuid()}";
        var tokenHash = BCrypt.Net.BCrypt.HashPassword(tokenStr)!;
        var tokenBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenHash));
        var tokenWithSafeChars = tokenBase64.Replace("/", "_");
        return tokenWithSafeChars;
    }
}

[Flags]
public enum PasswordIssues
{
    None,
    Min8Chars,
    Min1Lowercase,
    Min1Uppercase,
    Min1Number,
    Min1SpecialChar,
}