﻿namespace Unidesk.Dtos;

public class ThesisTypeDto : TrackedEntityDto
{
    public string NameEng { get; set; }
    public string NameCze { get; set; }
    
    public string? Code { get; set; }
    
    public string? DescriptionEng { get; set; }
    public string? DescriptionCze { get; set; }
}