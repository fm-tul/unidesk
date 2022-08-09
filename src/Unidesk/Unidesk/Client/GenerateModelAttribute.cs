namespace Unidesk.Client;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class GenerateModelAttribute : Attribute
{
    public string Name { get; set; }

    public Type ForType { get; set; }

    public bool GenerateAggreation { get; set; }
}