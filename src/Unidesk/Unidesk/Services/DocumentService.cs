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
    /// <param name="documentId"></param>
    /// <param name="dto"></param>
    /// <returns></returns>
    public async Task<Document?> UpdateDocumentAsync(Guid? documentId, DocumentDto? dto)
    {
        // handle deletion
        if (dto == null || string.IsNullOrEmpty(dto.DocumentContent))
        {
            // delete the document if it exists
            if (documentId is not null)
            {
                _db.Documents.Remove(new Document { Id = documentId.Value });
            }
            return null;
        }

        // we have a document and content so we need to update it or create it
        var content = Encoding.ASCII.GetBytes(dto.DocumentContent);
        var document = documentId is not null
            ? await _db.Documents.FirstAsync(i => i.Id == documentId.Value)
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