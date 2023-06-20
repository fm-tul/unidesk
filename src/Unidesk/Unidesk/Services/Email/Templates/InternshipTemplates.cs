namespace Unidesk.Services.Email.Templates;

public class InternshipTemplates
{
    public class NewInternshipSubmittedMultiLangTemplate : ITemplateContext
    {
        public required int InternshipCount;
        public required string InternshipUrl;


        public static string Subject => "Nové žádosti o stáže čekají na Vaše schválení";

        public static string TemplateBody => """
        Dobrý den,

        Nové žádosti o stáže jsou nyní k dispozici pro Vaše schválení (aktuálně {{ InternshipCount }}). Pro přezkoumání a rozhodnutí klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        New internship applications are now available for your approval (currently {{ InternshipCount }}). To review and decide, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;
    }

    public class InternshipApprovedMultiLangTemplate : ITemplateContext
    {
        public required string InternshipUrl;
        public required string? Note;


        public static string Subject => "Vaše žádost o stáž byla schválena";

        public static string TemplateBody => """
        Dobrý den,

        Vaše žádost o stáž byla schválena. Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}
        {{ if Note }}

        Poznámka od schvalujícího: {{ Note }}
        {{ end }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Your internship application has been approved. To view the details, please click on the link below:

        {{ InternshipUrl }}
        {{ if Note }}

        Note from the approver: {{ Note }}
        {{ end }}

        Sincerely,
        Témata FM TUL
        """;
    }


    public class InternshipUpdatedMultiLangTemplate : ITemplateContext
    {
        public required string InternshipUrl;

        public static string Subject => "Vaše žádost o stáž byla aktualizována";

        public static string TemplateBody => """
        Dobrý den,

        Vaše žádost o stáž byla aktualizována. Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Your internship application has been updated. To view the details, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;
    }

    public class InternshipContactPersonMissingMultiLangTemplate : ITemplateContext
    {
        public required string InternshipUrl;
        public static string Subject => "Chybí kontaktní osoba pro stáž";

        public static string TemplateBody => """
        Dobrý den,

        V systému Témata FM TUL chybí kontaktní osoba pro stáž. Prosím, doplňte ji v sekci "Stáže" v administraci.
        Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,
        
        The contact person for the internship is missing in the Témata FM TUL system. Please add it in the "Internships" section in the administration.
        To view the details, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;
    }
    
    public class EvaluationInviteML : ITemplateContext
    {
        public static string Subject => "Pozvánka k hodnocení odborné praxe";
        public static string TemplateBody => """
        Dobrý den,
        
        Byli jste pozváni k hodnocení odborné praxe studenta {{ StudentName }}. Název odborné praxe je "{{ InternshipTitle }}". Hodnocení můžete provést na následující adrese:
        
        {{ InternshipEvaluationUrl }}

        Termín pro vyplnění hodnocení je {{ InternshipEvaluationDeadline }}. Pro vyplnění hodnocení budete potřebovat následující heslo:
        
        {{ InternshipEvaluationPassword }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        You have been invited to evaluate the internship of {{ StudentName }}. The title of the internship is "{{ InternshipTitle }}". You can evaluate the internship at the following address:

        {{ InternshipEvaluationUrl }}

        The deadline for completing the evaluation is {{ InternshipEvaluationDeadline }}. To complete the evaluation, you will need the following password:

        {{ InternshipEvaluationPassword }}

        Sincerely,
        Témata FM TUL
        """;
        public required string SupervisorName { get; set; }
        public required string StudentName { get; set; }
        public required string InternshipTitle { get; set; }
        public required string InternshipEvaluationUrl { get; set; }
        public required string InternshipEvaluationDeadline { get; set; }
        public required string InternshipEvaluationPassword { get; set; }
        public required string ContactEmail { get; set; }
    }
    
    
    // user probably forget to hit submit button
    public class InternshipStillInDraftStatusMultiLang: ITemplateContext
    {
        public required string InternshipUrl;
        public static string Subject => "Vaše žádost o stáž je stále v režimu návrhu";

        public static string TemplateBody => """
        Dobrý den,

        Vaše žádost o stáž je stále nebyla odeslána ke schválení. Prosím, nezapomeňte ji odeslat ke schválení. Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Your internship application is still in draft mode. Please don't forget to submit it for approval. To view the details, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;
    }
        
    
    
    // sent to manager when new evaluation is submitted
    public class NewEvaluationSubmitted : ITemplateContext
    {
        public static string Subject => "Nové hodnocení odborné praxe";
        public static string TemplateBody => """
        Dobrý den,
        
        Bylo odesláno nové hodnocení odborné praxe studenta {{ StudentName }}. Název odborné praxe je "{{ InternshipTitle }}". Hodnocení můžete zobrazit na následující adrese:
        
        {{ InternshipEvaluationUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        A new evaluation of the internship of {{ StudentName }} has been submitted. The title of the internship is "{{ InternshipTitle }}". You can view the evaluation at the following address:

        {{ InternshipEvaluationUrl }}

        Sincerely,
        Témata FM TUL
        """;
        public required string StudentName { get; set; }
        public required string InternshipTitle { get; set; }
        public required string InternshipEvaluationUrl { get; set; }
        public required string ContactEmail { get; set; }
    }
    
    // sent to supervisor when new evaluation is submitted, will contain the generated PDF.
    // We will thank the supervisor for his/her time and attache the PDF.
    public class NewEvaluationSubmittedSupervisor : ITemplateContext
    {
        public static string Subject => "Nové hodnocení odborné praxe";

        public static string TemplateBody => """
        Dobrý den,
        
        Děkujeme za vyplnění hodnocení odborné praxe studenta {{ StudentName }}. V příloze Vám zasíláme vygenerované PDF hodnocení.
        
        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Thank you for completing the evaluation of the internship of {{ StudentName }}. We are sending you the generated PDF evaluation in the attachment.

        Sincerely,
        Témata FM TUL
        """;

        public required string StudentName { get; set; }
    }
    
    // if evaluation is reopened, sent to supervisor
    public class EvaluationReopenedSupervisor : ITemplateContext
    {
        public static string Subject => "Hodnocení odborné praxe bylo znovu otevřeno";
        public static string TemplateBody => """
        Dobrý den,
        
        Vaše hodnocení odborné praxe pro studenta {{ StudentName }} bylo znovu otevřeno. Budete kontaktováni pověřenou osobou, která Vám sdělí důvod.
        K hodnocení se můžete vrátit na následující adrese:
        
        {{ InternshipEvaluationUrl }}

        Bylo vygenerováno nové heslo pro přístup k hodnocení. Nové heslo je:
        
        {{ InternshipEvaluationPassword }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Your evaluation of the internship of {{ StudentName }} has been reopened. You will be contacted by the person in charge who will tell you the reason.
        You can return to the evaluation at the following address:

        {{ InternshipEvaluationUrl }}

        A new password has been generated to access the evaluation. The new password is:

        {{ InternshipEvaluationPassword }}

        Sincerely,
        Témata FM TUL
        """;
        
        public required string InternshipEvaluationUrl { get; set; }
        public required string InternshipEvaluationPassword { get; set; }
        public required string StudentName { get; set; }
    }

    // sent to student
    public class EvaluationApproved : ITemplateContext
    {
        public static string Subject => "Hodnocení odborné praxe bylo schváleno";
        public static string TemplateBody => """
        Dobrý den,
        
        Vaše hodnocení odborné praxe bylo schváleno. Hodnocení můžete zobrazit na následující adrese:
        
        {{ InternshipEvaluationUrl }}

        S pozdravem,
        Témata FM TUL

        ---------------------------------------------

        Greetings,

        Your internship evaluation has been approved. You can view the evaluation at the following address:

        {{ InternshipEvaluationUrl }}

        Sincerely,
        Témata FM TUL
        """;
        public required string InternshipEvaluationUrl { get; set; }
    }
}
