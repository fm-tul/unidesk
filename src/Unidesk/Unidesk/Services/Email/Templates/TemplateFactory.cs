using Scriban;

namespace Unidesk.Services.Email.Templates;

public class TemplateFactory
{
    public Template LoadTemplate(string templateBody)
    {
        return Template.Parse(templateBody.Trim());
    }
    
    public TemplateInstance<T> LoadTemplate<T>() where T: ITemplateContext
    {
        return new TemplateInstance<T>(Template.Parse(T.TemplateBody.Trim()));
    }
}

public class TemplateInstance<T> where T : ITemplateContext
{
    public TemplateInstance(Template template)
    {
        Template = template;
    }
    
    public Template Template { get; }
    
    public string Render(T context)
    {
        return Template.RenderTemplate(context);
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
