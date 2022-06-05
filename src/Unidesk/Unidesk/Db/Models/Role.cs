using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class UserRole : TrackedEntity
{
    public string Name { get; set; }

    public string? Description { get; set; }
    
    [Column("Grants")]
    internal string _grants { get; set; } = "";

    [NotMapped]
    public List<Grant> Grants
    {
        get => _grants
                .Split(',')
                .Select(Guid.Parse)
                .Select(i => UserGrants.All.FirstOrDefault(j => i == j.Id))
                .Where(i => i != null)
                .Cast<Grant>()
                .ToList();
        
        set => _grants = string.Join(",", value.Select(i => i.Id));
    }
}

// Not in DB
public class Grant: IdEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public static class UserGrants
{
    public static readonly Grant User_SuperAdmin = new Grant { Name = "User_SuperAdmin", Description = "Super Admin" };
    public const string User_SuperAdmin_Id = "User_SuperAdmin";
    
    public static readonly Grant User_Admin = new Grant { Name = "User_Admin", Description = "Admin" };
    public const string User_Admin_Id = "User_Admin";
    
    public static readonly Grant User_Teacher = new Grant { Name = "User_Teacher", Description = "Teacher" };
    public const string User_Teacher_Id = "User_Teacher";
    
    public static readonly Grant User_Student = new Grant { Name = "User_Student", Description = "Student" };
    public const string User_Student_Id = "User_Student";
    
    public static readonly Grant User_Guest = new Grant { Name = "User_Guest", Description = "Guest" };
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