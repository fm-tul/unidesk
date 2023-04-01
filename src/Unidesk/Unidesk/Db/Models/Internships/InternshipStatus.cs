using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models.Internships;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "InternshipStatus", ForType = typeof(InternshipStatus), GenerateAggregation = true)]
public enum InternshipStatus
{
    [MultiLang("Návrh", "Draft")]
    Draft = 0,

    [MultiLang("Odesláno", "Submitted")]
    Submitted = 1,

    [MultiLang("Schváleno", "Approved")]
    Approved = 2,

    [MultiLang("Zamítnuto", "Rejected")]
    Rejected = 3,
    
    [MultiLang("Znovu otevřeno", "Reopened")]
    Reopened = 4,

    [MultiLang("Zrušeno", "Cancelled")]
    Cancelled = 5,

    [MultiLang("Dokončeno", "Finished")]
    Finished = 6,

    [MultiLang("Obhájeno", "Defended")]
    Defended = 7,
}