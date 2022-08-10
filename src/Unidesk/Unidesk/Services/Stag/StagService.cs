using System.Diagnostics;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using Unidesk.Configurations;
using Unidesk.Db;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Services.Stag.Models;

namespace Unidesk.Services.Stag;

public class StagService
{
    // e.g.  "https://stag-ws.tul.cz/ws/services/rest2/kvalifikacniprace/getKvalifikacniPrace?rokZadani=2021&outputFormat=json&katedra=NTI";
    private const string URL_TEMPALTE =
        "https://stag-ws.tul.cz/ws/services/rest2/kvalifikacniprace/getKvalifikacniPrace?rokZadani={0}&katedra={1}&outputFormat=json";

    private readonly AppOptions _appOptions;
    private readonly ImportService _import;
    private readonly ILogger<StagService> _logger;

    public StagService(AppOptions appOptions, ImportService importService, ILogger<StagService> logger)
    {
        _appOptions = appOptions;
        _import = importService;
        _logger = logger;
    }

    private HttpClient CreateClient()
    {
        var client = new HttpClient();
        var username = _appOptions.StagUsername;
        var password = _appOptions.StagPassword;
        var encoded = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
        client.DefaultRequestHeaders.Add("Authorization", $"Basic {encoded}");
        return client;
    }

    private async Task<List<KvalifikacniPrace>> LoadItems(string url)
    {
        var response = await CreateClient().GetAsync(url);
        var json = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<KvalifikacniPraceList>(json);
        return result.KvalifikacniPrace;
    }

    public async Task<List<Thesis>> ImportFromStagAsync(int year, string departmentCode)
    {
        var sw = Stopwatch.StartNew();
        var url = string.Format(URL_TEMPALTE, year, departmentCode);
        var items = await LoadItems(url);
        var imported = new List<Thesis>();
        _logger.LogInformation("Stag import downloaded {Count} items in {Elapsed}", items.Count, sw.Elapsed);
        sw.Restart();

        // we build the KeywordThesis m-n table cache in order to find the relations between Keywords and Thesis
        await _import.Db.KeywordThesis.LoadCacheAsync();
        
        foreach (var item in items)
        {
            var dbItem = await _import.Db.Theses.FirstOrDefaultAsync(i => i.Adipidno == item.Adipidno)
                         ?? _import.Db.Theses.AddAndReturn(
                             new Thesis
                             {
                                 Adipidno = item.Adipidno,
                             });

            dbItem.Department = await _import.GetOrCreateDepartment(item.Katedra);
            dbItem.Faculty = await _import.GetOrCreateFaculty(item.Fakulta);

            dbItem.NameEng = item.TemaHlavniAn ?? "";
            dbItem.NameCze = item.TemaHlavni;

            dbItem.AbstractEng = item.VyjadreniAn;
            dbItem.AbstractCze = item.Vyjadreni;

            dbItem.SchoolYear = await _import.GetOrCreateSchoolYear(item.DatumZadani?.Year);
            dbItem.ThesisType = await _import.GetOrCreateThesisType(item.TypPrace);

            dbItem.Status = _import.ParseThesisStatus(item.StavPrace);
            var student = await _import.GetOrCreateUser(item.Student);
            if (student != null)
            {
                dbItem.Users = _import.UpdateUsersList(dbItem.Users, new List<User> { student });
            }

            dbItem.KeywordThesis = await _import.GetOrCreateKeywords(dbItem, item.KlicSlova, item.KlicSlovaAn);
            imported.Add(dbItem);
        }

        var stats = _import.Db.GetStats();
        _logger.LogInformation("Import from Stag completed in {Elapsed} [{Stats}]", sw.Elapsed, stats.ToString());

        await _import.Db.SaveChangesAsync();
        _logger.LogInformation("Save changes completed in {Elapsed}", sw.Elapsed);
        
        sw.Stop();
        return imported;
    }
}
