using Unidesk.Utils;

namespace Unidesk.Services.Reports;

public enum LangType
{
    EN,
    CZ
}

public class ReportService
{
    private readonly ILogger<ReportService> _logger;
    private const string WorkingDirectory = "c:\\projects\\tul\\unidesk\\templates\\";
    private const string TemplateName = "template.tex";

    public ReportService(ILogger<ReportService> logger)
    {
        _logger = logger;
    }

    public string LoadTemplate()
    {
        _logger.LogInformation("Loading template {TemplateName}", TemplateName);
        var template = File.ReadAllText(Path.Combine(WorkingDirectory, TemplateName));
        return template;
    }

    public string ConfigureTemplate(string template, ReportModel model)
    {
        var templateEngine = new TemplateEngine();
        templateEngine.Use("TULthesisType", model.Type);
        templateEngine.Use("TULtitle", model.Name);
        templateEngine.Use("Lang", LangType.CZ);
        templateEngine.Use("TULconsultant", new List<string>
        {
            "doc. Ing. Petr Novák, Ph.D.", 
            "doc. Ing. Jan Novák, Ph.D.",
        });

        return templateEngine.Render(template);
    }
    
    public async Task<byte[]?> GenerateReportAsync(ReportModel model)
    {
        var template = LoadTemplate();
        var configuredTemplate = ConfigureTemplate(template, model);
        var texFile = Path.Combine(WorkingDirectory, "main.tex");
        await File.WriteAllTextAsync(texFile, configuredTemplate);

        _logger.LogInformation("Generating report");
        var freeze = DirectoryUtils.Freeze(WorkingDirectory);
        using (freeze)
        {
            ProcessUtils.RunProcess(
                "wsl",
                "bash make-pdf.sh",
                workingDirectory: WorkingDirectory
            );
        }

        var pdf = freeze.NewFiles.FirstOrDefault(f => f.Name == "main.pdf");
        if (pdf == null)
        {
            _logger.LogError("Report generation failed");
            return null;
        }

        _logger.LogInformation("Report generated");
        var bytes = await File.ReadAllBytesAsync(pdf.FullName);
        if (freeze.NewFiles.Count < 10)
        {
            _logger.LogInformation("Deleting {Count} files", freeze.NewFiles.Count);
            // Delete the files
            foreach (var file in freeze.NewFiles)
            {
                File.Delete(file.FullName);
            }
        }

        return bytes;
    }
}