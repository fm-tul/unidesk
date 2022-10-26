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
        return context.TargetStatus switch
        {
            ThesisStatus.New => await ToStatusNewAsync(context),
            _ => new TransitionError
            {
                Message = $"Cannot change status from {context.Thesis.Status} to {context.TargetStatus}",
                Description = $"Only supervisor of the thesis or user with Grant {UserGrants.User_Admin} can change status from draft to new",
            },
        };
    }

    private async Task<OneOf<ThesisStatus, TransitionError>> ToStatusNewAsync(TransitionContext context)
    {
        if (context.Thesis.Supervisors.Select(i => i.Id).Contains(_userProvider.CurrentUserId))
        {
            return ThesisStatus.New;
        }

        if (_userProvider.HasGrant(UserGrants.User_Admin))
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