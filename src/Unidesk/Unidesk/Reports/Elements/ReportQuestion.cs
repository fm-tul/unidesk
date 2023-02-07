﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Unidesk.Dtos;

namespace Unidesk.Reports.Elements;

[JsonDerivedType(typeof(ReportQuestion), typeDiscriminator: "base")]
[JsonDerivedType(typeof(GradeQuestion), typeDiscriminator: "grade")]
[JsonDerivedType(typeof(TextQuestion), typeDiscriminator: "text")]
[JsonDerivedType(typeof(ShortTextQuestion), typeDiscriminator: "short_text")]
[JsonDerivedType(typeof(SectionQuestion), typeDiscriminator: "section")]
[JsonDerivedType(typeof(CustomChoiceQuestion<Questions.CustomChoiceQuestions.DefenseQuestionAnswer>), typeDiscriminator: "choice")]
public class ReportQuestion
{
    [Required]
    public required Guid Id { get; init; }

    [Required]
    public required string Question { get; init; }

    public string? Description { get; init; }
}

public class SectionQuestion : ReportQuestion { }