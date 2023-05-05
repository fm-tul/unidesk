using System.ComponentModel.DataAnnotations.Schema;
using Unidesk.Db.Core;
using Unidesk.Db.Models.Internships;
using Unidesk.Locales;

namespace Unidesk.Db.Models;

/// <summary>
/// This entity represents a single request for evaluation and later on evaluation itself. It is linked with Thesis entity.
/// Each Evaluation request is meant for a specific Thesis and a specific User. User is identified by his/her email address.
///
/// Each Evaluation stores the data in a JSON format as to allow for easy extension of the data model.
///
/// To secure the evaluation process, each Evaluation is assigned a unique token. This token is used to identify evaluator (by the email address)
/// Another layer of security is the passphrase. This passphrase is sent to the evaluator and is used to identify the evaluation.
/// </summary>
public class Evaluation : TrackedEntity
{
    public Guid? ThesisId { get; set; }
    public Thesis? Thesis { get; set; }
    
    [NotMapped]
    public bool IsForInternship => InternshipId.HasValue;
    
    [NotMapped]
    public bool IsForThesis => ThesisId.HasValue;
    
    public Guid? InternshipId { get; set; }
    public Internship? Internship { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; }
    
    public string? Response { get; set; }
    public string? Format { get; set; }
    
    public Guid? DocumentId { get; set; }
    public Document? Document { get; set; }
    
    // security stuff
    public string? Token { get; set; }
    public string? PassphraseHash { get; set; }

    public EvaluationStatus Status { get; set; }
    
    // props which define the evaluation request
    public Language Language { get; set; }
    public string Email { get; set; }
    public UserFunction UserFunction { get; set; }

    // after the evaluation is done, user will exist in the system and we can link it here
    public Guid? EvaluatorId { get; set; }
    public User? Evaluator { get; set; }
    public string EvaluatorFullName { get; set; }
    public string? RejectionReason { get; set; }
}