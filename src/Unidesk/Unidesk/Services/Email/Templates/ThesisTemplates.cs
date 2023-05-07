namespace Unidesk.Services.Email.Templates;

public static class ThesisTemplates
{
    public class EvaluationInviteML: ITemplateContext
    {
        public static string Subject => "Thesis Evaluation Request";
        public static string TemplateBody => """
        Dear {{ SupervisorName }},

        You have been invited to evaluate the thesis of {{ StudentName }}. The thesis is titled "{{ ThesisTitle }}". You can evaluate the thesis by visiting the following URL:

        {{ ThesisEvaluationUrl }}

        The deadline for the evaluation is {{ ThesisEvaluationDeadline }}. You will need to enter the following passphrase to evaluate the thesis:

        {{ ThesisEvaluationPassword }}

        If you have any questions, please contact us at {{ ContactEmail }}.

        Sincerely,
        Temata FM
        Technical University of Liberec
        """;

        public required string SupervisorName { get; set; }
        public required string StudentName { get; set; }
        public required string ThesisTitle { get; set; }
        public required string ThesisEvaluationUrl { get; set; }
        public required string ThesisEvaluationDeadline { get; set; }
        public required string ThesisEvaluationPassword { get; set; }
        public required string ContactEmail { get; set; }
    }
}