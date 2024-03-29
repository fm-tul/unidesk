﻿using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Models;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Server;

namespace Unidesk.Dtos;

public class UserInTeamDto : UserLookupDto
{
    public UserInTeamStatus Status { get; set; }
    public TeamRole Role { get; set; }
}