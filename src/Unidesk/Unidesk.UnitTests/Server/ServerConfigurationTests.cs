using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Unidesk.Db.Models;
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

        var endpoints = (app as IEndpointRouteBuilder).DataSources.FirstOrDefault()?.Endpoints!;
        endpoints.Count(i => i.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods.Contains("GET") ?? false).Should().BeGreaterThan(3);
        endpoints.Count(i => i.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods.Contains("POST") ?? false).Should().BeGreaterThan(3);
        endpoints.Count(i => i.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods.Contains("DELETE") ?? false).Should().BeGreaterThan(3);

        endpoints.Should().Contain(i => i.DisplayName!.Contains($"{nameof(Faculty)}{ApiConfig.GET_ALL}"));
        endpoints.Should().Contain(i => i.DisplayName!.Contains($"{nameof(Faculty)}{ApiConfig.UPSERT}"));
        endpoints.Should().Contain(i => i.DisplayName!.Contains($"{nameof(Faculty)}{ApiConfig.DELETE}"));
    }
}