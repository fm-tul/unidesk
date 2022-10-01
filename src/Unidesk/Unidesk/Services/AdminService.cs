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

    public AdminService(UnideskDbContext db)
    {
        _db = db;
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
}

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "AdminActions", ForType = typeof(AdminActions), GenerateAggreation = true)]
public enum AdminActions
{
    Update_User_Functions,
}