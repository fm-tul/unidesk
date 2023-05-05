namespace Unidesk.Services.Email.Templates;

/*
ThesisEvaluationInvite template (liquid):
- This template is used to send an email to a thesis supervisor to invite them to evaluate a thesis.

Context:
    SupervisorName: The name of the thesis supervisor.
    StudentName: The name of the student whose thesis is being evaluated.
    ThesisTitle: The title of the thesis.
    
    ThesisEvaluationUrl: The URL of the thesis evaluation page.
    ThesisEvaluationDeadline: The deadline for the thesis evaluation.
    ThesisEvaluationPassword: The password which the supervisor will need to enter to evaluate the thesis.
    
    ContactEmail: The contact email address of the thesis evaluation system.
 */

public class ThesisEvaluationInviteTemplate: ITemplateContext
{
    public const string TemplateBody = """
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


public class InternshipEvaluationInviteTemplate : ITemplateContext
{
    public const string TemplateBody = """
        Dear {{ SupervisorName }},

        You have been invited to evaluate the internship of {{ StudentName }}. The internship is titled "{{ InternshipTitle }}". You can evaluate the internship by visiting the following URL:

        {{ InternshipEvaluationUrl }}

        The deadline for the evaluation is {{ InternshipEvaluationDeadline }}. You will need to enter the following passphrase to evaluate the internship:

        {{ InternshipEvaluationPassword }}

        If you have any questions, please contact us at {{ ContactEmail }}.

        Sincerely,
        Temata FM
        Technical University of Liberec
        """;
    public required string SupervisorName { get; set; }
    public required string StudentName { get; set; }
    public required string InternshipTitle { get; set; }
    public required string InternshipEvaluationUrl { get; set; }
    public required string InternshipEvaluationDeadline { get; set; }
    public required string InternshipEvaluationPassword { get; set; }
    public required string ContactEmail { get; set; }
}