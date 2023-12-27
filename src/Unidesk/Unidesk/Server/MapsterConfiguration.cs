using Mapster;
using Unidesk.Db.Models;
using Unidesk.Db.Models.Internships;
using Unidesk.Dtos;
using Unidesk.Dtos.Documents;
using Unidesk.Dtos.Internships;
using Unidesk.Dtos.ReadOnly;
using Unidesk.Dtos.Resolvers;
using Unidesk.Utils.Extensions;
using DateTime = System.DateTime;

namespace Unidesk.Server;

public static class MapsterConfiguration
{
    public static TypeAdapterConfig CreateMapsterConfig()
    {
        var config = new TypeAdapterConfig();

        // concrete types
        config.ForType<DateTime, DateOnly>()
           .MapWith(src => DateOnly.FromDateTime(src));
        config.ForType<DateOnly, DateTime>()
           .MapWith(src => new DateTime(src.Year, src.Month, src.Day));

        config.ForType<DateTime, TimeOnly>()
           .MapWith(src => new TimeOnly(src.Hour, src.Minute, src.Second));
        config.ForType<TimeOnly, DateTime>()
           .MapWith(src => new DateTime(1, 1, 1, src.Hour, src.Minute, src.Second));

        config.ForType<Document, DocumentDto>()
           .Map(dto => dto.DocumentContent, src => src.DocumentContent.Content);

        // map only these 4 properties
        // config.ForType<UserInTeamDto, UserInTeam>()
        //    .BeforeMapping((src, dest) =>
        //     {
        //         src.Team = null;
        //         src.User = null;
        //     })
        //    .TwoWays();

        config.ForType<UserInTeam, UserTeamLookupDto>();
        config.ForType<UserInTeam, TeamUserLookupDto>();

        // ignore roles
        config.ForType<UserDto, User>()
           .Ignore(dest => dest.Roles)
           .Ignore(dest => dest.Aliases)
           .Ignore(dest => dest.UserInTeams);

        config.ForType<User, UserDto>()
           .Map(i => i.Teams, i => i.UserInTeams);

        config.ForType<Thesis, ThesisDto>()
           .Map(dto => dto.Literature, type => StringListParser.Parse(type.Literature))
           .Map(dto => dto.Guidelines, type => StringListParser.Parse(type.Guidelines));

        config.ForType<Thesis, ThesisLookupDto>()
            // ReSharper disable once InvokeAsExtensionMethod
           .Map(dto => dto.AbstractCze, type => StringExtensions.SafeSubstring(type.AbstractCze, 160))
            // ReSharper disable once InvokeAsExtensionMethod
           .Map(dto => dto.AbstractEng, type => StringExtensions.SafeSubstring(type.AbstractEng, 160));


        config.ForType<ThesisDto, Thesis>()
           .Ignore(i => i.ThesisUsers)
           .Ignore(i => i.KeywordThesis)
           .Ignore(i => i.Evaluations)
           .Ignore(i => i.Teams)
           .Map(dto => dto.Literature, type => StringListParser.Serialize(type.Literature))
           .Map(dto => dto.Guidelines, type => StringListParser.Serialize(type.Guidelines));

        // readonly dtos
        config.ForType<ThesisUser, ThesisLookupUserDto>();

        config.ForType<User, UserLookupDto>()
           .Map(i => i.FullName, type => type.FullName);

        config.ForType<User, UserDto>()
           .Ignore(i => i.AllThesis)
           .TwoWays();

        config.ForType<EvaluationDto, Evaluation>()
           .Ignore(i => i.Evaluator)
           .Ignore(i => i.Thesis);

        config.ForType<EvaluationDetailDto, Evaluation>()
           .Ignore(i => i.Evaluator)
           .Ignore(i => i.Thesis);

        config.ForType<Team, TeamDto>()
           .Map(i => i.Users, i => i.UserInTeams);

        config.ForType<TeamDto, Team>()
           .Ignore(i => i.Users)
           .Ignore(i => i.UserInTeams)
           .Ignore(i => i.ProfileImage)
           .Ignore(i => i.ProfileImageId);


        config.ForType<InternshipDto, Internship>()
           .Ignore(i => i.KeywordInternship)
           .Ignore(i => i.Evaluations)
           .Ignore(i => i.Student);

        config.ForType<Internship, InternshipDto>()
           .AfterMapping((src, dest) => dest.SchoolYear = src.SchoolYear?.Name);

        return config;
    }
}