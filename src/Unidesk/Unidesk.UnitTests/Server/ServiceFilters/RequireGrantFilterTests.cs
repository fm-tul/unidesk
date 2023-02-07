using System.Collections.Generic;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Unidesk.Db.Models;
using Unidesk.Security;
using Unidesk.Server.ServiceFilters;
using Unidesk.ServiceFilters;
using Xunit;

namespace Unidesk.UnitTests.Server.ServiceFilters;

public class RequireGrantFilterTests
{
    [Fact]
    public void Test_Should_Fail_If_Grant_Requirements_Are_Not_Met()
    {
        var requiredGrants = new List<Grant> { Grants.User_SuperAdmin.AsGrant() };
        var userGrants = new List<Grant> { Grants.User_SuperAdmin.AsGrant() };
        var (granted, error, status) = GrantCheck.HasAccess(requiredGrants, userGrants);

        granted.Should().BeTrue();
        error.Should().BeNullOrEmpty();
        status.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public void Test_Should_Fail_If_GrantAttributes_Requirements_Are_Not_Met()
    {
        var requiredAttributes = new List<RequireGrantAttribute>
        {
            new(Grants.User_SuperAdmin)
        };

        var userGrants = new List<Grant> { Grants.User_SuperAdmin.AsGrant() };
        var (granted, error, status) = GrantCheck.HasAccess(requiredAttributes, userGrants);

        granted.Should().BeTrue();
        error.Should().BeNullOrEmpty();
        status.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public void Test_Shoudl_Fail_If_Grant_Is_Missing()
    {
        var requiredGrants = new List<Grant> { Grants.User_SuperAdmin.AsGrant() };
        var userGrants = new List<Grant> { Grants.User_Admin.AsGrant(), Grants.User_Teacher.AsGrant() };
        
        var (granted, error, status) = GrantCheck.HasAccess(requiredGrants, userGrants);
        granted.Should().BeFalse();
        error.Should().Contain("You don't have permission to access this resource, required grants:");
        status.Should().Be(StatusCodes.Status403Forbidden);
    }
}