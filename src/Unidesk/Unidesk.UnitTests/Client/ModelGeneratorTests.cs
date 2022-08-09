using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using FluentAssertions;
using Unidesk.Client;
using Xunit;

namespace Unidesk.UnitTests.Client;

public class ModelGeneratorTests
{
    [Fact]
    public void Test_Should_Generate_Client_Model()
    {
        var splitByLine = new Regex(@"\r\n|\r|\n");
        if (Directory.Exists("./tmp"))
        {
            Directory.Delete("./tmp", true);
        }
        var items = ModelGenerator.Generate(typeof(ModelGeneratorTests), "./tmp").ToList();
        items.Should().HaveCount(2);
        // is order of attributes preserved?
        var model1 = items.First();
        model1.Should().Contain("export const A = \"A\"");
        var lines1 = splitByLine.Split(model1).ToList();
        lines1.Count(i => i.Contains("export const ")).Should().Be(2 + 1);
        
        var model2 = items.Skip(1).First();
        model2.Should().Contain("export const CC = {");
        model2.Should().Contain("\"baz\":true");
        model2.Should().Contain("\"bar\":2");
    }
    
}

public class Foobar
{
    public string Foo { get; set; }
    public int Bar { get; set; }
    public bool Baz { get; set; }
}

[GenerateModel(Name = nameof(Foo), GenerateAggreation = true, ForType = typeof(string))]
[GenerateModel(Name = nameof(Foo), GenerateAggreation = false, ForType = typeof(Foobar))]
public class Foo
{
    public static string A = "A";
    public static string B = "B";
    
    public static Foobar AA = new Foobar { Foo = "AA", Bar = 1, Baz = true };
    public static Foobar BB = new Foobar { Foo = "BB", Bar = 2, Baz = false };
    public static Foobar CC = new Foobar { Foo = "CC", Bar = 3, Baz = true };
}

