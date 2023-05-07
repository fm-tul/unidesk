using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Dtos.Requests;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services.Email;

public class EmailService
{
    private readonly EmailOptions _emailOptions;
    private readonly UnideskDbContext _db;
    private readonly ILogger<EmailService> _logger;

    public EmailService(EmailOptions emailOptions, UnideskDbContext db, ILogger<EmailService> logger)
    {
        _emailOptions = emailOptions;
        _db = db;
        _logger = logger;
    }

    public string ContactEmail => _emailOptions.ContactEmail;

    private async Task<SmtpClient> GetSmtpClient()
    {
        var client = new SmtpClient();
        // await client.ConnectAsync(_emailOptions.Server, _emailOptions.Port, _emailOptions.UseSsl);
        await client.ConnectAsync(_emailOptions.Server, _emailOptions.Port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_emailOptions.Username, _emailOptions.Password);
        return client;
    }

    public async Task<EmailMessage?> QueueTextEmailAsync(string to, string subject, string body, CancellationToken ct, Action<EmailMessage>? tagMessage = null, Guid? documentId = null)
    {
        var email = new EmailMessage
        {
            From = _emailOptions.From,
            To = to,
            Subject = subject,
            Body = body,
            Status = EmailStatus.InQueue,
            ScheduledToBeSent = DateTime.Now,
            DocumentId = documentId,
        };

        tagMessage?.Invoke(email);
        await _db.Emails.AddAsync(email, ct);
        return email;
    }

    public async Task<bool> SendTextEmailAsync(EmailMessage email, CancellationToken ct)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Témata FM TUL", email.From));
        message.Subject = email.Subject;
        var body = email.Body;

        if (_emailOptions.RedirectAllEmailsTo.IsNotNullOrEmpty())
        {
            message.To.Add(new MailboxAddress("Me", _emailOptions.RedirectAllEmailsTo));
            body = $"Message was originally sent to {email.To}\n\n{email.Body}";
        }
        else
        {
            message.To.Add(new MailboxAddress(email.To, email.To));
        }

        if (email.DocumentId is not null)
        {
            var doc = await _db.Documents
               .Query()
               .FirstOrDefaultAsync(email.DocumentId.Value, ct);

            if (doc is null)
            {
                _logger.LogWarning("Document with id {Id} not found", email.DocumentId);
            }
            else
            {
                var attachment = new MimePart(doc.ContentType)
                {
                    Content = new MimeContent(new MemoryStream(doc.DocumentContent.Content)),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = doc.Name,
                };
                
                message.Body = new Multipart("mixed")
                {
                    attachment,
                    new TextPart("plain")
                    {
                        Text = body,
                    },
                };
            }
        }
        else
        {
            message.Body = new TextPart("plain")
            {
                Text = body,
            };
        }

        using var client = await GetSmtpClient();
        try
        {
            await client.SendAsync(message, ct);
            email.Status = EmailStatus.Sent;
            email.LastAttempt = DateTime.Now;
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send email to {To}", email.To);
            email.AttemptCount++;
            if (email.AttemptCount >= _emailOptions.MaxAttempts)
            {
                email.Status = EmailStatus.Failed;
            }
            else
            {
                email.ScheduledToBeSent = DateTime.Now.Add(TimeSpan.FromMinutes(15));
                email.LastAttempt = DateTime.Now;
                _logger.LogInformation("Rescheduling email to {To} for {Time}", email.To, email.ScheduledToBeSent);
            }

            return false;
        }
    }


    private static DateTime LastLogMessage = DateTime.MinValue;

    public async Task SendQueuedEmailsAsync(CancellationToken stoppingToken)
    {
        var emails = _db.Emails
           .Where(e => e.Status == EmailStatus.InQueue && e.ScheduledToBeSent <= DateTime.Now)
           .ToList();

        if (emails.Empty())
        {
            if (DateTime.Now - LastLogMessage > TimeSpan.FromMinutes(30))
            {
                _logger.LogDebug("No emails to send");
                LastLogMessage = DateTime.Now;
            }

            return;
        }

        _logger.LogInformation("Sending {Count} emails", emails.Count);

        var successCount = 0;
        var failCount = 0;
        foreach (var email in emails)
        {
            var wasSent = await SendTextEmailAsync(email, stoppingToken);
            if (wasSent)
            {
                successCount++;
            }
            else
            {
                failCount++;
            }
        }

        _logger.LogInformation("Sent {SuccessCount} emails, failed to send {FailCount}", successCount, failCount);
        await _db.SaveChangesAsync(stoppingToken);
    }

    public IQueryable<EmailMessage> Where(EmailFilter filter)
    {
        var query = _db.Emails.AsQueryable();

        query = query.WhereIf(filter.From.IsNotNullOrEmpty(), e => e.From == filter.From);
        query = query.WhereIf(filter.To.IsNotNullOrEmpty(), e => e.To == filter.To);
        query = query.WhereIf(filter.Subject.IsNotNullOrEmpty(), e => e.Subject == filter.Subject);
        query = query.WhereIf(filter.Body.IsNotNullOrEmpty(), e => e.Body.Contains(filter.Body!));
        query = query.WhereIf(filter.Status.HasValue, e => e.Status == filter.Status!.Value);
        query = query.WhereIf(filter.Module.HasValue, e => e.Module == filter.Module!.Value);

        return query;
    }
}