using Scriban;

namespace Unidesk.Services.Email.Templates;

public class TemplateFactory
{
    public Template LoadTemplate(string templateBody)
    {
        return Template.Parse(templateBody.Trim());
    }
}

public static class TemplateExtensions
{
    public static string RenderTemplate<T>(this Template template, T context) where T : ITemplateContext
    {
        return template.Render(
            context,
            member => member.Name
        );
    }
}
