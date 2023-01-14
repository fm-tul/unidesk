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
        cipher.Padding = PaddingMode.Zeros;
        cipher.Key = Encoding.UTF8.GetBytes(_appOptions.AesKey);
        cipher.IV = Encoding.UTF8.GetBytes(_appOptions.AesIV);
        return cipher;
    }
}