using OneOf;
using Unidesk.Db.Models;

namespace Unidesk.Services.ThesisTransitions;

public interface IThesisStateTransitionService
{
    public List<ThesisStatus> SourceStates { get; }

    public Task<OneOf<ThesisStatus, TransitionError>> ChangeStateAsync(TransitionContext context);
}