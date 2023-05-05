using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Unidesk.Client;
using Unidesk.Db.Models;
using Unidesk.Exceptions;
using Unidesk.Locales;
using Unidesk.Reports.Elements;
using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Reports.Templates;

public class InternshipEvaluationTemplateSupervisorCz : IEvaluationTemplate
{
    public string TemplateName => "InternshipEvaluation_Supervisor_CZ";
    public List<ReportQuestion> GetQuestions(ThesisEvaluationContext context) => Model.ReportQuestions;

    public object GetModel(ThesisEvaluationContext context)
    {
        var item = context.Evaluation;
        if (string.IsNullOrEmpty(item.Response))
        {
            return Model.CreateEmptyModel(context);
        }
        
        var model = WebJsonSerializer.Deserialize<Model>(item.Response)
                 ?? throw new ValidationException("Response is not valid");
        
        var answers = Model.ReportQuestions
           .Where(i => i is not SectionQuestion)
           .Select(i => new ReportAnswer { Id = i.Id, Answer = null })
           .ToList();
        
        // remove answers for deleted questions
        model.Answers = model.Answers.Where(i => answers.Any(a => a.Id == i.Id)).ToList();
        
        // add answers for new questions
        var missingAnswers = answers.Where(i => model.Answers.All(a => a.Id != i.Id)).ToList();
        model.Answers.AddRange(missingAnswers);

        return model;
    }

    public Task ValidateAndThrowAsync(ThesisEvaluationContext context)
    {
        var item = context.Evaluation;
        if (string.IsNullOrEmpty(item.Response))
        {
            throw new ValidationException("Response is empty");
        }

        var model = WebJsonSerializer.Deserialize<Model>(item.Response)
                 ?? throw new ValidationException("Response is not valid");

        var missingAnswers = model.Answers.Where(x => x.Answer == null)
           .ToList();
        if (missingAnswers.Any())
        {
            var missingQuestions = Model.ReportQuestions.Where(x => missingAnswers.Any(y => y.Id == x.Id))
               .ToList();
            throw new ValidationException($"Missing answers: {string.Join(", ", missingQuestions.Select(x => x.Question))}");
        }

        if (model.StudentName.IsNullOrEmpty())
        {
            throw new ValidationException("Author name is empty");
        }


        var allQuestionsIds = Model.ReportQuestions.Where(i => i is not SectionQuestion)
           .Select(i => i.Id)
           .ToList();
        var unknownQuestions = model.Answers.Where(x => !allQuestionsIds.Contains(x.Id))
           .ToList();
        if (unknownQuestions.Any())
        {
            throw new ValidationException($"Unknown questions: {string.Join(", ", unknownQuestions.Select(x => x.Id))}");
        }

        var missingQuestionsIds = allQuestionsIds
           .Where(x => model.Answers.All(y => y.Id != x))
           .ToList();
        
        if (missingQuestionsIds.Any())
        {
            throw new ValidationException($"Missing questions: {string.Join(", ", missingQuestionsIds)}");
        }


        return Task.CompletedTask;
    }

    public bool CanProcess(ThesisEvaluationContext context)
    {
        if (!context.Evaluation.IsForInternship || context.Internship is null)
        {
            Console.WriteLine("This evaluation is not for internship");
            return false;
        }

        var userFunction = context.UserFunction;

        if (userFunction != UserFunction.Supervisor)
        {
            Console.WriteLine("This Template is for Opponents only");
            return false;
        }

        return true;
    }
}

file class Model : IEvaluationModel
{
    // Student name:
    public required string StudentName { get; set; }

    // Internship title
    public required string InternshipTitle { get; set; }


    [JsonIgnore]
    public static List<ReportQuestion> ReportQuestions { get; set; } = new()
    {
        Questions.Section("report.section.internship.company-info"),
        Questions.TextQuestions.InternshipSupervisorName_CZ,
        Questions.TextQuestions.InternshipSupervisorPosition_CZ,
        Questions.TextQuestions.InternshipCompanyName_CZ,
        
        Questions.Section("report.section.internship.student-info"),
        Questions.TextQuestions.InternshipStudentName_CZ,
        Questions.TextQuestions.InternshipStudyProgram_CZ,
        Questions.TextQuestions.InternshipStudentId_CZ,
        
        Questions.Section("report.section.internship.internship-info"),
        Questions.TextQuestions.InternshipDateFrom_CZ,
        Questions.TextQuestions.InternshipDateTo_CZ,
        Questions.TextQuestions.InternshipPosition_CZ,
        Questions.TextQuestions.InternshipJobDescription_CZ,
        Questions.TextQuestions.InternshipOverallAssessment_CZ,
        
        Questions.Section("report.section.internship.date-and-place"),
        Questions.TextQuestions.InternshipInCity_CZ,
        Questions.TextQuestions.InternshipOnDay_CZ,
    };

    public List<ReportAnswer> Answers { get; set; } = new();

    public static Model CreateEmptyModel(ThesisEvaluationContext context)
    {
        /*
            Jméno a příjmení studenta:
            Studijní program:
            Číslo studenta: 


            Potvrzuji, že výše uvedený student absolvoval praxi ve společnosti       od       do      
            na pracovní pozici       v rozsahu 180 hodin.

            Náplň práce………………………………

            Zhodnocení praxe a kvality odvedené práce:


            V       dne      

            Jméno a funkce zaměstnance, který potvrzení vydává:      

            Podpis a razítko organizace: 

         */
        var answers = ReportQuestions
           .Where(i => i is not SectionQuestion)
           .Select(i => new ReportAnswer { Id = i.Id, Answer = null })
           .ToList();

        var internship = context.Internship
                      ?? throw new InvalidStateException("Internship is null");
        var evaluation = context.Evaluation
                      ?? throw new InvalidStateException("Evaluation is null");

        // prefill some answers
        answers.First(i => i.Id == Questions.TextQuestions.InternshipSupervisorName_CZ.Id).Answer = evaluation.EvaluatorFullName;
        answers.First(i => i.Id == Questions.TextQuestions.InternshipStudentName_CZ.Id).Answer = internship.Student.FullName;
        answers.First(i => i.Id == Questions.TextQuestions.InternshipCompanyName_CZ.Id).Answer = internship.CompanyName;

        var model = new Model
        {
            StudentName = internship.Student.FullName,
            InternshipTitle = internship.InternshipTitle,
            Answers = answers,
        };
        return model;
    }
}