using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Db.Models;

namespace Unidesk.Security;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(Grants), Name = nameof(Grants), GenerateAggregation = true, GenerateMap = true)]
public enum Grants
{
    [AttributeInfo("4BFFEF59-A0F2-428D-921A-A4E55CEF7CA0", nameof(User_SuperAdmin), "Super Admin")]
    User_SuperAdmin = 1,

    [AttributeInfo("6D38D901-B11E-47F3-BC7E-B6D0F57D776D", nameof(User_Admin), "Admin")]
    User_Admin = 2,

    [AttributeInfo("908F82E0-F5B2-41AC-9C62-60D25B49C99B", nameof(User_Teacher), "Teacher")]
    User_Teacher = 3,

    [AttributeInfo("2870ECA9-EE10-4406-A3A0-AD23F8A03185", nameof(User_Student), "Student")]
    User_Student = 4,

    [AttributeInfo("07E6E5B4-8E31-411A-9ED9-26EC462984CC", nameof(User_Guest), "Guest")]
    User_Guest = 5,

    [AttributeInfo("10018290-58EF-4BC9-B5B8-3D93DCB07805", nameof(Action_Merge_Keywords), "Merge Keywords")]
    Action_Merge_Keywords = 6,

    [AttributeInfo("2E4C247E-1F1D-4B3B-8960-222894F65C9D", nameof(Action_Import_From_Stag), "Import From Stag")]
    Action_Import_From_Stag = 7,

    [AttributeInfo("4C7B8395-9EE2-4E96-9C95-6120FFCB0092", nameof(Entity_Thesis_Edit), "Edit Thesis")]
    Entity_Thesis_Edit = 8,

    [AttributeInfo("9950097C-8FC5-4414-9B99-8F26A6C4F29F", nameof(Entity_Team_Edit), "Edit Team")]
    Entity_Team_Edit = 9,

    [AttributeInfo("5472C129-8FDA-49CB-81B6-1C68243640DD", nameof(Validation_Ignore_Warnings), "Ignore Warnings")]
    Validation_Ignore_Warnings = 10,

    [AttributeInfo("93D3E148-F14E-478B-9AE6-A2139532DFE3", nameof(Action_ThesisEvaluation_Manage), "Manage Thesis Evaluation")]
    Action_ThesisEvaluation_Manage = 11,

    [AttributeInfo("FE04208C-F591-41BC-BC07-1DD161CC0754", nameof(Action_ManageRolesAndGrants), "Manage Roles And Grants")]
    Action_ManageRolesAndGrants = 12,
    
    [AttributeInfo("98449DF2-4DF6-4B38-A751-A08DB3BB8300", nameof(Action_Create_Team), "Create Team")]
    Action_Create_Team = 13,
    
    [AttributeInfo("52DD62D9-AA55-4E25-AD31-0CA8ED0E60DC", nameof(Internship_View), "Create Thesis")]
    Internship_View = 14,

    [AttributeInfo("C3896CB6-EE0E-4AA9-AE58-3237A9B1FB3B", nameof(Internship_Manage), "Manage Internship")]
    Internship_Manage = 15,
    
    [AttributeInfo("12B4EFCC-D49D-41B5-A611-79F827D2BC0E", nameof(Action_Block_User), "Block User")]
    Action_Block_User = 16,
    
    [AttributeInfo("AB9E609C-995E-4347-866F-7B9491E37680", nameof(Action_Unblock_User), "Unblock User")]
    Action_Unblock_User = 17,
    
    [AttributeInfo("9C6DCCE2-9754-4915-A111-C14F891592A7", nameof(Action_Import_From_Stag), "Email View")]
    Email_View = 18,
    
    [AttributeInfo("64CBBAC6-0BF7-4F47-B6CD-D87AF06BA77E", nameof(Action_Create_User), "Create User")]
    Action_Create_User = 19,
    
    [AttributeInfo("B65F4933-75A4-400F-8A36-C1920FA81176", nameof(Manage_Faculties), "Manage Faculties")]
    Manage_Faculties = 20,
    
    [AttributeInfo("8140E778-C514-4194-9126-53E6D6C6DB32", nameof(Manage_Departments), "Manage Departments")]
    Manage_Departments = 21,
    
    [AttributeInfo("B02EC44D-6C39-4B40-B3B5-720BD6E08D12", nameof(Manage_SchoolYears), "Manage SchoolYears")]
    Manage_SchoolYears = 22,
    
    [AttributeInfo("179B8B51-8563-4053-A494-7449033E5501", nameof(Manage_ThesisOutcomes), "Manage ThesisOutcomes")]
    Manage_ThesisOutcomes = 23,
    
    [AttributeInfo("6B3CFB26-910D-4FF7-844F-054180FC7187", nameof(Manage_ThesisTypes), "Manage ThesisTypes")]
    Manage_ThesisTypes = 24,
    
    [AttributeInfo("A006BB72-E47C-4785-8B7E-B29C8A40367E", nameof(Manage_StudyProgrammes), "Manage StudyProgrammes")]
    Manage_StudyProgrammes = 25,
    
    [AttributeInfo("C6BCF738-53BE-4CC7-B213-BE9AA3DCB22A", nameof(Manage_UserRoles), "Manage UserRoles")]
    Manage_UserRoles = 26,
    
}