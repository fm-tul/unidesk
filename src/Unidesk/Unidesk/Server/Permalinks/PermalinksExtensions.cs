using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Utils.Extensions;

namespace Unidesk.Server.Permalinks;

public static class PermalinksExtensions
{
    public const string DocumentEndpoint = "d/{id}";
    public static string GetPermalink(this Internship item) => $"internships/{item.Id}";
    public static string GetPermalinkForDocument(this Guid accessKey) => DocumentEndpoint.Replace("{id}", accessKey.ToShortForm());
    public static string GetPermalink(this Document document) => document.AccessKey.GetPermalinkForDocument();
}