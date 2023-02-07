using OneOf;
using Unidesk.Db.Models;
using Unidesk.Security;

namespace Unidesk.Services.ThesisTransitions;

public class ThesisDraftState : IThesisStateTransitionService
{
    private readonly IUserProvider _userProvider;

    public ThesisDraftState(IUserProvider userProvider)
    {
        _userProvider = userProvider;
    }

    public List<ThesisStatus> SourceStates => new()
    {
        ThesisStatus.Draft,
    };

    public async Task<OneOf<ThesisStatus, TransitionError>> ChangeStateAsync(TransitionContext context)
    {
        // super user can change state to any state
        if (context.CurrentUser.HasGrant(Grants.User_SuperAdmin))
        {
            return context.TargetStatus;
        }
        
        return context.TargetStatus switch
        {
            ThesisStatus.New => await ToStatusNewAsync(context),
            _ => new TransitionError
            {
                Message = $"Cannot change status from {context.Thesis.Status} to {context.TargetStatus}",
                Description = $"Cannot change status from {context.Thesis.Status} to {context.TargetStatus}",
            },
        };
    }

    private async Task<OneOf<ThesisStatus, TransitionError>> ToStatusNewAsync(TransitionContext context)
    {
        if (context.Thesis.Supervisors.Select(i => i.Id).Contains(_userProvider.CurrentUserId))
        {
            return ThesisStatus.New;
        }

        if (_userProvider.HasGrant(Grants.User_Admin))
        {
            return ThesisStatus.New;
        }

        return new TransitionError
        {
            Message = "You are not supervisor of this thesis",
            Description = "You are not supervisor of this thesis",
        };
    }
}