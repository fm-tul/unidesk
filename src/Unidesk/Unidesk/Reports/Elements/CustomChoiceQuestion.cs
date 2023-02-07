namespace Unidesk.Reports.Elements;

public class CustomChoiceQuestion<T> : ReportQuestion where T : Enum
{
    
    public List<string> Choices => Enum.GetNames(typeof(T)).ToList();
}