using System;
using FluentAssertions;
using Unidesk.Db.Models;
using Unidesk.Utils;
using Xunit;

namespace Unidesk.UnitTests.Utils;

public class CryptographyUtilsTests
{
    [Fact]
    public void Test_Encrypt_Decrypt()
    {
        var guid1 = Guid.NewGuid();
        var date1 = DateTime.Now;
        var hash1 = CryptographyUtils.Hash(guid1, date1);
        var hash1a = CryptographyUtils.Hash(new User{Id = guid1, Created = date1});
        
        var guid2 = Guid.NewGuid();
        var date2 = DateTime.Now.AddDays(1);
        var hash2 = CryptographyUtils.Hash(guid2, date2);

        hash1.Should().NotBeEquivalentTo(hash2);
        hash1.Should().BeEquivalentTo(hash1a);
    }
}