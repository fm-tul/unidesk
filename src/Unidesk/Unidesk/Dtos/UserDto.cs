﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserDto : UserSimpleDto
{
    [Required]
    public List<UserRoleDto> Roles { get; set; } = new();
    
    [Required]
    public List<Guid> GrantIds => Roles
       .SelectMany(i => i.Grants)
       .Select(i => i.Id)
       .Distinct()
       .ToList();
    
    [Required]
    public UserFunction UserFunction { get; set; }
    
    [Required]
    public List<UserTeamLookupDto> Teams { get; set; } = new();

    [Required]
    public List<ThesisSimpleWithUserDto> AllThesis { get; set; } = new();
    
    public UserPreferenceOptions? Preferences { get; set; }
    
    [Required]
    public StateEntity State { get; set; }
}