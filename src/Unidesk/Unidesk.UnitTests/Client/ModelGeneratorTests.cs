﻿using System.IO;
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
        
        // second
        // call should not generate anything
        ModelGenerator.Generate(typeof(ModelGeneratorTests), "./tmp").ToList()
            .Should().HaveCount(0);
    }
}

public class Foobar
{
    public string Foo { get; set; }
    public int Bar { get; set; }
    public bool Baz { get; set; }
}

[GenerateModel(Name = "Foo.strings", GenerateAggregation = true, ForType = typeof(string))]
[GenerateModel(Name = "Foo.Foobar", GenerateAggregation = false, ForType = typeof(Foobar))]
public static class Foo
{
    public readonly static string A = "A";
    public readonly static string B = "B";

    public readonly static Foobar AA = new() { Foo = "AA", Bar = 1, Baz = true };
    public readonly static Foobar BB = new() { Foo = "BB", Bar = 2, Baz = false };
    public readonly static Foobar CC = new() { Foo = "CC", Bar = 3, Baz = true };
}