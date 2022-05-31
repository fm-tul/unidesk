using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class DocumentContent : TrackedEntity
{
    public Guid DocumentId { get; set; }

    [ForeignKey("DocumentId")] public Document Document { get; set; }

    public byte[] Content { get; set; }
}