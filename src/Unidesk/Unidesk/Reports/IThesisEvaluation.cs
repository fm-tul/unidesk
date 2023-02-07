using Unidesk.Reports.Elements;

namespace Unidesk.Reports;

public interface IThesisEvaluation
{
    bool CanProcess(ThesisEvaluationContext context);
    string TemplateName { get; }
    
    object GetModel(ThesisEvaluationContext context);
    
    List<ReportQuestion> GetQuestions(ThesisEvaluationContext context);
    Task ValidateAndThrowAsync(ThesisEvaluationContext context);
}