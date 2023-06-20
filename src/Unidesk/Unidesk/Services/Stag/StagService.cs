using System.Diagnostics;
using System.Text;
using Newtonsoft.Json;
using Unidesk.Configurations;
using Unidesk.Db.Models;
using Unidesk.Services.Stag.Models;
using Unidesk.Utils.Text;
using Microsoft.EntityFrameworkCore;
using Unidesk.Utils.Extensions;

namespace Unidesk.Services.Stag;

public class StagService
{
    // e.g.  "https://stag-ws.tul.cz/ws/services/rest2/kvalifikacniprace/getKvalifikacniPrace?rokZadani=2021&outputFormat=json&katedra=NTI";
    private const string StagUrlRoot = "https://stag-ws.tul.cz";
    // private const string UrlTemplate = StagUrlRoot + "/ws/services/rest2/kvalifikacniprace/getKvalifikacniPraceAuth?rokZadani={0}&katedra={1}&outputFormat=json";
    private const string UrlTemplate = StagUrlRoot + "/ws/services/rest2/kvalifikacniprace/getKvalifikacniPrace?rokZadani={0}&katedra={1}&outputFormat=json";
    private const string LoginUrl = StagUrlRoot + "/ws/login?originalURL=";
    private const string TestUrl = StagUrlRoot + "/ws/services/rest2/help/testService";

    private readonly AppOptions _appOptions;
    private readonly ImportService _import;
    private readonly ILogger<StagService> _logger;
    
    private string? _cookie { get; set; }
    private DateTime _cookieExpires { get; set; }

    public StagService(AppOptions appOptions, ImportService importService, ILogger<StagService> logger)
    {
        _appOptions = appOptions;
        _import = importService;
        _logger = logger;
        // _cookieExpires = DateTime.MaxValue;
        // _cookie = "WSCOOKIE=2a9f0667098307725804370eed18ac9085eee98b7e9f28aa65a877867179ea6b; Path=/ws; Secure; HttpOnly; SameSite=Lax";
    }

    private HttpClient CreateClient(bool useCookie)
    {
        var client = new HttpClient();
        // if (useCookie)
        // {
        //     client.DefaultRequestHeaders.Add("Cookie", _cookie);
        // }
        // else
        // {
        //     var username = _appOptions.StagUsername;
        //     var password = _appOptions.StagPassword;
        //     var encoded = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}"));
        //     client.DefaultRequestHeaders.Add("Authorization", $"Basic {encoded}");
        // }
        return client;
    }

    private async Task<List<KvalifikacniPrace>> LoadItems(string url, string? saveAs)
    {
        var response = await CreateClient(useCookie: true).GetAsync(url);
        var json = await response.Content.ReadAsStringAsync();
        
        var result = JsonConvert.DeserializeObject<KvalifikacniPraceList>(json)
                     ?? throw new Exception("Cannot deserialize json");

        if (saveAs != null)
        {
            await File.WriteAllTextAsync(saveAs, json);
        }

        return result.KvalifikacniPrace;
    }

    private async Task<string> GetCookieFromLoginAsync()
    {
        // cookie lasts 30 minutes
        var cookieAge = DateTime.UtcNow - _cookieExpires;
        if (_cookie is not null && cookieAge.TotalMinutes < 30)
        {
            return _cookie;
        }

        var loginUrl = LoginUrl + Uri.EscapeDataString(TestUrl) + "&basic=1";
        var response = await CreateClient(useCookie: false).GetAsync(loginUrl);
        var data = await response.Content.ReadAsStringAsync();
        var cookies = response.Headers.GetValues("Set-Cookie").ToList();
        _cookie = cookies.First();
        _cookieExpires = DateTime.UtcNow.AddMinutes(30);
        return _cookie;
    }
    
    // https://stag-ws.tul.cz/ws/services/rest2/kvalifikacniprace/getKvalifikacniPrace?rokZadani=2022&katedra=NTI&outputFormat=json&stagUser=JAN_HYBS
    // https://stag-ws.tul.cz/ws/services/rest2/kvalifikacniprace/getKvalifikacniPraceAuth?rokZadani=2022&katedra=NTI&outputFormat=json

    public async Task<List<Thesis>> ImportFromStagAsync(int year, string departmentCode)
    {
        var sw = Stopwatch.StartNew();
        await GetCookieFromLoginAsync();
        var url = string.Format(UrlTemplate, year, departmentCode);
            
        var saveAs = $"stag-{year}-{departmentCode}.json";
        var dtos = await LoadItems(url, saveAs);
        var imported = new List<Thesis>();
        _logger.LogInformation("Stag import downloaded {Count} items in {Elapsed}", dtos.Count, sw.Elapsed);
        sw.Restart();

        await LoadM2NCache();

        foreach (var dto in dtos)
        {
            imported.Add(await ImportOneAsync(dto));
        }

        var stats = _import.Db.GetStats();
        _logger.LogInformation("Import from Stag completed in {Elapsed} [{Stats}]", sw.Elapsed, stats.ToString());

        await _import.Db.SaveChangesAsync();
        _logger.LogInformation("Save changes completed in {Elapsed}", sw.Elapsed);

        sw.Stop();
        return imported;
    }

    public async Task<Thesis> ImportOneFromStagAsync(KvalifikacniPrace item)
    {
        var sw = Stopwatch.StartNew();

        await LoadM2NCache();

        var dbItem = await ImportOneAsync(item);
        var stats = _import.Db.GetStats();
        _logger.LogInformation("Import from Stag completed in {Elapsed} [{Stats}]", sw.Elapsed, stats.ToString());

        await _import.Db.SaveChangesAsync();
        _logger.LogInformation("Save changes completed in {Elapsed}", sw.Elapsed);

        sw.Stop();
        return dbItem;
    }

    private async Task LoadM2NCache()
    {
        // we build the KeywordThesis m-n table cache in order to find the relations between Keywords and Thesis
        await _import.Db.Theses.LoadCacheAsync(_import.Db.Theses.DbSet.Query());
        await _import.Db.KeywordThesis.LoadCacheAsync(_import.Db.KeywordThesis.DbSet.Query());
    }

    private async Task<Thesis> ImportOneAsync(KvalifikacniPrace dto)
    {
        var item = await _import.GetOrCreateThesis(dto.Adipidno);

        item.Department = await _import.GetOrCreateDepartment(dto.Katedra);
        item.Faculty = await _import.GetOrCreateFaculty(dto.Fakulta);

        item.NameEng = dto.TemaHlavniAn ?? "";
        item.NameCze = dto.TemaHlavni;

        item.AbstractEng = dto.VyjadreniAn;
        item.AbstractCze = dto.Vyjadreni;

        item.SchoolYear = await _import.GetOrCreateSchoolYear(dto.DatumZadani?.Year);
        item.ThesisType = await _import.GetOrCreateThesisType(dto.TypPrace);

        item.StudyProgramme = await _import.GetOrCreateStudyProgramme(dto.NazevStudProgramu);

        item.Status = _import.ParseThesisStatus(dto.StavPrace);

        item.GuidelinesList = TexUtils.ExtractEnumerateItems(dto.Zasady);
        item.LiteratureList = TexUtils.ExtractEnumerateItems(dto.SeznamLiter);
        
        item.ThesisUsers = _import.MergeUsers(item, 
            // author
            _import.GetOrCreateUserStudent(dto.Student)
                .InThesis(item, UserFunction.Author),
            // supervisor
            _import.GetOrCreateTeacher(dto.VedouciJmeno, dto.VedouciUcitidno, UserFunction.Supervisor)
                .InThesis(item, UserFunction.Supervisor),
            // opponent
            _import.GetOrCreateTeacher(dto.OponentJmeno, dto.OponentUcitidno, UserFunction.Opponent)
                .InThesis(item, UserFunction.Opponent)
        );
        
        item.KeywordThesis = await _import.GetOrCreateKeywords(item, dto.KlicSlova, dto.KlicSlovaAn);

        return item;
    }
}

public static class CallExtensions
{
    public static void SetAsync<T>(this Thesis thesis, ref T result, Func<T, Task> func)
    {
    }
}