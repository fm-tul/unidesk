using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Dtos;

[GenerateModel(ForType = typeof(YesNo), Name = "YesNo", GenerateAggreation = true)]
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum YesNo
{
    [MultiLang("Yes", "Ano")]
    Yes = 1,
    
    [MultiLang("No", "Ne")]
    No = 2,
}