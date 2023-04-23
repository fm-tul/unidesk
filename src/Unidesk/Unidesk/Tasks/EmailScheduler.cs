using Unidesk.Services.Email;

namespace Unidesk.Tasks;

public class EmailScheduler: BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    public EmailScheduler(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _periodicTimer = new PeriodicTimer(TimeSpan.FromSeconds(15));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while(await _periodicTimer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();
            await emailService.SendQueuedEmailsAsync(stoppingToken);
        }
    }
}