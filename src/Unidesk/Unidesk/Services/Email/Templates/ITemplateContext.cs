namespace Unidesk.Services.Email.Templates;

public interface ITemplateContext
{
    public static abstract string TemplateBody { get; }
    public static abstract string Subject { get; }
}