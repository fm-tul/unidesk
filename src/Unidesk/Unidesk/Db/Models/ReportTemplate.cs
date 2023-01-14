using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class ReportTemplate : TrackedEntity
{
    /// <summary>
    /// Unique Name of the Report Template 
    /// </summary>
    public string Name { get; set; } = null!;
    
    
    /// <summary>
    /// Locale of the Report Template, if null dynamic locale is used
    /// </summary>
    public string? Locale { get; set; }
    
    
    /// <summary>
    /// Latex Template of the Report
    /// </summary>
    public byte[] Template { get; set; } = Array.Empty<byte>();
}