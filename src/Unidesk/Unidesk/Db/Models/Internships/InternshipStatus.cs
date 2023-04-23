using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models.Internships;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "InternshipStatus", ForType = typeof(InternshipStatus), GenerateAggregation = true)]
public enum InternshipStatus
{
    [MultiLang("Draft", "Návrh")]
    Draft = 0,

    [MultiLang("Submitted for approval", "Odesláno ke schválení")]
    Submitted = 1,

    [MultiLang("Approved", "Schváleno")]
    Approved = 2,

    [MultiLang("Rejected", "Zamítnuto")]
    Rejected = 3,
    
    [MultiLang("Reopened", "Znovu otevřeno")]
    Reopened = 4,

    [MultiLang("Cancelled", "Zrušeno")]
    Cancelled = 5,

    [MultiLang("Finished", "Dokončeno")]
    Finished = 6,

    [MultiLang("Defended", "Obhájeno")]
    Defended = 7,
}