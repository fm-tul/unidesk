using Scriban;

namespace Unidesk.Services.Email.Templates;

public class TemplateService
{
    private Template Template { get; set; }
    
    
    public void LoadTemplate(string templateBody)
    {
        Template = Template.Parse(templateBody.Trim());
    }
    
    public string Render<T>(T context) where T : ITemplateContext
    {
        return Template.Render(
            context,
            member => member.Name
        );
    }
}

