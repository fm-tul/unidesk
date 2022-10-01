using System.Text.Json.Serialization;
using Unidesk.Client;

namespace Unidesk.Db.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
[GenerateModel(Name = "ThesisStatus", ForType = typeof(ThesisStatus), GenerateAggreation = true)]
public enum ThesisStatus
{
    [MultiLang("Draft", "Návrh")]
    Draft = 0,
    
    [MultiLang("New", "Nové")]
    New = 1,
    
    [MultiLang("Reserved", "Rezervované")]
    Reserved = 2,
    
    [MultiLang("Assigned", "Přiřazeno")]
    Assigned = 3,
    
    [MultiLang("Submitted", "Odevzdáno")]
    Submitted = 4,
    
    [MultiLang("Finished Successfully", "Úspěšně dokončeno")]
    Finished_Susccessfully = 5,
    
    [MultiLang("Finished Unsuccessfully", "Neúspěšně dokončeno")]
    Finished_Unsuccessfully = 6,
    
    [MultiLang("Finished", "Dokončeno")]
    Finished = 7,
    
    [MultiLang("Abandoned", "Prerušeno")]
    Abandoned = 8,
    
    [MultiLang("Uknown", "Neznámý")]
    Unknown = 666
}