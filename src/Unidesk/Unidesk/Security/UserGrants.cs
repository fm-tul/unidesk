using System.Reflection;
using Unidesk.Client;
using Unidesk.Db.Models;
using Unidesk.ServiceFilters;

namespace Unidesk.Security;

[GenerateModel(Name = nameof(UserGrants), ForType = typeof(Grant), GenerateAggreation = true)]
public static class UserGrants
{
    public static readonly Grant User_SuperAdmin = new Grant { Name = User_SuperAdmin_Id, Description = "Super Admin", Id =  new Guid("4BFFEF59-A0F2-428D-921A-A4E55CEF7CA0")};
    public const string User_SuperAdmin_Id = "User_SuperAdmin";

    public static readonly Grant User_Admin = new Grant { Name = User_Admin_Id, Description = "Admin", Id = new Guid("6D38D901-B11E-47F3-BC7E-B6D0F57D776D")};
    public const string User_Admin_Id = "User_Admin";

    public static readonly Grant User_Teacher = new Grant { Name = User_Teacher_Id, Description = "Teacher", Id = new Guid("908F82E0-F5B2-41AC-9C62-60D25B49C99B")};
    public const string User_Teacher_Id = "User_Teacher";

    public static readonly Grant User_Student = new Grant { Name = User_Student_Id, Description = "Student", Id = new Guid("2870ECA9-EE10-4406-A3A0-AD23F8A03185")};
    public const string User_Student_Id = "User_Student";

    public static readonly Grant User_Guest = new Grant { Name = User_Guest_Id, Description = "Guest", Id = new Guid("07E6E5B4-8E31-411A-9ED9-26EC462984CC")};
    public const string User_Guest_Id = "User_Guest";

    // get all grants via reflection
    public static IEnumerable<Grant> All =>
        typeof(UserGrants).GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(i => i.FieldType == typeof(Grant))
            .Select(i => i.GetValue(null))
            .Cast<Grant>()
            .ToList();

    public static Grant GetGrant(string id) => All.First(i => i.Name == id);
}
