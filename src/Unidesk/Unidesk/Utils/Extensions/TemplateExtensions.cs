using Unidesk.Reports.Elements;

namespace Unidesk.Utils.Extensions;

public static class TemplateExtensions
{
    public static object? GetAnswer(this List<ReportAnswer> answers, ReportQuestion question)
    {
        return answers.FirstOrDefault(i => i.Id == question.Id)?.Answer;
    }
    
    public static string? GetStringAnswer(this List<ReportAnswer> answers, ReportQuestion question)
    {
        return answers.FirstOrDefault(i => i.Id == question.Id)?.Answer?.ToString();
    }
    
    public static string? GetDateAnswer(this List<ReportAnswer> answers, ReportQuestion question)
    {
        var answer = answers.FirstOrDefault(i => i.Id == question.Id)?.Answer;
        if (answer == null)
        {
            return null;
        }
        
        if (answer is DateTime date)
        {
            return date.ToString("dd.MM.yyyy");
        }
        
        if (answer is DateTimeOffset dateTimeOffset)
        {
            return dateTimeOffset.ToString("dd.MM.yyyy");
        }
        var str = answer.ToString();
        if (DateTime.TryParse(str, out var result))
        {
            return result.ToString("dd.MM.yyyy");
        }

        return "";
    }
    
    public static ReportQuestion? GetQuestion(this List<ReportQuestion> questions, ReportQuestion question)
    {
        return questions.FirstOrDefault(i => i.Id == question.Id);
    }
}