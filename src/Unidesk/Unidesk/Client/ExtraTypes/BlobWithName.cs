using System.ComponentModel.DataAnnotations;

namespace Unidesk.Client.ExtraTypes;

public class BlobWithName
{
    [Required]
    public IFormFile Data { get; set; } = null!;
    
    [Required]
    public string Name { get; set; } = null!;
}