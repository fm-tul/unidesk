using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Unidesk.Server;
using Xunit;

namespace Unidesk.UnitTests.Server;

public class ServerConfigurationTests
{
    [Fact]
    public async Task Server_Configuration_Is_Valid()
    {
        var webApplication = WebApplication.Create();
        var app = webApplication
            .AddMinimalApiGetters()
            .AddMinimalApiSetters()
            .AddMinimalApiDeleters();

        app.StartAsync().Wait(TimeSpan.FromSeconds(1));
    }
}