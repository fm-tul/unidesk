using System.Linq.Expressions;
using Mapster;
using Unidesk.Db.Models;
using Unidesk.Dtos;
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
        config.ForType<Team, TeamDto>()
          .Map(i => i.Users, i => i.UserInTeams);
         
        // ignore roles
        config.ForType<UserDto, User>()
          .Ignore(dest => dest.Roles)
          .Ignore(dest => dest.Aliases);
        
        config.ForType<User, UserDto>()
           .Map(i => i.Teams, i => i.UserInTeams);


        config.ForType<Thesis, ThesisDto>()
           .Map(dto => dto.Literature, type => StringListParser.Parse(type.Literature))
           .Map(dto => dto.Guidelines, type => StringListParser.Parse(type.Guidelines))
            ;

        config.ForType<Thesis, ThesisLookupDto>()
           // ReSharper disable once InvokeAsExtensionMethod
          .Map(dto => dto.AbstractCze, type => StringExtensions.SafeSubstring(type.AbstractCze, 160))
           // ReSharper disable once InvokeAsExtensionMethod
          .Map(dto => dto.AbstractEng, type => StringExtensions.SafeSubstring(type.AbstractEng, 160));
        
        
        config.ForType<ThesisDto, Thesis>()
           .Ignore(i => i.ThesisUsers)
           .Map(dto => dto.Literature, type => StringListParser.Serialize(type.Literature))
           .Map(dto => dto.Guidelines, type => StringListParser.Serialize(type.Guidelines))
            ;

        // readonly dtos
        config.ForType<ThesisUser, ThesisLookupUserDto>();

        config.ForType<User, UserLookupDto>()
           .Map(i => i.FullName, type => type.FullName);
        

        return config;
    }
}