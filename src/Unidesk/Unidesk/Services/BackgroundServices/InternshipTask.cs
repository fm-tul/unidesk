using Unidesk.Utils.Extensions;

namespace Unidesk.Services.BackgroundServices;

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

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            // {
            //     using var scope = _serviceProvider.CreateScope();
            //     var internshipService = scope.ServiceProvider.GetRequiredService<InternshipService>();
            //     await internshipService.NotifyStudentInternshipStillDraft(ct);
            // }
            
            var now = DateTime.UtcNow;
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
            await Task.Delay(timeToWait, ct);
            
            if (ct.IsCancellationRequested)
            {
                return;
            }

            using var scope = _serviceProvider.CreateScope();
            var internshipService = scope.ServiceProvider.GetRequiredService<InternshipService>();
            
            await internshipService.NotifyManagerAboutSubmittedInternshipAsync(ct);
            await internshipService.NotifyStudentsContactPersonMissingAsync(ct);
            await internshipService.NotifyStudentInternshipStillDraft(ct);
        }
    }
}