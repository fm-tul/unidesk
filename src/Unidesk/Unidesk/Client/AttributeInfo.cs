using System.ComponentModel.DataAnnotations;
using Unidesk.Db.Core;

namespace Unidesk.Db.Models;

[AttributeUsage(AttributeTargets.Field)]
public class AttributeInfo : Attribute
{
    public readonly string Name;
    public readonly string Description;
    public readonly Guid Id;

    public AttributeInfo(string id, string name, string description)
    {
        Id = Guid.Parse(id);
        Name = name;
        Description = description;
    }
}

public class AttributeInfoItem : IdEntity
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Description { get; set; }
}

public static class AttributeInfoItemExtensions
{
    public static Grant AsGrant(this AttributeInfoItem item) => Grant.FromAttributeInfoItem(item);
}

public static class AttributeInfoExtensions
{
    public static AttributeInfoItem AsAttributeInfoItem(this AttributeInfo attributeInfo) => new()
    {
        Id = attributeInfo.Id,
        Name = attributeInfo.Name,
        Description = attributeInfo.Description
    };
}