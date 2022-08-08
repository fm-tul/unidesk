using System.Globalization;
using Unidesk.Db.Core;
using Newtonsoft.Json;
#pragma warning disable CS8669

namespace Unidesk.Services.Stag.Models;


public class KvalifikacniPraceList
{
    [JsonProperty("kvalifikacniPrace")]
    public List<KvalifikacniPrace> KvalifikacniPrace { get; set; }
}

public class KvalifikacniPrace
{
    [JsonProperty("student")]
    public Student Student { get; set; }

    [JsonProperty("adipidno")]
    public long Adipidno { get; set; }

    [JsonProperty("temaHlavni")]
    public string TemaHlavni { get; set; }

    [JsonProperty("temaHlavniAn")]
    public string TemaHlavniAn { get; set; }

    [JsonProperty("temaSoubezne")]
    public object TemaSoubezne { get; set; }

    [JsonProperty("temaVedlejsi")]
    public object TemaVedlejsi { get; set; }

    [JsonProperty("nazevDleStud")]
    public string NazevDleStud { get; set; }

    [JsonProperty("ilustrace")]
    public string Ilustrace { get; set; }

    [JsonProperty("schemata")]
    public string Schemata { get; set; }

    [JsonProperty("grafy")]
    public string Grafy { get; set; }

    [JsonProperty("tabulky")]
    public string Tabulky { get; set; }

    [JsonProperty("plany")]
    public string Plany { get; set; }

    [JsonProperty("noty")]
    public string Noty { get; set; }

    [JsonProperty("portrety")]
    public string Portrety { get; set; }

    [JsonProperty("mapy")]
    public string Mapy { get; set; }

    [JsonProperty("klicSlova")]
    public string KlicSlova { get; set; }

    [JsonProperty("klicSlovaAn")]
    public string KlicSlovaAn { get; set; }

    [JsonProperty("vyjadreni")]
    public string Vyjadreni { get; set; }

    [JsonProperty("vyjadreniAn")]
    public string VyjadreniAn { get; set; }

    [JsonProperty("prilohy")]
    public string Prilohy { get; set; }

    [JsonProperty("rozsah")]
    public string Rozsah { get; set; }

    [JsonProperty("jazyk")]
    public string Jazyk { get; set; }

    [JsonProperty("vedouciUcitidno")]
    public string VedouciUcitidno { get; set; }

    [JsonProperty("vedouciJmeno")]
    public string VedouciJmeno { get; set; }

    [JsonProperty("oponentUcitidno")]
    public string OponentUcitidno { get; set; }

    [JsonProperty("oponentJmeno")]
    public string OponentJmeno { get; set; }

    [JsonProperty("skolitelUcitidno")]
    public object SkolitelUcitidno { get; set; }

    [JsonProperty("skolitelJmeno")]
    public object SkolitelJmeno { get; set; }

    [JsonProperty("konzultantZUnivUcitidno")]
    public object KonzultantZUnivUcitidno { get; set; }

    [JsonProperty("konzultantZUnivJmeno")]
    public object KonzultantZUnivJmeno { get; set; }

    [JsonProperty("konzultantMimoUnivUcitidno")]
    public object KonzultantMimoUnivUcitidno { get; set; }

    [JsonProperty("konzultantMimoUnivJmeno")]
    public object KonzultantMimoUnivJmeno { get; set; }

    [JsonProperty("skolitelSpecialistaUcitidno")]
    public object SkolitelSpecialistaUcitidno { get; set; }

    [JsonProperty("skolitelSpecialistaJmeno")]
    public object SkolitelSpecialistaJmeno { get; set; }

    [JsonProperty("prevzatoKnihovna")]
    public string PrevzatoKnihovna { get; set; }

    [JsonProperty("zkontrolovano")]
    public string Zkontrolovano { get; set; }

    [JsonProperty("datumZadani")]
    [JsonConverter(typeof(DateOnlyConverter))]
    public DateOnly? DatumZadani { get; set; }

    [JsonProperty("planovaneDatumOdevzdani")]
    [JsonConverter(typeof(DateOnlyConverter))]
    public DateOnly? PlanovaneDatumOdevzdani { get; set; }

    [JsonProperty("planovaneDatumOdevzdaniText")]
    public string PlanovaneDatumOdevzdaniText { get; set; }

    [JsonProperty("datumOdevzdani")]
    [JsonConverter(typeof(DateOnlyConverter))]
    public DateOnly? DatumOdevzdani { get; set; }

    [JsonProperty("datumObhajoby")]
    public object DatumObhajoby { get; set; }

    [JsonProperty("datumKnihovna")]
    public object DatumKnihovna { get; set; }

    [JsonProperty("datumPosledniZmenaZaznamu")]
    [JsonConverter(typeof(DateTimeConverter))]
    public DateTime? DatumPosledniZmenaZaznamu { get; set; }

    [JsonProperty("formaPublikace")]
    public string FormaPublikace { get; set; }

    [JsonProperty("stavPrace")]
    public string StavPrace { get; set; }

    [JsonProperty("hodnoceniAN")]
    public object HodnoceniAn { get; set; }

    [JsonProperty("znamka")]
    public object Znamka { get; set; }

    [JsonProperty("znamkaOponent")]
    public object ZnamkaOponent { get; set; }

    [JsonProperty("znamkaVedouci")]
    public object ZnamkaVedouci { get; set; }

    [JsonProperty("pokus")]
    public object Pokus { get; set; }

    [JsonProperty("katedra")]
    public string Katedra { get; set; }

    [JsonProperty("typPrace")]
    public string TypPrace { get; set; }

    [JsonProperty("stprIdno")]
    public long StprIdno { get; set; }

    [JsonProperty("nazevStudProgramu")]
    public string NazevStudProgramu { get; set; }

    [JsonProperty("kodStudProgramu")]
    public string KodStudProgramu { get; set; }

    [JsonProperty("tisknout")]
    public string Tisknout { get; set; }

    [JsonProperty("zasady")]
    public string Zasady { get; set; }

    [JsonProperty("seznamLiter")]
    public string SeznamLiter { get; set; }

    [JsonProperty("povoleniZverejnitPraci")]
    public string PovoleniZverejnitPraci { get; set; }

    [JsonProperty("povoleniZverejnitPosudky")]
    public string PovoleniZverejnitPosudky { get; set; }

    [JsonProperty("ziskanyTitul")]
    public string ZiskanyTitul { get; set; }

    [JsonProperty("typStProgramu")]
    public string TypStProgramu { get; set; }

    [JsonProperty("fakulta")]
    public string Fakulta { get; set; }

    [JsonProperty("fakultaTxt")]
    public string FakultaTxt { get; set; }

    [JsonProperty("oborKombinaceStudenta")]
    public string OborKombinaceStudenta { get; set; }

    [JsonProperty("prubehObhajoby")]
    public object PrubehObhajoby { get; set; }

    [JsonProperty("poslatDoKnihovny")]
    public string PoslatDoKnihovny { get; set; }
}

public class DateOnlyConverter : JsonConverter
{
    class ValueType
    {
        [JsonProperty("value")]
        public string Value { get; set; }
    }
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override object? ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        try
        {
            var result = serializer.Deserialize<ValueType>(reader);
            // "value": "16.5.2022"
            var parsed = DateOnly.TryParseExact(result.Value, "d.M.yyyy", out var dateOnly);
            return (parsed ? dateOnly : null);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public override bool CanConvert(Type objectType)
    {
        throw new NotImplementedException();
    }
}

public class DateTimeConverter : JsonConverter
{
    class ValueType
    {
        [JsonProperty("value")]
        public string Value { get; set; }
    }
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override object? ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        try
        {
            var result = serializer.Deserialize<ValueType>(reader);
            // "value": "30.5.2022 12:23"
            var parsed = DateTime.TryParseExact(result.Value, "d.M.yyyy H:mm", null, DateTimeStyles.None, out var dateTime);
            return (parsed ? dateTime : null);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public override bool CanConvert(Type objectType)
    {
        throw new NotImplementedException();
    }
}

public class Student : ISimpleUser
{
    [JsonProperty("osCislo")]
    public string? StagId { get; set; }

    [JsonProperty("jmeno")]
    public string FirstName { get; set; }

    [JsonProperty("prijmeni")]
    public string LastName { get; set; }

    public string? MiddleName { get; set; }

    [JsonProperty("titulPred")]
    public string TitleBefore { get; set; }

    [JsonProperty("titulZa")]
    public string TitleAfter { get; set; }

    [JsonProperty("stav")]
    public string Status { get; set; }

    [JsonProperty("userName")]
    public string Username { get; set; }


    public string? Email
    {
        get => $"{Username}@tul.cz";
        set { }
    }

    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string? Address { get; set; }
    public string? Position { get; set; }
}