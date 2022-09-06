using System.Text.Json.Serialization;

namespace Unidesk.Db.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ThesisStatus
{
    Draft = 0,
    New = 1,
    Reserved = 2,
    Assigned = 3,
    Submitted = 4,
    Finished_Susccessfully = 5,
    Finished_Unsuccessfully = 6,
    Finished = 7,
    Abandoned = 8,
    Unknown = 666
}