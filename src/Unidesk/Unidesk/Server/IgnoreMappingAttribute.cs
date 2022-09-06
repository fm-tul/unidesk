namespace Unidesk.Server;

/// <summary>
/// If applied to property, then the property is ignored during mapping
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public class IgnoreMappingAttribute : Attribute
{
    // This is a marker attribute
    // here is the chonker cat:
    //        /\__/\
    //       /`    '\
    //     === 0  0 ===
    //       \  --  /
    //     /          \
    //    /            \
    //   |              |
    //    \  ||    ||  /
    //     \_oo____oo_/#######o
}

/// <summary>
/// Just a marker attribute, which is used to mark a class and dto
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct, AllowMultiple = false)]
public class HasMappingAttribute : Attribute
{
    public Type Type { get; set; }

    public HasMappingAttribute(Type type) { Type = type; }
    // This is a marker attribute
    // here is the chonker cat:
    //        /\__/\
    //       /`    '\
    //     === 0  0 ===
    //       \  --  /
    //     /          \
    //    /            \
    //   |              |
    //    \  ||    ||  /
    //     \_oo____oo_/#######o
}