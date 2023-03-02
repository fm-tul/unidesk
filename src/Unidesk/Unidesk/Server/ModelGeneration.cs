using System.Diagnostics;

namespace Unidesk.Server;

public class ModelGeneration
{
    private readonly HttpClient _httpClient = new();
    private readonly Thread _thread;
    private bool _shouldStop { get; set; } = false;
    private const string SwaggerUrl = "http://localhost:5222/swagger/v1/swagger.json";
    private readonly string NpmCommand = "/C npm run generate-api";
    private static WebApplication _app;

    public static void ShutDownAfterModelGenerated(WebApplication app)
    {
        _app = app;
    }
    
    public ModelGeneration()
    {
        _thread = new Thread(async () =>
        {
            while (!_shouldStop)
            {
                try
                {
                    await GetModel();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        });

        _thread.Start();
    }

    public async Task GetModel()
    {
        var response = await _httpClient.GetAsync(SwaggerUrl);
        if (response.IsSuccessStatusCode)
        {
            _shouldStop = true;
            var clientDir = Path.Join(Directory.GetCurrentDirectory(), "..", "Unidesk.Client");
            var process = Process.Start(new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = NpmCommand,
                WorkingDirectory = clientDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            }) ?? throw new Exception("Failed to start npm");
            
           await process.WaitForExitAsync();
           Console.WriteLine($"Exit code: {process.ExitCode}");
           
           if (process.ExitCode == 0 && _app != null)
           {
               Console.WriteLine("Shutting down...");
               await _app.StopAsync();
               Console.WriteLine("Shutdown complete");
           }
           
        }
    }
}