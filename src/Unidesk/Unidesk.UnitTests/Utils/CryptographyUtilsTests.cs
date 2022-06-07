using System;
using System.Linq;
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
        var guid1 = Guid.NewGuid();
        var date1 = DateTime.Now;
        var hash1 = CryptographyUtils.Hash(guid1, date1);
        var hash1a = CryptographyUtils.Hash(new User { Id = guid1, Created = date1 });

        var guid2 = Guid.NewGuid();
        var date2 = DateTime.Now.AddDays(1);
        var hash2 = CryptographyUtils.Hash(guid2, date2);

        hash1.Should().NotBeEquivalentTo(hash2);
        hash1.Should().BeEquivalentTo(hash1a);
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