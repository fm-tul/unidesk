using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace Unidesk.Services;

public class ServerService
{
    private readonly IServer _server;

    public ServerService(IServer server)
    {
        _server = server;
    }

    public string UrlBase => _server.Features
                                .Get<IServerAddressesFeature>()
                               ?.Addresses
                                .MaxBy(i => i.StartsWith("https"))
                          ?? "https://localhost:3000";
}