using FluentAssertions;
using Unidesk.Utils.Text;
using Xunit;

namespace Unidesk.UnitTests.Utils.Text;

public class TexUtilsTests
{
    [Fact]
    public void Should_Parse_Tex_Enumerate_List()
    {
        var input = "\\begin{enumerate}  " +
                    "\\item{Zpracujte průzkum na školách a získejte potřebné pedagogické cíle.}  " +
                    "\\item{Na základě konzultace s expertem definujte základní ekonomický model.}  " +
                    "\\item{Navrhněte a implementujte cílovou aplikaci včetně administrace.}  " +
                    "\\item{Proveďte testování na vybraných školách a získejte zpětnou vazbu.}  " +
                    "\\item{V závěru vyjmenujte další možnosti rozšíření.} " +
                    "\\end{enumerate}";

        var items = TexUtils.ExtractEnumerateItems(input);
        items.Should().HaveCount(5);
        items[4].Should().Be("V závěru vyjmenujte další možnosti rozšíření.");
    }

    [Fact]
    public void Should_Parse_Tex_Enumerate_List2()
    {
     var input = "\\begin{arab} " +
                 "\\item Seznamte se s návrhy větrných turbín, jejich parametry a možnostmi konstrukce a realizace. " +
                 "\\item Naučte se pracovat s metodou PIV a vyhodnocením výsledků. " +
                 "\\item Navrhněte a realizujte optimalizovaný model větrné turbíny. " +
                 "\\item Proveďte jednoduchou analýzu proudění v okolí modelu metodou PIV." +
                 " \\end{arab}";
     
        var items = TexUtils.ExtractEnumerateItems(input);
        items.Should().HaveCount(4);
        items[0].Should().Be("Seznamte se s návrhy větrných turbín, jejich parametry a možnostmi konstrukce a realizace.");
    }
    
    
    [Fact]
    public void Should_Parse_Tex_Enumerate_List3()
    {
     var input = "\\renewcommand{\\labelenumi}{[\\theenumi]} " +
                 "\\begin{arab} " +
                 "\\item Bhabendu Kumar Mohanta, Panda, S.S. and Jena, D. (2018).~\\kur{An Overview of Smart Contract and Use Cases in Blockchain Technology}. [online] ResearchGate. Available at: https://www.researchgate.net/publication/328581609_An_Overview_of_Smart_Contract_and_Use_Cases_ in_Blockchain_Technology " +
                 "\\item Maher Alharby and Aad van Moorsel (2017).~\\kur{Blockchain Based Smart Contracts : A Systematic Mapping Study}. [online] ResearchGate. Available at: https://www.researchgate.net/publication/319603816_Blockchain_Based_Smart_Contracts_A_Systematic_Mapping_Study " +
                 "\\item Smart Contracts: 12 Use Cases for Business {\\&} Beyond Prepared by: Smart Contracts Alliance -In collaboration with Deloitte An industry initiative of the Chamber of Digital Commerce. (2016). [online] Available at: http://digitalchamber.org/assets/smart-contracts-12-use-cases-for-business-and-beyond.pdf " +
                 "\\item Bartoletti, M. (2020). Smart Contracts Contracts.~\\kur{Frontiers in Blockchain}, [online] 3. Available at: https://www.frontiersin.org/articles/10.3389/fbloc.2020.00027/full " +
                 "\\end{arab}";
     
        var items = TexUtils.ExtractEnumerateItems(input);
        items.Should().HaveCount(4);
        items[2].Should()
            .Be(
                "Smart Contracts: 12 Use Cases for Business {\\&} Beyond Prepared by: Smart Contracts Alliance -In collaboration with Deloitte An industry initiative of the Chamber of Digital Commerce. (2016). [online] Available at: http://digitalchamber.org/assets/smart-contracts-12-use-cases-for-business-and-beyond.pdf");
    }
    
    [Fact]
    public void Should_Parse_Tex_Enumerate_List4()
    {
        var input =
            "\\par{[1] MACDONALD, Matthew, Adam FREEMAN a Mario SZPUSZTA. ASP.NET 4 a C# 2010: tvorba dynamických stránek profesionálně. Brno: Zoner Press, 2011. Encyklopedie Zoner Press. ISBN 9788074131455.\\par} " +
            "\\par{[2] REVENDA, Zbyněk. Peněžní ekonomie a bankovnictví. 6., aktualiz. vyd. Praha: Management Press, 2015. ISBN9788072612796.\\par} " +
            "\\par{[3] OWENS, Mike, 2014. Definitive Guide to SQLite. 1. Berlin: Springer-Verlag Berlin and Heidelberg GmbH {\\&}Co. ISBN 9781430211662.\\par}";
     
        var items = TexUtils.ExtractEnumerateItems(input);
        items.Should().HaveCount(3);
    }

}