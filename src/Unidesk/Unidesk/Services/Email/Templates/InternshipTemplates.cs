namespace Unidesk.Services.Email.Templates;

public class InternshipTemplates
{
    public class NewInternshipSubmittedEngTemplate : ITemplateContext
    {
        public const string Subject = "New Internship Applications Await Your Approval";
        public const string TemplateBody = """
        Greetings,

        New internship applications are now available for your approval (currently {{ InternshipCount }}). To review and decide, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;

        public required int InternshipCount;
        public required string InternshipUrl;
    }
    
    public class NewInternshipSubmittedCzeTemplate : ITemplateContext
    {
        public const string Subject = "Nové žádosti o stáže čekají na Vaše schválení";
        public const string TemplateBody = """
        Dobrý den,

        Nové žádosti o stáže jsou nyní k dispozici pro Vaše schválení (aktuálně {{ InternshipCount }}). Pro přezkoumání a rozhodnutí klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL
        """;

        public required int InternshipCount;
        public required string InternshipUrl;
    }
    
    public class InternshipApprovedEngTemplate : ITemplateContext
    {
        public const string Subject = "Your Internship Application Has Been Approved";
        public const string TemplateBody = """
        Greetings,

        Your internship application has been approved. To view the details, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;

        public required string InternshipUrl;
    }
    
    public class InternshipApprovedCzeTemplate : ITemplateContext
    {
        public const string Subject = "Vaše žádost o stáž byla schválena";
        public const string TemplateBody = """
        Dobrý den,

        Vaše žádost o stáž byla schválena. Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL
        """;

        public required string InternshipUrl;
    }
    
        
    public class InternshipUpdatedEngTemplate : ITemplateContext
    {
        public const string Subject = "Your Internship Application Has Been Updated";
        public const string TemplateBody = """
        Greetings,

        Your internship application has been updated. To view the details, please click on the link below:

        {{ InternshipUrl }}

        Sincerely,
        Témata FM TUL
        """;

        public required string InternshipUrl;
    }
    
    public class InternshipUpdatedCzeTemplate : ITemplateContext
    {
        public const string Subject = "Vaše žádost o stáž byla aktualizována";
        public const string TemplateBody = """
        Dobrý den,

        Vaše žádost o stáž byla aktualizována. Pro zobrazení podrobností klikněte na níže uvedený odkaz:

        {{ InternshipUrl }}

        S pozdravem,
        Témata FM TUL
        """;

        public required string InternshipUrl;
    }

}