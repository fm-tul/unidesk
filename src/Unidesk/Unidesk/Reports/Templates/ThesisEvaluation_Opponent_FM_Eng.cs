using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;
using Unidesk.Client;
using Unidesk.Db.Models;
using Unidesk.Locales;
using Unidesk.Reports.Elements;
using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Reports.Templates;

public class ThesisEvaluation_Opponent_FM_Eng : IThesisEvaluation
{
    public string TemplateName => "ThesisEvaluation_Opponent_FM_Eng";
    public List<ReportQuestion> GetQuestions(ThesisEvaluationContext context) => Model.ReportQuestions;

    public object GetModel(ThesisEvaluationContext context)
    {
        var item = context.ThesisEvaluation;
        if (string.IsNullOrEmpty(item.Response))
        {
            return Model.CreateEmptyModel(context);
        }

        return WebJsonSerializer.Deserialize<Model>(item.Response)!;
    }

    public Task ValidateAndThrowAsync(ThesisEvaluationContext context)
    {
        var item = context.ThesisEvaluation;
        if (string.IsNullOrEmpty(item.Response))
        {
            throw new ValidationException("Response is empty");
        }

        var model = WebJsonSerializer.Deserialize<Model>(item.Response)
                 ?? throw new ValidationException("Response is not valid");

        var missingAnswers = model.Answers.Where(x => x.Answer == null).ToList();
        if (missingAnswers.Any())
        {
            var missingQuestions = Model.ReportQuestions.Where(x => missingAnswers.Any(y => y.Id == x.Id)).ToList();
            throw new ValidationException($"Missing answers: {string.Join(", ", missingQuestions.Select(x => x.Question))}");
        }

        if (model.AuthorName.IsNullOrEmpty())
        {
            throw new ValidationException("Author name is empty");
        }
        
        
        var allQuestionsIds = Model.ReportQuestions.Where(i => i is not SectionQuestion).Select(i => i.Id).ToList();
        var unknownQuestions = model.Answers.Where(x => !allQuestionsIds.Contains(x.Id)).ToList();
        if (unknownQuestions.Any())
        {
            throw new ValidationException($"Unknown questions: {string.Join(", ", unknownQuestions.Select(x => x.Id))}");
        }
        
        var missingQuestionsIds = allQuestionsIds.Where(x => model.Answers.All(y => y.Id != x)).ToList();
        if (missingQuestionsIds.Any())
        {
            throw new ValidationException($"Missing questions: {string.Join(", ", missingQuestionsIds)}");
        }
        

        return Task.CompletedTask;
    }


    public bool CanProcess(ThesisEvaluationContext context)
    {
        Thesis thesis = context.Thesis;
        Language language = context.Language;
        User user = context.Evaluator;
        UserFunction userFunction = context.UserFunction;

        if (!thesis.Status.In(ThesisStatus.Submitted, ThesisStatus.Finished))
        {
            Console.WriteLine("ThesisEvaluation_Opponent_FM_Eng can only be used for submitted or finished theses.");
            return false;
        }

        if (language != Language.English)
        {
            Console.WriteLine("ThesisEvaluation_Opponent_FM_Eng can only be used for English theses.");
            return false;
        }

        if (thesis.ThesisType?.Code != "BP")
        {
            Console.WriteLine("ThesisEvaluation_Opponent_FM_Eng can only be used for faculty FM.");
            return false;
        }

        if (userFunction != UserFunction.Opponent)
        {
            Console.WriteLine("This Template is for Opponents only");
            return false;
        }

        return true;
    }
}

file class Model
{
    // Author name:
    public required string AuthorName { get; set; }

    // Thesis title
    public required string ThesisTitle { get; set; }


    [JsonIgnore]
    public static List<ReportQuestion> ReportQuestions { get; set; } = new()
    {
        Questions.Section("report.section.general", "9D638512-28EF-4468-B748-B526CEDEAC37"),
        Questions.TextQuestions.OpponentName,
        Questions.TextQuestions.OpponentWorkplace,

        Questions.Section("report.section.evaluation", "8599AA76-FDB0-4565-B6E4-9CD1E052CA91"),
        Questions.ChoiceGradeQuestions.A_AbstractQualityKeywordsMatching,
        Questions.ChoiceGradeQuestions.B_ResearchScopeAndProcessing,
        Questions.ChoiceGradeQuestions.C_LevelOfTheoreticalPart,
        Questions.ChoiceGradeQuestions.D_AppropriatenessOfTheMethods,
        Questions.ChoiceGradeQuestions.E_ResultsElaborationAndDiscussion,
        Questions.ChoiceGradeQuestions.F_StudentsOwnContribution,
        Questions.ChoiceGradeQuestions.G_TheConclusionStatement,
        Questions.ChoiceGradeQuestions.H_FulfillmentOfThesisTasksGoals,
        Questions.ChoiceGradeQuestions.I_StructureCorrectnessAndFullnessOfReferences,
        Questions.ChoiceGradeQuestions.J_TypographicalAndLanguageLevel,
        Questions.ChoiceGradeQuestions.K_FormalQuality,

        Questions.TextQuestions.CommentsRemarks,
        Questions.TextQuestions.OverallAssessment,
        Questions.TextQuestions.QuestionsForTheDefense,

        Questions.Section("report.section.overall-evaluation", "84C4E6F5-4FB8-4799-8BDF-940322CC3B57"),
        Questions.CustomChoiceQuestions.OverallClassificationAndRecommendation,
        Questions.ChoiceGradeQuestions.X_ISuggestToClassifyThisWorkByGrade,
    };

    public List<ReportAnswer> Answers { get; set; } = new();

    public static Model CreateEmptyModel(ThesisEvaluationContext context)
    {
        /*
            A. Abstract quality, keywords matching. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            B. Research scope and processing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            C. Level of theoretical part . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            D. Appropriateness of the methods . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            E. Results elaboration and discussion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            F. Students own contribution . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            G. The conclusion statement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            H. Fulfillment of Thesis tasks (goals). . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            I. Structure, correctness and fullness of references. . . . . . . . . . . . . . . . . . . . .
            J. Typographical and language level. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            K. Formal quality. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            (text structure, chapters order, clarity of illustrations)
            
            Comments, remarks: long text
            Overall assessment: long text
            Questions for the defense: long text
            
            Overall classification and recommendation:
              - Work meets the Master degree requirements and therefore I recommend it for the defense.
              - Work does not meet the Master degree requirements and therefore I do not recommend it for the defense
            
            I suggest to classify this work by grade: grade

         */
        var answers = ReportQuestions
           .Where(i => i is not SectionQuestion)
           .Select(i => new ReportAnswer { Id = i.Id, Answer = null })
           .ToList();

        // prefill some answers
        answers.First(i => i.Id == Questions.TextQuestions.OpponentName.Id).Answer = context.Evaluator.FullName;

        var model = new Model
        {
            AuthorName = context.Thesis.Authors.First().FullName!,
            ThesisTitle = context.Thesis.NameEng,
            Answers = answers,
        };
        return model;
    }
}