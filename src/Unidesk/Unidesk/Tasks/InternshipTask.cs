using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Tasks;

public class InternshipTask : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    private readonly TimeOnly[] _timePoints =
    {
        new (07, 00),
        new (19, 00),
    };

    public InternshipTask(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;
            var nowTimeOnly = TimeOnly.FromDateTime(now);

            var futureTimePoints = _timePoints
               .Where(i => i > nowTimeOnly)
               .OrderBy(i => i)
               .ToArray();


            var closestTimePoint = futureTimePoints.Empty()
                ? _timePoints.MinBy(i => i)
                : _timePoints
                   .Where(i => i > nowTimeOnly)
                   .MinBy(i => nowTimeOnly - i);

            var timeToWait = closestTimePoint - nowTimeOnly;
            await Task.Delay(timeToWait, stoppingToken);
            
            if (stoppingToken.IsCancellationRequested)
            {
                return;
            }

            using var scope = _serviceProvider.CreateScope();
            var internshipService = scope.ServiceProvider.GetRequiredService<InternshipService>();
            
            await internshipService.NotifyManagerAboutSubmittedInternshipAsync(stoppingToken);
            await internshipService.NotifyStudentsContactPersonMissingAsync(stoppingToken);
        }
    }
}