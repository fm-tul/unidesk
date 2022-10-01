using Unidesk.Utils.Extensions;

namespace Unidesk.Utils.Text;

public static class TitlesUtils
{
    public static readonly List<TitleSpec> TitleSpecs = new()
    {
        new TitleSpec("Bc.", true, "bakalář"),
        new TitleSpec("BcA.", true, "bakalář umění"),
        new TitleSpec("Ing.", true, "inženýr"),
        new TitleSpec("Ing. arch.", true, "inženýr achitekt"),
        new TitleSpec("MUDr.", true, "doktor medicíny"),
        new TitleSpec("MVDr.", true, "doktor veterinární medicíny"),
        new TitleSpec("MgA.", true, "magistr umění"),
        new TitleSpec("Mgr.", true, "magistr"),
        new TitleSpec("JUDr.", true, "doktor práv"),
        new TitleSpec("PhDr.", true, "doktor filozofie"),
        new TitleSpec("RNDr.", true, "doktor přírodních věd"),
        new TitleSpec("PharmDr.", true, "doktor farmacie"),
        new TitleSpec("ThLic.", true, "licenciát teologie"),
        new TitleSpec("ThDr.", true, "doktor teologie"),
        new TitleSpec("Ph.D.", false, "doktor"),
        new TitleSpec("Th.D.", false, "doktor teologie"),
        new TitleSpec("prof.", true, "profesor"),
        new TitleSpec("doc.", true, "docent"),
        new TitleSpec("CSc.", false, "kandidát věd"),
        new TitleSpec("DrSc.", false, "doktor věd"),
        new TitleSpec("dr. h. c.", false, "čestný doktorát"),
        new TitleSpec("PaedDr.", true, "doktor pedagogiky"),
        new TitleSpec("Dr.", true, "doktor"),
        new TitleSpec("PhMr.", true, "magistr farmacie"),
        new TitleSpec("DiS.", false, "diplomovaný specialista"),
    };

    public static List<TitleSpec> FindTitles(string titleLine)
    {
        // we cannot simply split the stting by space, because the title can contain spaces
        // so we have to try find all titles in the string
        var titles = TitleSpecs
            .Select(i => titleLine.ToLower().Contains(i.Title.ToLower()) ? i : null)
            .OfType<TitleSpec>()
            .ToList();

        return titles;
    }

    public static (string? BeforeName, string? AfterName) FormatTitles(List<TitleSpec> titles)
    {
        var byPlacement = titles.GroupBy(i => i.IsBeforeName).ToList();
        var beforeName = byPlacement.Where(i => i.Key).SelectMany(i => i.Select(j => j.Title)).ToList();
        var afterName = byPlacement.Where(i => !i.Key).SelectMany(i => i.Select(j => j.Title)).ToList();

        var beforeNameString = string.Join(" ", beforeName);
        var afterNameString = string.Join(" ", afterName);

        return (beforeNameString.Value(), afterNameString.Value());
    }
}

public record TitleSpec(string Title, bool IsBeforeName, string Description);