using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Db.Models;

namespace Unidesk.Security;

public static class UserGrants
{
    public static readonly List<Grant> All = Enum.GetValues<Grants>()
       .Select(i => new Grant
        {
            Name = i.GrantName(),
            Description = i.GrantDescription(),
            Id = i.GrantId(),
        })
       .ToList();

    public static Grant GetGrant(Guid id) => All.First(i => i.Id == id);
}

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(Grants), Name = nameof(Grants), GenerateAggregation = true, GenerateMap = true)]
public enum Grants
{
    [GrantInfo("4BFFEF59-A0F2-428D-921A-A4E55CEF7CA0", nameof(User_SuperAdmin), "Super Admin")]
    User_SuperAdmin = 1,

    [GrantInfo("6D38D901-B11E-47F3-BC7E-B6D0F57D776D", nameof(User_Admin), "Admin")]
    User_Admin = 2,

    [GrantInfo("908F82E0-F5B2-41AC-9C62-60D25B49C99B", nameof(User_Teacher), "Teacher")]
    User_Teacher = 3,

    [GrantInfo("2870ECA9-EE10-4406-A3A0-AD23F8A03185", nameof(User_Student), "Student")]
    User_Student = 4,

    [GrantInfo("07E6E5B4-8E31-411A-9ED9-26EC462984CC", nameof(User_Guest), "Guest")]
    User_Guest = 5,

    [GrantInfo("10018290-58EF-4BC9-B5B8-3D93DCB07805", nameof(Action_Merge_Keywords), "Merge Keywords")]
    Action_Merge_Keywords = 6,

    [GrantInfo("2E4C247E-1F1D-4B3B-8960-222894F65C9D", nameof(Action_Import_From_Stag), "Import From Stag")]
    Action_Import_From_Stag = 7,

    [GrantInfo("4C7B8395-9EE2-4E96-9C95-6120FFCB0092", nameof(Entity_Thesis_Edit), "Edit Thesis")]
    Entity_Thesis_Edit = 8,

    [GrantInfo("9950097C-8FC5-4414-9B99-8F26A6C4F29F", nameof(Entity_Team_Edit), "Edit Team")]
    Entity_Team_Edit = 9,

    [GrantInfo("5472C129-8FDA-49CB-81B6-1C68243640DD", nameof(Validation_Ignore_Warnings), "Ignore Warnings")]
    Validation_Ignore_Warnings = 10,

    [GrantInfo("93D3E148-F14E-478B-9AE6-A2139532DFE3", nameof(Action_ThesisEvaluation_Manage), "Manage Thesis Evaluation")]
    Action_ThesisEvaluation_Manage = 11,

    [GrantInfo("FE04208C-F591-41BC-BC07-1DD161CC0754", nameof(Action_ManageRolesAndGrants), "Manage Roles And Grants")]
    Action_ManageRolesAndGrants = 12,
    
    [GrantInfo("98449DF2-4DF6-4B38-A751-A08DB3BB8300", nameof(Action_Create_Team), "Create Team")]
    Action_Create_Team = 13,
}