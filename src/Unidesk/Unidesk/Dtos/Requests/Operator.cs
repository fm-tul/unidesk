using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Dtos.Requests;

[GenerateModel(ForType = typeof(Operator), Name = "Operator", GenerateAggregation = true)]
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Operator
{
    [MultiLang("Or", "Nebo")]
    Or,

    [MultiLang("And", "A")]
    And,
}