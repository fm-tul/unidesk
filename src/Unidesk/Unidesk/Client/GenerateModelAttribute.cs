namespace Unidesk.Client;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Enum, AllowMultiple = true)]
public class GenerateModelAttribute : Attribute
{
    public string Name { get; set; }

    public Type ForType { get; set; }

    public bool GenerateAggreation { get; set; }
}