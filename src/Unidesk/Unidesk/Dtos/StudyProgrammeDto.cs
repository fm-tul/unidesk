﻿using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class StudyProgrammeDto : TrackedEntityDto

{
    [Required]
    public string NameEng { get; set; }
    
    [Required]
    public string NameCze { get; set; }
    
    [Required]
    public string? Code { get; set; }
    
    [Required]
    public string? DescriptionEng { get; set; }
    
    [Required]
    public string? DescriptionCze { get; set; }

    public static void ValidateAndThrow(StudyProgrammeDto item) => new StudyProgrammeDtoValidation().ValidateAndThrow(item);
}