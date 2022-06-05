using Microsoft.AspNetCore.Mvc;

namespace Unidesk.Controllers;

[ApiController]
[Route("[controller]")]
public class HelloWorldController : ControllerBase
{
    [HttpGet]
    [Route("api/helloworld")]
    public string HelloWorld()
    {
        return "Hello World!";
    }
}