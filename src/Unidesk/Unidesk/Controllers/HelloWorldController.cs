using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Unidesk.Security;
using Unidesk.ServiceFilters;
using Unidesk.Services;

namespace Unidesk.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class HelloWorldController : ControllerBase
{

    private readonly IUserProvider _userProvider;

    public HelloWorldController(IUserProvider userProvider)
    {
        _userProvider = userProvider;
    }

    [HttpGet]
    [Route("helloworld")]
    [RequireGrant(UserGrants.User_SuperAdmin_Id)]
    public string HelloWorld()
    {
        return $"Hello {_userProvider.CurrentUser.Email}";
    }
}