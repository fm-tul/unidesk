using FluentAssertions;
using Unidesk.Utils.Extensions;
using Xunit;

namespace Unidesk.UnitTests.Utils.Extensions;

public class StringExtensionsTests
{
    [Fact]
    public void Value_Should_Be_Null()
    {
        "".Value().Should().BeNull();
        " ".Value().Should().BeNull();
        "  ".Value().Should().BeNull();
        "  \t ".Value().Should().BeNull();
        "  \n ".Value().Should().BeNull();
        "  \n\t ".Value().Should().BeNull();
        ((string?)null).Value().Should().BeNull();
    }
    
    [Fact]
    public void Value_Should_Not_Be_Null()
    {
        "foo".Value().Should().Be("foo");
        "Foo".Value().Should().Be("Foo");
        "Foo ".Value().Should().Be("Foo");
        " Foo ".Value().Should().Be("Foo");
        "\tFoo ".Value().Should().Be("Foo");
        "\tFoo \nBar\n".Value().Should().Be("Foo \nBar");
    }

    [Fact]
    public void Value_Is_Valid_Email()
    {
        var validEmail = "foo.bar@foobar.com";
        validEmail.ValidEmailOrDefault().Should().Be(validEmail);
        
        var invalidEmail = "@tul.cz";
        invalidEmail.ValidEmailOrDefault().Should().BeNull();
        
        string? alsoInvalidEmail = null;
        alsoInvalidEmail.ValidEmailOrDefault().Should().BeNull();
    }
}