using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Unidesk.Db.Models;

namespace Unidesk.Services;

public interface IUserProvider
{
    public User? CurrentUser { get; set; }
}