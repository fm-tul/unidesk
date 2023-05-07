using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class Document : TrackedEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public long Size { get; set; }
    public string ContentType { get; set; }
    public string Extension { get; set; }

    public Guid DocumentContentId { get; set; }
    public DocumentContent DocumentContent { get; set; }
    
    /// <summary>
    /// for accessing document, we will not use Id, as it is not secure
    /// we will this field and when document is published we will release the access key
    /// </summary>
    public Guid AccessKey { get; set; } = Guid.NewGuid();
}