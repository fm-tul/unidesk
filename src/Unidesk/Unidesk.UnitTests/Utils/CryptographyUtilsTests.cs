using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using FluentAssertions;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Utils;
using Xunit;

namespace Unidesk.UnitTests.Utils;

public class CryptographyUtilsTests
{
    [Fact]
    public void Test_Hash_Verify_Hash()
    {
        var now = DateTime.Now;
        var guid = Guid.NewGuid();
        var props1 = new List<KeyValuePair<string, string>>
        {
            new KeyValuePair<string, string>(ClaimTypes.NameIdentifier, guid.ToString()),
            new KeyValuePair<string, string>(ClaimTypes.DateOfBirth, now.ToString(CultureInfo.InvariantCulture)),
        };
        
        var props2 = new List<KeyValuePair<string, string>>
        {
            new KeyValuePair<string, string>(ClaimTypes.NameIdentifier, guid.ToString()),
            new KeyValuePair<string, string>(ClaimTypes.DateOfBirth, now.AddDays(1).ToString(CultureInfo.InvariantCulture)),
        };
        
        var props3 = new List<KeyValuePair<string, string>>
        {
            new KeyValuePair<string, string>(ClaimTypes.NameIdentifier, guid.ToString()),
            new KeyValuePair<string, string>(ClaimTypes.DateOfBirth, now.AddHours(24).ToString(CultureInfo.InvariantCulture)),
        };

        var hash1 = CryptographyUtils.Hash(props1);
        var hash2 = CryptographyUtils.Hash(props2);
        var hash3 = CryptographyUtils.Hash(props3);

        hash1.Should().NotBe(hash2);
        hash1.Should().NotBe(hash3);
        hash2.Should().Be(hash3);
    }

    [Theory]
    [InlineData("1234567890")]
    [InlineData("12345678901")]
    [InlineData("a")]
    [InlineData("abc")]
    [InlineData("abcdefghijklmnopqrstuvwd asda sxasdyz    ")]
    public void Test_Encrypt_Decrypt(string text)
    {
        var random = new Random(1234);
        var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var cryptoInstance = new CryptographyUtils(new AppOptions
        {
            // random 32 bytes
            AesKey = string.Join("", Enumerable.Range(0, 32).Select(i => characters[random.Next(characters.Length)])),
            // random 16 bytes
            AesIV = string.Join("", Enumerable.Range(0, 16).Select(i => characters[random.Next(characters.Length)])),
        });
        var encrypted = cryptoInstance.EncryptText(text);
        var decrypted = cryptoInstance.DecryptText(encrypted);
        decrypted.Should().Be(text.Trim());
    }
}