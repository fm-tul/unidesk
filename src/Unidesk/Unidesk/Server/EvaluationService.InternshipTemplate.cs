using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Unidesk.Dtos;
using Unidesk.Reports;
using Unidesk.Reports.Elements;
using Unidesk.Reports.Templates;
using Unidesk.Utils.Extensions;

namespace Unidesk.Server;

public partial class EvaluationService
{
    private Document GetInternshipPdfPreview(EvaluationDetailDto item, CancellationToken ct)
    {
        var pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginHorizontal(1, Unit.Centimetre);
                page.MarginVertical(0.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(style =>
                {
                    style.FontSize(12);
                    style.FontFamily("Calibri");
                    style.FontColor(Colors.Black);
                    return style;
                });

                page.Footer()
                   .AlignCenter()
                   .Text($"Vygenerováno pomocí portálu Témata FM TUL, {DateTime.Now:dd.MM.yyyy HH:mm:ss}")
                   .FontColor(Colors.Grey.Darken1)
                   .FontSize(8);

                page.Content()
                   .Column(col =>
                    {
                        col.Item()
                           .Column(c =>
                            {
                                c.Spacing(0.125f, Unit.Centimetre);
                                c.Item()
                                   .ShowEntire()
                                   .ExtendHorizontal()
                                   .PaddingBottom(25)
                                   .AlignCenter()
                                   .Text("Potvrzení zaměstnavatele o absolvování odborné praxe")
                                   .FontFamily("Calibri")
                                   .ExtraBold()
                                   .FontSize(22);

                                if (item.Response is null)
                                {
                                    return;
                                }

                                var answers = ((IEvaluationModel)item.Response).Answers;
                                var questions = item.Questions;
                                var simpleAnswers = new[] { Questions.TextQuestions.InternshipStudentName_CZ, Questions.TextQuestions.InternshipStudyProgram_CZ, Questions.TextQuestions.InternshipStudentId_CZ };

                                foreach (var simpleAnswer in simpleAnswers)
                                {
                                    c.Item()
                                       .ExtendHorizontal()
                                       .Row(r =>
                                        {
                                            r.ConstantItem(200)
                                               .Text(questions.GetQuestion(simpleAnswer)!.Question)
                                               .FontFamily("Calibri");

                                            r.RelativeItem()
                                               .Text(answers.GetStringAnswer(simpleAnswer))
                                               .FontFamily("Calibri")
                                               .ExtraBold();
                                        });
                                }

                                var dateFrom = answers.GetDateAnswer(Questions.TextQuestions.InternshipDateFrom_CZ);
                                var dateTo = answers.GetDateAnswer(Questions.TextQuestions.InternshipDateTo_CZ);
                                var companyName = answers.GetStringAnswer(Questions.TextQuestions.InternshipCompanyName_CZ);
                                var position = answers.GetStringAnswer(Questions.TextQuestions.InternshipPosition_CZ);

                                c.Item()
                                   .ExtendHorizontal()
                                   .PaddingTop(25)
                                   .Text($"Potvrzuji, že výše uvedený student absolvoval praxi ve společnosti {companyName} od {dateFrom} do {dateTo} na pracovní pozici {position} v rozsahu 180 hodin.")
                                   .FontFamily("Calibri");


                                var longAnswers = new[] { Questions.TextQuestions.InternshipJobDescription_CZ, Questions.TextQuestions.InternshipOverallAssessment_CZ };
                                foreach (var longAnswer in longAnswers)
                                {
                                    c.Item()
                                       .ShowEntire()
                                       .ExtendHorizontal()
                                       .PaddingTop(0.15f, Unit.Centimetre)
                                       .Column(x =>
                                        {
                                            x.Spacing(0.25f, Unit.Centimetre);
                                            x.Item()
                                               .Text(questions.GetQuestion(longAnswer)!.Question)
                                               .FontFamily("Calibri");

                                            x.Item()
                                               .Background("#f7f7f7")
                                               .Border(1)
                                               .BorderColor("#e0e0e0")
                                               .Padding(0.125f, Unit.Centimetre)
                                               .MinHeight(4.0f, Unit.Centimetre)
                                               .Text(answers.GetStringAnswer(longAnswer))
                                               .FontFamily("Calibri")
                                               .FontSize(10);
                                        });
                                }

                                var inCity = answers.GetStringAnswer(Questions.TextQuestions.InternshipInCity_CZ);
                                var onDay = answers.GetDateAnswer(Questions.TextQuestions.InternshipOnDay_CZ);

                                c.Item()
                                   .ExtendHorizontal()
                                   .PaddingTop(25)
                                   .Text($"V {inCity} dne {onDay}")
                                   .FontFamily("Calibri");

                                var supervisorName = answers.GetStringAnswer(Questions.TextQuestions.InternshipSupervisorName_CZ);
                                var supervisorPosition = answers.GetStringAnswer(Questions.TextQuestions.InternshipSupervisorPosition_CZ);

                                c.Item()
                                   .ExtendHorizontal()
                                   .PaddingTop(25)
                                   .Column(c1 =>
                                    {
                                        c1.Item()
                                           .Text("Jméno a funkce zaměstnance, který potvrzení vydává: ")
                                           .FontFamily("Calibri");

                                        c1.Item()
                                           .Text($"{supervisorName}, {supervisorPosition}")
                                           .Bold()
                                           .FontFamily("Calibri");
                                    });
                            });
                    });
            });
        });
        return pdf;
    }
}