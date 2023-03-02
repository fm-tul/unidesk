using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Unidesk.Dtos;

public class ToastResponse<T>
{
    [Required]
    public string Message { get; set; }
    
    public string? Title { get; set; }
    
    [Required]
    public ToastType Type { get; set; } = ToastType.Success;
    
    [Required]
    public T Data { get; set; }
}


[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ToastType
{
    Success,
    Error,
    Warning,
    Info
}