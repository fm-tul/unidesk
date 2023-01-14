namespace Unidesk.Db.Models.Reports;

public class ReportData
{
    public DateTime SubmissionDate { get; set; }

    public List<ReportDataItem> Data { get; set; } = new List<ReportDataItem>();
}