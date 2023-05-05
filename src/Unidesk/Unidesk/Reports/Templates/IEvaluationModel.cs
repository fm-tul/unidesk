using Unidesk.Reports.Elements;

namespace Unidesk.Reports.Templates;

public interface IEvaluationModel
{
    public List<ReportAnswer> Answers { get; set; }
}