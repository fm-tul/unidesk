namespace Unidesk.Configurations;

public class InMemoryOptions
{
    public bool DisableEmails { get; set; }

    public InMemoryOptions CopyFrom(InMemoryOptions newOptions)
    {
        DisableEmails = newOptions.DisableEmails;
        return this;
    }
}