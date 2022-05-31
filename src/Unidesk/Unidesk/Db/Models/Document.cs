using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Document : IdEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public long Size { get; set; }
    public string ContentType { get; set; }
    public string Extension { get; set; }

    public Guid DocumentContentId { get; set; }
    public DocumentContent DocumentContent { get; set; }
}