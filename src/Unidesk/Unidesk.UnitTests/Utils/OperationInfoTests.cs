using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Unidesk.Utils;
using Xunit;

namespace Unidesk.UnitTests.Utils;

public class OperationInfoTests
{
    [Fact]
    public void OperationInfo_Should_Determine_Generic()
    {
        var info = new OperationInfo("Foo");

        info += new List<string> { "a", "b" };

        var msg = info.ToString();

        info.TotalRows.Should().Be(2);

        msg.Should().StartWith("Foo");
        msg.Should().Contain("2 total rows");
        msg.Should().Contain("2 String in ");
    }


    [Fact]
    public void OperationInfo_Should_Determine_Generic_Short_Form()
    {
        var info = new OperationInfo();

        info += new List<string> { "a", "b" };

        var msg = info.ToString();

        info.TotalRows.Should().Be(2);

        msg.Should().NotBeEmpty();
        msg.Should().Contain("String=[2 in");
    }


    [Fact]
    public void OperationInfo_Should_Sum()
    {
        var info = new OperationInfo();
        var intArray = new[] { 0 };
        info += new List<string> { "a", "b" };
        info += intArray;
        info += new List<bool>();

        info.Add<float>(0);

        var msg = info.ToString();

        info.TotalRows.Should().Be(3);

        msg.Should().NotBeEmpty();
        msg.Should().Contain("String=[2 in");
        msg.Should().Contain("Int32=[1 in");
        msg.Should().Contain("Boolean=[0 in");
        msg.Should().Contain("Single=[0 in");
    }
}