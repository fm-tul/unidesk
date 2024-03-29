﻿using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Unidesk.Dtos;

public class IdEntityDto : DtoBase
{
    [Required]
    public Guid Id { get; set; }
}