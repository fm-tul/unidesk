namespace Unidesk.Db.Core;

/// <summary>
/// some entities can be deleted, some hidden, by default they neither meaning state is Active
/// </summary>
public interface IStateEntity
{
    public StateEntity State { get; set; }
}

public enum StateEntity
{
    Active = 0,
    Deleted = 1,
    Hidden = 2,
}

public static class States
{
    public static readonly StateEntity[] ActiveOrHidden = { StateEntity.Active, StateEntity.Hidden };
}