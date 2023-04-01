using System.Text;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos.Documents;

namespace Unidesk.Services;

public class DocumentService
{
    private readonly UnideskDbContext _db;
    public DocumentService(UnideskDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// This method is used to get a document from a document dto
    /// </summary>
    /// <param name="doc"></param>
    /// <param name="dto"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    public async Task<Document?> UpdateDocumentAsync(Document? doc, DocumentDto dto, CancellationToken ct)
    {
        
        // Guid.Empty DocumentContentId means we are creating a new document
        // null DocumentContentId means we are deleting the document
        var documentId = doc?.Id;
        
        // handle deletion
        if (dto.DocumentContentId is null && documentId is not null)
        {
            _db.Documents.Remove(doc!);
            return null;
        }
        
        if (dto.DocumentContentId != Guid.Empty)
        {
            return null;
        }

        // we have a document and content so we need to update it or create it
        var content = Encoding.ASCII.GetBytes(dto.DocumentContent);
        var document = documentId is not null
            ? await _db.Documents.FirstAsync(i => i.Id == documentId.Value, ct)
            : new Document();

        // update the document
        document.Name = dto.Name ?? "Untitled";
        document.Description = dto.Description ?? string.Empty;
        document.Size = content.Length;
        document.ContentType = dto.ContentType ?? "image/png";
        document.Extension = dto.Extension ?? "png";

        // ReSharper disable once NullCoalescingConditionIsAlwaysNotNullAccordingToAPIContract
        var documentContent = document.DocumentContent ?? new DocumentContent();
        documentContent.Content = content;
        document.DocumentContent = documentContent;

        // add or update the document
        if (documentId is null)
        {
            _db.Documents.Add(document);
        }

        return document;
    }
}