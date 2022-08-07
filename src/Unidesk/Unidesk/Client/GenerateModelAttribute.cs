namespace Unidesk.Client;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class GenerateModelAttribute : Attribute
{
    public string Name { get; set; }

    public Type ForType { get; set; }

    public bool GenerateAggreation { get; set; }
}

[AttributeUsage(AttributeTargets.Class)]
public class GenerateFieldAttribute : Attribute
{
    public Type Serializer { get; set; }
}