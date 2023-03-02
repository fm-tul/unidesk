using System.Diagnostics;

namespace Unidesk.Utils;

public static class ProcessUtils
{
    public record ProcessResult(int ExitCode, List<string> Output, List<string> Error);

    public static ProcessResult RunProcess(string fileName, string arguments, string? workingDirectory = null, bool redirectStandardOutput = true,
        bool redirectStandardError = true,
        bool useShellExecute = false, bool createNoWindow = true)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                WorkingDirectory = workingDirectory,
                RedirectStandardOutput = redirectStandardOutput,
                RedirectStandardError = redirectStandardError,
                UseShellExecute = useShellExecute,
                CreateNoWindow = createNoWindow,
            },
        };

        var output = new List<string>();
        var error = new List<string>();

        process.OutputDataReceived += (_, args) =>
        {
            if (args.Data != null)
            {
                output.Add(args.Data);
            }
        };

        process.ErrorDataReceived += (_, args) =>
        {
            if (args.Data != null)
            {
                error.Add(args.Data);
            }
        };

        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        process.WaitForExit();

        return new ProcessResult(process.ExitCode, output, error);
    }
}