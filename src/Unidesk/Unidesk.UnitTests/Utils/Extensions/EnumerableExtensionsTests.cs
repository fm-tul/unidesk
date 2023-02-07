using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Unidesk.Utils.Extensions;
using Xunit;

namespace Unidesk.UnitTests.Utils.Extensions;

public class EnumerableExtensionsTests
{
    [Fact]
    public void ForEach_Should_Be_Enumerable_When_Returned()
    {
        var items = new List<string> { "a", "b" };
        var counter = 0;
        var enumerable = items
            .AsEnumerable()
            .ForEach(i =>
            {
                counter++;
            });

        // we have yet to enumerate
        counter.Should().Be(0);

        // now execute
        enumerable.ToList();
        counter.Should().Be(items.Count);
    }
    
    [Fact]
    public void ContainsOnly_Should_Be_True_When_Contains_All()
    {
        var items = new List<string> { "a", "b" };
        items.ContainsOnly("a", "b").Should().BeTrue();
        items.ContainsOnly("a", "b", "c").Should().BeTrue();
        
        items.ContainsOnly("a").Should().BeFalse();
        items.ContainsOnly().Should().BeFalse();
        
        var empty = new List<string>();
        empty.ContainsOnly().Should().BeTrue();
        empty.ContainsOnly("a").Should().BeTrue();
    }
}