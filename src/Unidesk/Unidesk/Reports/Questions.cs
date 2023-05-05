using System.Reflection;
using System.Text.Json.Serialization;
using QuestPDF.Infrastructure;
using Unidesk.Client;
using Unidesk.Reports.Elements;
using Unidesk.Reports.Templates;
using Unidesk.Utils.Extensions;
using TextQuestion = Unidesk.Reports.Elements.TextQuestion;

namespace Unidesk.Reports;

public static class Questions
{
    public static class ChoiceGradeQuestions
    {
        /*
                A. Abstract quality, keywords matching
                B. Research scope and processing
                C. Level of theoretical part
                D. Appropriateness of the methods
                E. Results elaboration and discussion
                F. Students own contribution
                G. The conclusion statement
                H. Fulfillment of Thesis tasks (goals)
                I. Structure, correctness and fullness of references
                J. Typographical and language level
                K. Formal quality
                   (text structure, chapters order, clarity of illustrations)
                   
                X. I suggest to classify this work by grade
        */
        public static ReportQuestion A_AbstractQualityKeywordsMatching = new GradeQuestion
        {
            Id = new Guid("07942853-8847-4701-BCBC-202694534590"),
            Question = "A. Abstract quality, keywords matching",
        };

        public static ReportQuestion B_ResearchScopeAndProcessing = new GradeQuestion
        {
            Id = new Guid("A49BB7AA-3D3B-4BCF-B6FA-23C651A21A63"),
            Question = "B. Research scope and processing",
        };

        public static ReportQuestion C_LevelOfTheoreticalPart = new GradeQuestion
        {
            Id = new Guid("ACAB9A16-D149-48DA-963A-582AB0D17CC0"),
            Question = "C. Level of theoretical part",
        };

        public static ReportQuestion D_AppropriatenessOfTheMethods = new GradeQuestion
        {
            Id = new Guid("436B28FA-22C7-4921-820D-F0FF0A034264"),
            Question = "D. Appropriateness of the methods",
        };

        public static ReportQuestion E_ResultsElaborationAndDiscussion = new GradeQuestion
        {
            Id = new Guid("C3A16EF2-85DC-452F-92A7-CBF3BA8DDC21"),
            Question = "E. Results elaboration and discussion",
        };

        public static ReportQuestion F_StudentsOwnContribution = new GradeQuestion
        {
            Id = new Guid("28E6A50E-0395-4B8C-9093-A0F5CD7D9D84"),
            Question = "F. Students own contribution",
        };

        public static ReportQuestion G_TheConclusionStatement = new GradeQuestion
        {
            Id = new Guid("C73FC6F7-D893-4913-AEFA-CB1D07FEE98C"),
            Question = "G. The conclusion statement",
        };

        public static ReportQuestion H_FulfillmentOfThesisTasksGoals = new GradeQuestion
        {
            Id = new Guid("8B9B2715-B4FD-4A59-A4A2-209C6EAC7134"),
            Question = "H. Fulfillment of Thesis tasks (goals)",
        };

        public static ReportQuestion I_StructureCorrectnessAndFullnessOfReferences = new GradeQuestion
        {
            Id = new Guid("EBDA51A5-F39C-4EFC-AF13-7CE0F220D218"),
            Question = "I. Structure, correctness and fullness of references",
        };

        public static ReportQuestion J_TypographicalAndLanguageLevel = new GradeQuestion
        {
            Id = new Guid("5C802A77-9ED9-46F2-9A89-D405FB0CACE2"),
            Question = "J. Typographical and language level",
        };

        public static ReportQuestion K_FormalQuality = new GradeQuestion
        {
            Id = new Guid("EC7FE25C-05AC-41B6-BDE2-08C30336756E"),
            Question = "K. Formal quality",
            Description = "(text structure, chapters order, clarity of illustrations)",
        };

        public static ReportQuestion X_ISuggestToClassifyThisWorkByGrade = new GradeQuestion
        {
            Id = new Guid("8E9DDF48-4E81-412C-ABC1-E0CE64AFB767"),
            Question = "I suggest to classify this work by grade",
        };

        /*
            A. Úplnost abstraktu, klíčová slova odpovídají náplni práce
            B. Kvalita zpracování rešerše
            C. Řešení práce po teoretické stránce
            D. Vhodnost, přiměřenost použité metodiky
            E. Úroveň zpracování výsledků a diskuse
            F. Vlastní přínos k řešené problematice
            G. Formulace závěru práce
            H. Splnění zadání (cílů) práce
            I. Skladba, správnost a úplnost citací literárních údajů
            J. Typografická a jazyková úroveň (vč. pravopisu)
            K. Formální náležitosti práce
               (struktura textu, řazení kapitol, přehlednost ilustrací)
               
            X. Navrhuji tuto práci klasifikovat stupněm:
        */

        public static ReportQuestion A_AbstractQualityKeywordsMatching_CZ = new GradeQuestion
        {
            Id = new Guid("4333DAC9-C38E-40D0-9AA6-EC951764569F"),
            Question = "Úplnost abstraktu, klíčová slova odpovídají náplni práce",
        };

        public static ReportQuestion B_ResearchScopeAndProcessing_CZ = new GradeQuestion
        {
            Id = new Guid("BE68399D-1880-4B35-811A-1569F18D0C75"),
            Question = "Kvalita zpracování rešerše",
        };

        public static ReportQuestion C_LevelOfTheoreticalPart_CZ = new GradeQuestion
        {
            Id = new Guid("B9C9FE99-16D3-4D03-BDF3-D30057704A69"),
            Question = "Řešení práce po teoretické stránce",
        };

        public static ReportQuestion D_AppropriatenessOfTheMethods_CZ = new GradeQuestion
        {
            Id = new Guid("D455A0BA-CA0E-42CE-83A9-05C0D682A8C6"),
            Question = "Vhodnost, přiměřenost použité metodiky",
        };

        public static ReportQuestion E_ResultsElaborationAndDiscussion_CZ = new GradeQuestion
        {
            Id = new Guid("203AADB1-57F4-4CCF-AEC9-7C5263A4D896"),
            Question = "Úroveň zpracování výsledků a diskuse",
        };

        public static ReportQuestion F_StudentsOwnContribution_CZ = new GradeQuestion
        {
            Id = new Guid("3775880B-8A9A-4CA9-9527-6ACB6151B58E"),
            Question = "Vlastní přínos k řešené problematice",
        };

        public static ReportQuestion G_ThesisConclusionStatement_CZ = new GradeQuestion
        {
            Id = new Guid("9A121D0F-8D26-46F0-BF2E-88752480FB81"),
            Question = "Formulace závěru práce",
        };

        public static ReportQuestion H_FulfillmentOfThesisTasks_CZ = new GradeQuestion
        {
            Id = new Guid("EB08F010-1EB4-4BA9-917E-FF4C7A672EEB"),
            Question = "Splnění zadání (cílů) práce",
        };

        public static ReportQuestion I_StructureCorrectnessAndCompletenessOfReferences_CZ = new GradeQuestion
        {
            Id = new Guid("56671986-9AAF-4B00-8BD6-3C396B4CD307"),
            Question = "Skladba, správnost a úplnost citací literárních údajů",
        };

        public static ReportQuestion J_TypographicAndLanguageLevel_CZ = new GradeQuestion
        {
            Id = new Guid("F86F16CF-B75C-4E60-A261-7F36AD19D56B"),
            Question = "Typografická a jazyková úroveň (vč. pravopisu)",
        };

        public static ReportQuestion K_FormalQuality_CZ = new GradeQuestion
        {
            Id = new Guid("5F51C159-641D-4F2F-AE5A-867413263E77"),
            Question = "Formální náležitosti práce",
            Description = "(struktura textu, řazení kapitol, přehlednost ilustrací)",
        };

        public static ReportQuestion X_ISuggestToClassifyThisWorkByGrade_CZ = new GradeQuestion
        {
            Id = new Guid("2F3885FF-F543-4A94-A849-7C47C5F866B8"),
            Question = "Navrhuji tuto práci klasifikovat stupněm:",
        };
    }

    public static class TextQuestions
    {
        /*
         * Comments, remarks:
         * (!! enter your comments or at least delete this text)
         *
         * Overall assessment:
         * for example: Additional comments to the above evaluation; Thesis topicality; Topic difficulty of theoretical knowledge,
         * level of processing, work with scientific literature; The benefits of work; Experiments and their evaluation;
         * The importance for the practice / theory.
         *
         * Questions for the defense:
         * 1., 2., …
         */

        public static ReportQuestion CommentsRemarks = new TextQuestion
        {
            Id = new Guid("174D13EE-EC91-443C-822F-0FA86BF0A6DB"),
            Question = "Comments, remarks",
            Description = "!! enter your comments or at least delete this text",
            Rows = 10,
        };

        public static ReportQuestion OverallAssessment = new TextQuestion
        {
            Id = new Guid("7161BEF1-E8D6-4751-A404-6D48A42E025F"),
            Question = "Overall assessment",
            Description = """
                For example: Additional comments to the above evaluation; Thesis topicality; Topic difficulty of theoretical knowledge, 
                level of processing, work with scientific literature; The benefits of work; 
                Experiments and their evaluation; The importance for the practice / theory.
                """,
            Rows = 10,
        };

        public static ReportQuestion QuestionsForTheDefense = new TextQuestion
        {
            Id = new Guid("72952548-732D-4E6E-90D9-440E47C6B221"),
            Question = "Questions for the defense",
            Description = "1., 2., …",
            Rows = 10,
        };

        /*
         * Komentáře či připomínky
         * (!! vepište případný komentář, doplnění výše uvedené klasifikace, nebo smažte)
         *
         * Celkové zhodnocení:
         * Např: komentář k výše uvedenému hodnocení, aktuálnost tématu, náročnost tématu na teoretické znalosti,
         * vyšší úroveň zpracování literární rešerše, práce s vědeckou literaturou, přínosy práce,
         * experimenty a jejich vyhodnocení, význam pro praxi/teorii
         *
         * Otázky k obhajobě:
         *  1., 2., …
         */

        public static ReportQuestion CommentsRemarks_CZ = new TextQuestion
        {
            Id = new Guid("BC49FA15-9448-4EBD-AC3A-56A362FB40D8"),
            Question = "Komentáře či připomínky",
            Description = "!! vepište případný komentář, doplnění výše uvedené klasifikace, nebo smažte",
            Rows = 10,
        };

        public static ReportQuestion OverallAssessment_CZ = new TextQuestion
        {
            Id = new Guid("55E1FD69-7618-40C2-A64C-E2BC6B8A0C2F"),
            Question = "Celkové zhodnocení",
            Description = """
                Např: komentář k výše uvedenému hodnocení, aktuálnost tématu, náročnost tématu na teoretické znalosti, 
                vyšší úroveň zpracování literární rešerše, práce s vědeckou literaturou, přínosy práce, 
                experimenty a jejich vyhodnocení, význam pro praxi/teorii
                """,
            Rows = 10,
        };

        public static ReportQuestion QuestionsForTheDefense_CZ = new TextQuestion
        {
            Id = new Guid("B5F5F5B9-5B9B-4F5B-8F5B-5B5B5B5B5B5B"),
            Question = "Otázky k obhajobě",
            Description = "1., 2., …",
            Rows = 10,
        };

        /*
         * Opponent:
         * Opponent workplace:
         */

        public static ReportQuestion OpponentName = new TextQuestion
        {
            Id = new Guid("14A57F54-82DA-499E-978A-D8A79201FA76"),
            Question = "Opponent",
            Rows = 1,
        };

        public static ReportQuestion OpponentWorkplace = new TextQuestion
        {
            Id = new Guid("D6CB8878-67FE-4781-AC97-DC698EDE7D5C"),
            Question = "Opponent workplace",
            Rows = 1,
        };

        /*
         * Oponent práce:
         * Pracoviště oponenta:
         */

        public static ReportQuestion OpponentName_CZ = new TextQuestion
        {
            Id = new Guid("D45802CC-3282-4353-9C92-E60CDDDFAD21"),
            Question = "Oponent práce",
            Rows = 1,
        };

        public static ReportQuestion OpponentWorkplace_CZ = new TextQuestion
        {
            Id = new Guid("C1187EE4-0762-4696-983E-5AA2DCD32B9F"),
            Question = "Pracoviště oponenta",
            Rows = 1,
        };
        
        // internship report

        public static ReportQuestion InternshipStudentName_CZ = new TextQuestion
        {
            Id = new Guid("EF46CB5F-9479-421B-92DE-F5B5627DB81B"),
            Question = "Jméno a příjmení studenta",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipCompanyName_CZ = new TextQuestion
        {
            Id = new Guid("62353E63-9B0B-41BB-AB93-F95C8764692C"),
            Question = "Název společnosti",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipStudyProgram_CZ = new TextQuestion
        {
            Id = new Guid("E0984C0D-5D58-4C90-B65B-875FAAA9AB0E"),
            Question = "Studijní program",
            Rows = 1,
        };
        public static ReportQuestion InternshipStudentId_CZ = new TextQuestion
        {
            Id = new Guid("2ED2754E-A7E9-42B4-A000-F751832B45E7"),
            Question = "Číslo studenta",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipDateFrom_CZ = new TextQuestion
        {
            Id = new Guid("84D9E6AC-A171-4AB6-B4E3-3EAC4823B26B"),
            Question = "Datum od",
            Type = "date",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipDateTo_CZ = new TextQuestion
        {
            Id = new Guid("5CA08895-A3FE-4883-991F-6F65EB627362"),
            Question = "Datum do",
            Type = "date",
            Rows = 1,
        };

        public static ReportQuestion InternshipPosition_CZ = new TextQuestion
        {
            Id = new Guid("43E7665E-1ABC-4262-AAC3-3FF1D9637175"),
            Question = "Pozice v rámci stáže",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipJobDescription_CZ = new TextQuestion
        {
            Id = new Guid("CA631035-ACEB-42B4-ABDE-FDD83BF229D6"),
            Question = "Náplň práce",
            Rows = 10,
        };
        
        public static ReportQuestion InternshipOverallAssessment_CZ = new TextQuestion
        {
            Id = new Guid("96B4B226-EC1E-4FD2-BC81-1D4522B567A8"),
            Question = "Zhodnocení praxe a kvality odvedené práce",
            Rows = 10,
        };
        
        public static ReportQuestion InternshipInCity_CZ = new TextQuestion
        {
            Id = new Guid("D91873FA-C409-44FB-99DA-410E711C543D"),
            Question = "V",
            Rows = 1,
        };
        
        public static ReportQuestion InternshipOnDay_CZ = new TextQuestion
        {
            Id = new Guid("525D507A-DED9-4A87-9ADF-0D683A865960"),
            Question = "dne",
            Type = "date",
            Rows = 1,
        };   
        public static ReportQuestion InternshipSupervisorName_CZ = new TextQuestion
        {
            Id = new Guid("54F94567-978E-45A7-8A36-A1E6FD89D7FD"),
            Question = "Jméno a příjmení vedoucího stáže",
            Rows = 1,
        };        
        public static ReportQuestion InternshipSupervisorPosition_CZ = new TextQuestion
        {
            Id = new Guid("47EA3C18-FB47-4586-8B6E-A145F20B22ED"),
            Question = "Pozice vedoucího stáže",
            Rows = 1,
        };
    }

    public static class CustomChoiceQuestions
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [GenerateModel(ForType = typeof(DefenseQuestionAnswer), GenerateAggregation = true, Name = nameof(DefenseQuestionAnswer))]
        public enum DefenseQuestionAnswer
        {
            [MultiLang("Work meets the Master degree requirements and therefore I recommend it for the defense.",
                "Práce splňuje požadavky na udělení akademického titulu, a proto ji doporučuji k obhajobě")]
            WorkMeetsRequirements = 1,

            [MultiLang("Work does not meet the Master degree requirements and therefore I do not recommend it for the defense",
                "Práce nesplňuje požadavky na udělení akademického titulu, a proto ji nedoporučuji k obhajobě")]
            WorkDoesNotMeetRequirements = 2,
        }

        public static ReportQuestion OverallClassificationAndRecommendation = new CustomChoiceQuestion<DefenseQuestionAnswer>()
        {
            Id = new Guid("19A6B36E-4822-4D03-94F9-58DBB3D0766B"),
            Question = "Overall classification and recommendation",
        };

        public static ReportQuestion OverallClassificationAndRecommendation_CZ = new CustomChoiceQuestion<DefenseQuestionAnswer>()
        {
            Id = new Guid("74C6D644-1CE9-4D01-B7AD-3D1614E9F4E8"),
            Question = "Celková klasifikace a doporučení k obhajobě:",
        };
        // regex for guid: "\w{8}-\w{4}-\w{4}-\w{4}-\w{12}"
    }

    public static ReportQuestion Section(string name, string? guid = null, Padding? padding = null) =>
        new SectionQuestion
        {
            Id = guid.IsNullOrEmpty() ? Guid.NewGuid() : Guid.Parse(guid),
            Question = name,
            Padding = padding,
        };
    
    
    private static ReportQuestion[] FromClass(Type type)
    {
        return type.GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.FieldType == typeof(ReportQuestion))
            .Select(f => (ReportQuestion)f.GetValue(null)!)
            .ToArray();
    }
    public static ReportQuestion[] All = FromClass(typeof(Questions.CustomChoiceQuestions))
        .Concat(FromClass(typeof(Questions.TextQuestions)))
        .ToArray();
}

public record Padding(float? Left = 0, float? Right = 0, float? Top = 0, float? Bottom = 0);