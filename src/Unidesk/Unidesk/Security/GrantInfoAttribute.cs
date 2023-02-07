namespace Unidesk.Security;

[AttributeUsage(AttributeTargets.Field)]
public class GrantInfoAttribute : Attribute
{
    public readonly string Name;
    public readonly string Description;
    public readonly Guid Id;

    public GrantInfoAttribute(string id, string name, string description)
    {
        Id = Guid.Parse(id);
        Name = name;
        Description = description;
    }
}