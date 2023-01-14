using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models.Reports;

[Newtonsoft.Json.JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(ThesisReportStatus), GenerateAggregation = true, Name = nameof(ThesisReportStatus))]
public enum ThesisReportStatus
{
    Unknown = 0,
    Invited = 1,
    Accepted = 2,
    Rejected = 3,
    Draft = 4,
    Submitted = 5,
    Approved = 6,
}