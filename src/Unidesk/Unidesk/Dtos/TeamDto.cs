﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using FluentValidation;
using Unidesk.Db.Models;
using Unidesk.Dtos.Documents;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Validations;

namespace Unidesk.Dtos;

public class TeamDto : TrackedEntityDto
{
    [Required]
    public List<TeamUserLookupDto> Users { get; set; } = new();

    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public string? Email { get; set; }
    public DocumentDto? ProfileImage { get; set; }
    public Guid? ProfileImageId { get; set; }
    public TeamType Type { get; set; }


    public static void ValidateAndThrow(TeamDto item) => new TeamDtoValidator().ValidateAndThrow(item);
}