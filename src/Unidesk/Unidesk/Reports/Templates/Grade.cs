using System.Text.Json.Serialization;
using Microsoft.OpenApi.Extensions;
using Unidesk.Client;

namespace Unidesk.Reports.Templates;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(Grade), GenerateAggregation = true, Name = nameof(Grade))]
public enum Grade
{
    // 1) - Excellent
    [MultiLang("Excellent (1)", "Výborně (1)")]
    GradeA,

    // 1-) Excellent Minus
    [MultiLang("Excellent Minus (1-)", "Výborně Minus (1-)")]
    GradeAMinus,

    // 2) - Very Good
    [MultiLang("Very Good (2)", "Velmi Dobře (2)")]
    GradeB,

    // 2-) Very Good Minus
    [MultiLang("Very Good Minus (2-)", "Velmi Dobře Minus (2-)")]
    GradeBMinus,

    // 3) - Good
    [MultiLang("Good (3)", "Dobře (3)")]
    GradeC,

    // 4) - Failed
    [MultiLang("Failed (4)", "Nedostatečně (4)")]
    GradeD,
}

public static class GradeExtensions
{
    public static MultiLangAttribute? GetLangAttributeFromGradeValue(this string? value)
    {
        var hasValue = Enum.TryParse<Grade>(value, out var grade);
        return !hasValue ? null : grade.GetAttributeOfType<MultiLangAttribute>();
    }
}