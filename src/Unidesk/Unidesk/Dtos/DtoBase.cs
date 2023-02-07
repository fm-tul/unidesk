using System.Text;

namespace Unidesk.Dtos;

public class DtoBase
{
    #if DEBUG
    // return name of the class with namespace (classes inheriting from DtoBase will have a different name)
    public string? _DtoType => GetFullNameSecure(GetType());
    #endif

    static string? GetFullNameSecure(Type t)
    {
        try
        {
            return GetFullName(t);
        }
        catch (Exception e)
        {
            return $"Error: {e}";
        }
    }

    static string? GetFullName(Type t)
    {
        if (!t.IsGenericType)
        {
            return t.FullName;
        }

        var sb = new StringBuilder();

        sb.Append(t.FullName?.Substring(0, t.FullName?.LastIndexOf("`") ?? 0));
        sb.Append(t.GetGenericArguments().Aggregate("<",
            (aggregate, type) => aggregate + (aggregate == "<" ? "" : ",") + GetFullName(type)
        ));
        sb.Append('>');

        return sb.ToString();
    }
}