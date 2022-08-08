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