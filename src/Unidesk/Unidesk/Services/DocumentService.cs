using System.Text;
using Microsoft.EntityFrameworkCore;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos.Documents;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class DocumentService
{
    private readonly UnideskDbContext _db;

    public const string ApplicationPdf = "application/pdf";

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

    public Document CreateDocument(IFormFile file)
    {
        var contentData = ReadFromFile(file);
        var content = new DocumentContent
        {
            Content = contentData,
        };

        var doc = new Document
        {
            Name = file.FileName,
            ContentType = file.ContentType,
            Size = file.Length,
            Extension = Path.GetExtension(file.FileName),
            DocumentContent = content,
            DocumentContentId = content.Id,
            Description = string.Empty,
        };
        content.DocumentId = doc.Id;

        return doc;
    }

    public void UpdateDocument(Document doc, IFormFile file)
    {
        var contentData = ReadFromFile(file);
        doc.DocumentContent.Content = contentData;

        doc.Name = file.FileName;
        doc.ContentType = file.ContentType;
        doc.Size = file.Length;
        doc.Extension = Path.GetExtension(file.FileName);
    }

    private byte[] ReadFromFile(IFormFile file)
    {
        var contentData = new byte[file.Length];
        var read = file.OpenReadStream()
           .Read(contentData, 0, (int)file.Length);
        if (read != file.Length)
        {
            throw new Exception("Could not read the file");
        }

        return contentData;
    }

    public Document CreateDocument(byte[] data, string filename, string contentType = ApplicationPdf,  Guid? desiredAccessKey = null)
    {
        var content = new DocumentContent
        {
            Content = data,
        };

        var doc = new Document
        {
            Name = filename,
            ContentType = contentType,
            Size = data.Length,
            Extension = Path.GetExtension(filename),
            DocumentContent = content,
            DocumentContentId = content.Id,
            Description = string.Empty,
        };
        
        doc.AccessKey = desiredAccessKey ?? doc.AccessKey;
        content.DocumentId = doc.Id;

        return doc;
    }
    
    public async Task<IResult> GetDocumentByAccessKey(string accessKey, CancellationToken ct)
    {
        Document? doc = null;
        var isShortGuid = accessKey.TryParseShortForm(out var guid);
        if (isShortGuid)
        {
            doc = await _db.Documents
               .Query()
               .FirstOrDefaultAsync(d => d.AccessKey == guid, ct);
        }
        else
        {
            var isGuid = Guid.TryParse(accessKey, out guid);
            if (isGuid)
            {
                doc = await _db.Documents
                   .Query()
                   .FirstOrDefaultAsync(d => d.AccessKey == guid, ct);
            }
        }
    
        return doc == null 
            ? Results.NotFound() 
            : Results.Bytes(doc.DocumentContent.Content, doc.ContentType, doc.Name);
    }

    public void UpdateDocument(Document doc, byte[] data, string filename, string contentType = ApplicationPdf)
    {
        doc.DocumentContent.Content = data;
        
        doc.Name = filename;
        doc.ContentType = contentType;
        doc.Size = data.Length;
        doc.Extension = Path.GetExtension(filename);
    }
}