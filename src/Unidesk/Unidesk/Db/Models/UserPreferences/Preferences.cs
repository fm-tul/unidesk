using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models.UserPreferences;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(ForType = typeof(Preferences), Name = nameof(Preferences), GenerateAggregation = true, GenerateMap = true)]
public enum Preferences
{
    [AttributeInfo("04448C26-FCE3-4706-9496-C9F763CF2B2E", nameof(OptOutFromEmailsAboutInternships), "Opt out from emails about internships")]
    OptOutFromEmailsAboutInternships = 1,
}