using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Unidesk.Dtos;
using Unidesk.Reports;
using Unidesk.Reports.Elements;
using Unidesk.Reports.Templates;

namespace Unidesk.Server;

public partial class EvaluationService
{
    private static QuestPDF.Fluent.Document GetThesisPdfPreview(EvaluationDetailDto detailDto)
    {
        var pdf = QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(style =>
                {
                    style.FontSize(12);
                    style.FontFamily("Fira Code");
                    style.FontColor(Colors.Black);
                    return style;
                });

                page.Header()
                   .Row(x =>
                    {
                        x.ConstantItem(120, Unit.Millimetre)
                           .Image("c:\\projects\\tul\\unidesk\\templates\\logo-fm-txt-en.png");

                        x.RelativeItem()
                           .AlignRight();

                        x.ConstantItem(70)
                           .Image("c:\\projects\\tul\\unidesk\\templates\\symbol-fm.png");
                    });

                page.Content()
                   .Column(pageCol =>
                        {
                            pageCol.Item()
                               .Column(c =>
                                {
                                    c.Spacing(-0.25f, Unit.Centimetre);
                                    c.Item()
                                       .Text("THESIS EVALUATION")
                                       .FontFamily("Calibri")
                                       .ExtraBold()
                                       .FontSize(16);

                                    c.Item()
                                       .Text("OPPONENT EVALUATION")
                                       .FontFamily("Calibri")
                                       .SemiBold()
                                       .FontSize(14);
                                });


                            pageCol.Spacing(0.25f, Unit.Centimetre);
                            SectionQuestion? currentSection = null;
                            foreach (var questionRaw in detailDto.Questions)
                            {
                                var question = Questions.All.FirstOrDefault(i => i.Id == questionRaw.Id)
                                            ?? questionRaw;

                                var answer = (detailDto.Response as IEvaluationModel)?.Answers
                                   .FirstOrDefault(i => i.Id == question.Id);

                                if (question is GradeQuestion gradeQuestion)
                                {
                                    var section = currentSection;
                                    var item = pageCol.Item()
                                       .PaddingLeft(section?.Padding?.Left ?? 0f, Unit.Centimetre)
                                       .PaddingRight(section?.Padding?.Right ?? 0f, Unit.Centimetre)
                                       .PaddingTop(section?.Padding?.Top ?? 0f, Unit.Centimetre)
                                       .PaddingBottom(section?.Padding?.Bottom ?? 0f, Unit.Centimetre);

                                    item.ExtendHorizontal()
                                       .Row(x =>
                                        {
                                            x.AutoItem()
                                                // .Background(Colors.Red.Darken1)
                                               .Text(gradeQuestion.Question)
                                               .FontFamily("Calibri");
                                            // .FontFamily("TUL Mono");

                                            x.RelativeItem(1)
                                                // .Background(Colors.Green.Lighten1)
                                               .PaddingHorizontal(5)
                                               .DefaultTextStyle(s => s.FontColor(Colors.Grey.Darken1))
                                               .Dynamic(new DashedLine(question.Question))
                                                ;

                                            var gradeAttribute = answer?.Answer?.ToString()
                                              ?.GetLangAttributeFromGradeValue();

                                            x.AutoItem()
                                                // .Background(Colors.Blue.Lighten1)
                                               .Container()
                                               .AlignRight()
                                               .Text(gradeAttribute?.EngValue ?? "")
                                               .FontFamily("Calibri");
                                        });
                                }
                                else if (question is CustomChoiceQuestion<Questions.CustomChoiceQuestions.DefenseQuestionAnswer> customChoiceQuestion)
                                {
                                    var a = answer?.Answer?.ToString()
                                      ?.GetLangAttributeFromEnumValue<Questions.CustomChoiceQuestions.DefenseQuestionAnswer>();
                                    // answer is long so we use two rows
                                    pageCol.Item()
                                       .Column(x =>
                                        {
                                            x.Spacing(0.25f, Unit.Centimetre);
                                            x.Item()
                                                // .Background(Colors.Red.Darken2)
                                               .Text(customChoiceQuestion.Question)
                                               .Bold()
                                               .FontFamily("Calibri");
                                            // .FontFamily("TUL Mono");

                                            x.Item()
                                                // .Background(Colors.Blue.Lighten1)
                                               .Container()
                                               .Background("#f7f7f7")
                                               .Border(1)
                                               .BorderColor("#e0e0e0")
                                               .Padding(5)
                                               .AlignCenter()
                                               .Text(a?.EngValue ?? "")
                                               .FontFamily("Calibri");
                                        });
                                }
                                else if (question is TextQuestion textQuestion)
                                {
                                    if (textQuestion.Rows == 1)
                                    {
                                        pageCol.Item()
                                           .ExtendHorizontal()
                                           .Row(x =>
                                            {
                                                x.AutoItem()
                                                    // .Background(Colors.Red.Darken2)
                                                   .Text(textQuestion.Question)
                                                   .FontFamily("Calibri");
                                                // .FontFamily("TUL Mono");

                                                x.RelativeItem(1)
                                                    // .Background(Colors.Green.Lighten5)
                                                   .PaddingHorizontal(5)
                                                   .DefaultTextStyle(s => s.FontColor(Colors.Grey.Darken1))
                                                   .Dynamic(new DashedLine(question.Question))
                                                    ;

                                                x.AutoItem()
                                                    // .Background(Colors.Blue.Lighten5)
                                                   .Container()
                                                   .AlignRight()
                                                   .Text(answer?.Answer?.ToString() ?? "")
                                                   .FontFamily("Calibri");
                                            });
                                    }
                                    else
                                    {
                                        pageCol.Item()
                                           .ShowEntire()
                                           .ExtendHorizontal()
                                           .PaddingTop(0.15f, Unit.Centimetre)
                                           .Column(x =>
                                            {
                                                x.Spacing(0.25f, Unit.Centimetre);
                                                x.Item()
                                                   .Text($"{textQuestion.Question}: ")
                                                   .FontFamily("Calibri");

                                                x.Item()
                                                   .Background("#f7f7f7")
                                                   .Border(1)
                                                   .BorderColor("#e0e0e0")
                                                   .Padding(0.125f, Unit.Centimetre)
                                                   .MinHeight(4.0f, Unit.Centimetre)
                                                   .Text($"{answer?.Answer}")
                                                   .FontFamily("Calibri")
                                                   .FontSize(10);
                                            });
                                    }
                                }
                                else if (question is SectionQuestion sectionQuestion)
                                {
                                    currentSection = sectionQuestion;
                                    // simple margin filler
                                    pageCol.Item()
                                       .Container()
                                       .PaddingBottom(0.25f, Unit.Centimetre);
                                }
                            }
                        }
                    );
            });
        });
        return pdf;
    }
}