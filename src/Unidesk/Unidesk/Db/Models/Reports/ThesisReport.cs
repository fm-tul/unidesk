using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models.Reports;

public class ThesisReport : TrackedEntity
{
    public Guid ThesisId { get; set; }
    public Thesis Thesis { get; set; } = null!;

    public string AccessToken { get; set; }
    public ThesisReportRelation Relation { get; set; }
    public User ReportUser { get; set; } = null!;
    
    public ThesisReportStatus Status { get; set; }


    /// <summary>
    /// Report template which is used to generate the report
    /// </summary>
    public ReportTemplate ReportTemplate { get; set; } = null!;

    public Guid ReportTemplateId { get; set; }

    // we serialize the report data to json and store it in the database
    [Column("ReportData")]
    private string ReportDataJson { get; set; } = null!;

    [NotMapped]
    public ReportData ReportData
    {
        get => JsonConvert.DeserializeObject<ReportData>(ReportDataJson)!;
        set => ReportDataJson = JsonConvert.SerializeObject(value);
    }
}