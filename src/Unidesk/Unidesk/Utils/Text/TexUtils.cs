using System.Text.RegularExpressions;

namespace Unidesk.Utils.Text;

public static class TexUtils
{
    /// <summary>
    /// Extract Items from a string
    /// </summary>
    /// 
    /// <example>
    /// <code>
    /// var input = "\\begin{enumerate}  " +
    ///             "\\item{Zpracujte průzkum na školách a získejte potřebné pedagogické cíle.}  " +
    ///             "\\item{Na základě konzultace s expertem definujte základní ekonomický model.}  " +
    ///             "\\item{Navrhněte a implementujte cílovou aplikaci včetně administrace.}  " +
    ///             "\\item{Proveďte testování na vybraných školách a získejte zpětnou vazbu.}  " +
    ///             "\\item{V závěru vyjmenujte další možnosti rozšíření.} " +
    ///             "\\end{enumerate}";
    /// var items = TexUtils.ExtractEnumerateItems(input);
    /// </code>
    /// </example>
    /// 
    /// <example>
    /// <code>
    /// var input = "\\begin{arab} " +
    ///             "\\item Seznamte se s návrhy větrných turbín, jejich parametry a možnostmi konstrukce a realizace. " +
    ///             "\\item Naučte se pracovat s metodou PIV a vyhodnocením výsledků. " +
    ///             "\\item Navrhněte a realizujte optimalizovaný model větrné turbíny. " +
    ///             " \\item Proveďte jednoduchou analýzu proudění v okolí modelu metodou PIV." +
    ///             " \\end{arab}";
    /// var items = TexUtils.ExtractEnumerateItems(input);
    /// </code>
    /// </example>
    ///  
    /// <example>
    /// <code>
    /// var input =
    ///     "\\par{[1] MACDONALD, Matthew, Adam FREEMAN a Mario SZPUSZTA. ASP.NET 4 a C# 2010: tvorba dynamických stránek profesionálně. Brno: Zoner Press, 2011. Encyklopedie Zoner Press. ISBN 9788074131455.\\par} " +
    ///     "\\par{[2] REVENDA, Zbyněk. Peněžní ekonomie a bankovnictví. 6., aktualiz. vyd. Praha: Management Press, 2015. ISBN9788072612796.\\par} " +
    ///     "\\par{[3] OWENS, Mike, 2014. Definitive Guide to SQLite. 1. Berlin: Springer-Verlag Berlin and Heidelberg GmbH {\\&}Co. ISBN 9781430211662.\\par}";
    /// var items = TexUtils.ExtractEnumerateItems(input);
    /// </code>
    /// </example>
    /// <param name="text"></param>
    /// <returns></returns>
    public static List<string> ExtractEnumerateItems(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return new List<string>();
        }
        
        var result = new List<string>();
        // we substring the text by \begin{.*} or \end{.*} and then we split by \item

        var beginIndex = text.IndexOf("\\begin{", StringComparison.Ordinal);
        var endIndex = text.IndexOf("\\end{", StringComparison.Ordinal);

        if (beginIndex == -1 || endIndex == -1)
        {
            // no begin or end, trying \\par
            text.Split("\\par", StringSplitOptions.RemoveEmptyEntries)
                .ToList()
                .ForEach(x =>
                {
                    var trimmed = x.Trim().TrimStart('{').TrimEnd('}').Trim();
                    if (!string.IsNullOrWhiteSpace(trimmed))
                    {
                        result.Add(trimmed);
                    }
                });
            return result;
        }

        var subject = text.Substring(beginIndex, endIndex - beginIndex);
        var items = subject
            .Split(new[] { "\\item" }, StringSplitOptions.RemoveEmptyEntries)
            .Skip(1)
            .ToList();

        items.ForEach(x =>
        {
            var trimmed = x.Trim().TrimStart('{').TrimEnd('}').Trim();
            if (!string.IsNullOrWhiteSpace(trimmed))
            {
                result.Add(trimmed);
            }
        });

        return result;
    }
}