using System.Reflection;
using Unidesk.Client;
using Unidesk.Db.Models;

namespace Unidesk.Security;

[GenerateModel(Name = nameof(UserGrants), ForType = typeof(Grant), GenerateAggregation = true, GenerateMap = true)]
public static class UserGrants
{
    public const string User_SuperAdmin_Id = "User_SuperAdmin";
    public static readonly Grant User_SuperAdmin = new() { Name = User_SuperAdmin_Id, Description = "Super Admin", Id =  new Guid("4BFFEF59-A0F2-428D-921A-A4E55CEF7CA0")};

    public const string User_Admin_Id = "User_Admin";
    public static readonly Grant User_Admin = new() { Name = User_Admin_Id, Description = "Admin", Id = new Guid("6D38D901-B11E-47F3-BC7E-B6D0F57D776D")};

    public const string User_Teacher_Id = "User_Teacher";
    public static readonly Grant User_Teacher = new() { Name = User_Teacher_Id, Description = "Teacher", Id = new Guid("908F82E0-F5B2-41AC-9C62-60D25B49C99B")};

    public const string User_Student_Id = "User_Student";
    public static readonly Grant User_Student = new() { Name = User_Student_Id, Description = "Student", Id = new Guid("2870ECA9-EE10-4406-A3A0-AD23F8A03185")};

    public const string User_Guest_Id = "User_Guest";
    public static readonly Grant User_Guest = new() { Name = User_Guest_Id, Description = "Guest", Id = new Guid("07E6E5B4-8E31-411A-9ED9-26EC462984CC")};
    
    public const string Action_Merge_Keywords_Id = "Action_Merge_Keywords";
    public static readonly Grant Action_Merge_Keywords = new() { Name = Action_Merge_Keywords_Id, Description = "Merge Keywords", Id = new Guid("10018290-58EF-4BC9-B5B8-3D93DCB07805")};
    
    public const string Action_Import_From_Stag_Id = "Action_Import_From_Stag";
    public static readonly Grant Action_Import_From_Stag = new() { Name = Action_Import_From_Stag_Id, Description = "Import From Stag", Id = new Guid("2E4C247E-1F1D-4B3B-8960-222894F65C9D")};
    
    
    public const string Entity_Thesis_Edit_Id = "Entity_Thesis_Edit";
    public static readonly Grant Entity_Thesis_Edit = new() { Name = Entity_Thesis_Edit_Id, Description = "Edit Thesis", Id = new Guid("4C7B8395-9EE2-4E96-9C95-6120FFCB0092")};
    
    public const string Entity_Team_Edit_Id = "Entity_Team_Edit";
    public static readonly Grant Entity_Team_Edit = new() { Name = Entity_Team_Edit_Id, Description = "Edit Team", Id = new Guid("9950097C-8FC5-4414-9B99-8F26A6C4F29F")};
    
    public const string Validation_Ignore_Warnings_Id = "Action_Ignore_Warnings";
    public static readonly Grant Validation_Ignore_Warnings = new() { Name = Validation_Ignore_Warnings_Id, Description = "Ignore Warnings", Id = new Guid("5472C129-8FDA-49CB-81B6-1C68243640DD")};

    // get all grants via reflection
    public static IEnumerable<Grant> All =>
        typeof(UserGrants).GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(i => i.FieldType == typeof(Grant))
            .Select(i => i.GetValue(null))
            .Cast<Grant>()
            .ToList();

    public static Grant GetGrant(string id) => All.First(i => i.Name == id);
}
