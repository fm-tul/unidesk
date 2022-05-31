using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

public class ThesisReport : IdEntity
{
    public Guid ThesisId { get; set; }
    public Thesis Thesis { get; set; }

    public string AccessToken { get; set; }

    public ThesisReportRelation Relation { get; set; }

    public ReportUser ReportUser { get; set; }

    // public ??? Evaluation { get; set; }

    // public string Report { get; set; }
}