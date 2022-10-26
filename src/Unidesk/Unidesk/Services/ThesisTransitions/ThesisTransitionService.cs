using OneOf;
using Unidesk.Db.Models;

namespace Unidesk.Services.ThesisTransitions;

public class ThesisTransitionService : IThesisStateTransitionService
{
    private readonly IEnumerable<IThesisStateTransitionService> _transitions;

    public ThesisTransitionService(IEnumerable<IThesisStateTransitionService> transitions)
    {
        _transitions = transitions;
    }

    private IThesisStateTransitionService GetTransition(TransitionContext context)
    {
        return _transitions.FirstOrDefault(t => t.SourceStates.Contains(context.Thesis.Status))
            ?? throw new InvalidOperationException($"Changing Status from '{context.Thesis.Status}' to '{context.TargetStatus}' is not supported");
    }

    public List<ThesisStatus> SourceStates { get; } = Array.Empty<ThesisStatus>().ToList();
    public Task<OneOf<ThesisStatus, TransitionError>> ChangeStateAsync(TransitionContext context)
    {
        // find transition logic only if source status and target status are different
        return context.Thesis.Status == context.TargetStatus
            ? Task.FromResult<OneOf<ThesisStatus, TransitionError>>(context.TargetStatus)
            : GetTransition(context).ChangeStateAsync(context);
    }
}