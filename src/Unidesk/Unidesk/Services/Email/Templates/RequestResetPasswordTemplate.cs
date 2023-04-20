namespace Unidesk.Services.Email.Templates;

public class RequestResetPasswordTemplate: ITemplateContext
{
    public const string TemplateBody = """
        Dear {{ Email }},

        You have requested a password reset for your Unidesk account. Enter the following token into the reset password form:

        {{ Token }}

        If you did not request a password reset, please ignore this email.
        
        Sincerely,
        Temata FM
        Technical University of Liberec

    """;

    public required string Email;
    public required string Token;
}