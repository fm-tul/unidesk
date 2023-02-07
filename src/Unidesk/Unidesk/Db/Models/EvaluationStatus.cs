using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(EvaluationStatus), Name = nameof(EvaluationStatus), GenerateAggregation = true, GenerateMap = true)]
public enum EvaluationStatus
{
    /// <summary>
    /// Evaluation Evaluation was only just created and is waiting to be sent to the evaluator.
    /// </summary>
    [MultiLang("Prepared", "Založeno")]
    Prepared = 0,

    /// <summary>
    /// Evaluation Evaluation was sent to the evaluator and is waiting for the evaluation to be accepted.
    /// </summary>
    [MultiLang("Invited", "Pozváno")]
    Invited = 1,

    /// <summary>
    /// Evaluation Evaluation was sent to the evaluator and was confirmed by him/her.
    /// </summary>
    [MultiLang("Accepted", "Přijato")]
    Accepted = 2,

    /// <summary>
    /// Evaluation Evaluation is in a draft state. It was partially filled by the evaluator and is waiting for the rest of the data.
    /// It can be in this state for a specific amount of time, after which it will be automatically rejected.
    /// </summary>
    [MultiLang("Draft", "Koncept")]
    Draft = 3,

    /// <summary>
    /// Evaluation Evaluation was rejected by the evaluator or by the system.
    /// </summary>
    [MultiLang("Rejected", "Zamítnuto")]
    Rejected = 4,

    /// <summary>
    /// Evaluation Evaluation was completed by the evaluator and is waiting for the final approval.
    /// </summary>
    [MultiLang("Submitted", "Odesláno")]
    Submitted = 5,

    /// <summary>
    /// Evaluation Evaluation was approved by the system and is ready to be published.
    /// </summary>
    [MultiLang("Approved", "Schváleno")]
    Approved = 6,

    /// <summary>
    /// Evaluation Evaluation was reopened by the system and is waiting for the evaluator to complete it.
    /// From this state, the evaluation can be either Rejected or Accepted (again).
    /// </summary>
    [MultiLang("Reopened", "Znovu otevřeno")]
    Reopened = 7,

    /// <summary>
    /// Evaluation Evaluation was published and is available for the public.
    /// </summary>
    [MultiLang("Published", "Publikováno")]
    Published = 8,
}