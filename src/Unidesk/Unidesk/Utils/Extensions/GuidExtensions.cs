namespace Unidesk.Utils.Extensions;

public static class GuidExtensions
{
    public static bool IsEmpty(this Guid guid)
    {
        return guid == Guid.Empty;
    }

    // base64url encoding
    public static string ToShortForm(this Guid guid)
    {
        return Convert.ToBase64String(guid.ToByteArray())
           .Replace("/", "_")
           .Replace("+", "-");
    }

    public static bool TryParseShortForm(this string value, out Guid guid)
    {
        guid = Guid.Empty;
        try
        {
            var bytes = Convert.FromBase64String(value
               .Replace("_", "/")
               .Replace("-", "+"));
            guid = new Guid(bytes);
            return true;
        }
        catch
        {
            return false;
        }
    }
}