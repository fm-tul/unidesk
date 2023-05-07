using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Unidesk.Configurations;

namespace Unidesk.Services;

public class ServerService
{
    private readonly IServer _server;
    private readonly AppOptions _options;

    public ServerService(IServer server, AppOptions options)
    {
        _server = server;
        _options = options;
    }

    public string UrlBase => _options.ServerUrl;
    // "https://temata.fm.tul.cz";
    //   _server.Features
    //       .Get<IServerAddressesFeature>()
    //      ?.Addresses
    //       .MaxBy(i => i.StartsWith("https"))
    // ?? "https://localhost:3000";
}