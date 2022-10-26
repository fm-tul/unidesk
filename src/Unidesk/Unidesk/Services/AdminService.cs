using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Unidesk.Client;
using Unidesk.Db;
using Unidesk.Db.Models;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services;

public class AdminService
{
    private readonly UnideskDbContext _db;
    private readonly UserService _userService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AdminService(UnideskDbContext db, UserService userService, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _userService = userService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<object> RunActionAsync(AdminActions action, HttpRequest request, HttpResponse response, CancellationToken ct)
    {
        var saveChanges = request.Query.ContainsKey("saveChanges");
        var result = await RunActionImplAsync(action, request, response, ct);
        var rows = -1;
        if (saveChanges)
        {
            rows = await _db.SaveChangesAsync(ct);
        }

        return new { Result = result, Rows = rows };
    }

    private async Task<object> RunActionImplAsync(AdminActions action, HttpRequest request, HttpResponse response, CancellationToken ct)
    {
        switch (action)
        {
            case AdminActions.Update_User_Functions:
                var thesisUsers = await _db.ThesisUsers
                   .Select(i => new { i.UserId, i.Function })
                   .ToListAsync(ct);

                var byUser = thesisUsers
                   .GroupBy(g => g.UserId)
                   .ToDictionary(k => k.Key, v => v.Select(i => i.Function).Combine());

                var userIds = byUser.Keys.ToArray();

                var users = await _db.Users
                   .Where(i => userIds.Contains(i.Id))
                   .ToListAsync(ct);

                foreach (var user in users)
                {
                    user.UserFunction |= byUser[user.Id];
                }

                return new { Status = "Ok" };
        }

        throw new NotSupportedException($"Action {action} is not supported");
    }

    public async Task<User> SwitchUserAsync(string value, CancellationToken ct)
    {
        var httpContext = _httpContextAccessor.HttpContext
                       ?? throw new ArgumentNullException(nameof(_httpContextAccessor));

        var user = await ResolveUserAsync(value, ct);
        await _userService.SignInAsync(httpContext, user);
        return user;
    }

    private async Task<User> ResolveUserAsync(string value, CancellationToken ct)
    {
        var isGuid = Guid.TryParse(value, out var userId);
        var isNumber = int.TryParse(value, out var number);
        if (isGuid)
        {
            return await _db.Users
                      .FirstOrDefaultAsync(i => i.Id == userId, ct)
                ?? throw new Exception($"User with id {userId} not found");
        }

        if (isNumber)
        {
            return await _db.Users
                      .FirstOrDefaultAsync(i => i.StagId == number.ToString(), ct)
                ?? throw new Exception($"User with number {number} not found");
        }

        return await _db.Users
                  .FirstOrDefaultAsync(i => i.Username == value, ct)
            ?? throw new Exception($"User with name {value} not found");
    }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "AdminActions", ForType = typeof(AdminActions), GenerateAggreation = true)]
public enum AdminActions
{
    Update_User_Functions,
}