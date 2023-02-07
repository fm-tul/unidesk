using CrypticWizard.RandomWordGenerator;

namespace Unidesk.Services;

public class WordGeneratorService
{
    private readonly WordGenerator _wg = new WordGenerator();
    private readonly Random _random = new Random();

    private readonly List<WordGenerator.PartOfSpeech> _passPhrase = new()
    {
        WordGenerator.PartOfSpeech.adv,
        WordGenerator.PartOfSpeech.adj,
        WordGenerator.PartOfSpeech.noun,
    };

    public string GeneratePassPhrase()
    {
        return $"{_wg.GetPattern(_passPhrase, '-')}-{_random.Next(1000, 9999)}";
    }
}