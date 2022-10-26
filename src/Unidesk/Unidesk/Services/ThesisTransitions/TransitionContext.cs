using Unidesk.Db.Models;

namespace Unidesk.Services.ThesisTransitions;

public class TransitionContext
{
    public readonly Thesis Thesis;
    public readonly ThesisStatus TargetStatus;

    public readonly User CurrentUser;
    
    public TransitionContext(Thesis thesis, ThesisStatus targetStatus, User currentUser)
    {
        Thesis = thesis;
        TargetStatus = targetStatus;
        CurrentUser = currentUser;
    }
}