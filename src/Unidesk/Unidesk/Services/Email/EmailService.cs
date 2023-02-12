using MailKit.Net.Smtp;
using MimeKit;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services.Email;

public class EmailService
{
    private readonly EmailOptions _emailOptions;

    public EmailService(EmailOptions emailOptions)
    {
        _emailOptions = emailOptions;
    }

    private async Task<SmtpClient> GetSmtpClient()
    {
        var client = new SmtpClient();
        await client.ConnectAsync(_emailOptions.Server, _emailOptions.Port, _emailOptions.UseSsl);
        await client.AuthenticateAsync(_emailOptions.Username, _emailOptions.Password);
        return client;
    }

    public async Task SendTextEmailAsync(string to, string subject, string body)
    {
        using var client = await GetSmtpClient();
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Unidesk", _emailOptions.Username));

        if (_emailOptions.RedirectAllEmailsTo.IsNotNullOrEmpty())
        {
            message.To.Add(new MailboxAddress("Me", _emailOptions.RedirectAllEmailsTo));
            body = $"Message was originally sent to {to}\n\n{body}";
        }
        else
        {
            message.To.Add(new MailboxAddress(to, to));
        }

        message.Subject = subject;
        message.Body = new TextPart("plain")
        {
            Text = body,
        };
        
        await client.SendAsync(message);
    }
}