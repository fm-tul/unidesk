using System.ComponentModel;
using System.Reflection;
using AutoMapper;
using Unidesk.Controllers;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Resolvers;
using Unidesk.Services;
using Unidesk.Utils.Extensions;

namespace Unidesk.Server;

public static class AutoMapperConfigurationExtensions
{
    public static IMapperConfigurationExpression CreateMappingConfiguration(this IMapperConfigurationExpression options)
    {
        options.CreateMapBetween<IdEntity, IdEntityDto>();
        options.CreateMapBetween<TrackedEntity, TrackedEntityDto>();

        options.CreateMapBetween<Department, DepartmentDto>();
        options.CreateMapBetween<Faculty, FacultyDto>();
        options.CreateMapBetween<ThesisType, ThesisTypeDto>();
        options.CreateMapBetween<ThesisOutcome, ThesisOutcomeDto>();
        options.CreateMapBetween<StudyProgramme, StudyProgrammeDto>();
        
        options.CreateMapBetween<ThesisUser, ThesisUserDto>();
        
        options.CreateMapBetween<Keyword, KeywordDto>();
        options.CreateMapBetween<SimilarKeyword, SimilarKeywordDto>();

        options.CreateMapBetween<Team, TeamDto>();
        options.CreateMapBetween<User, UserDto>();
        
        options.CreateMapBetween<UserInTeam, UserInTeamDto>();
        
        options.CreateMapBetween<User, UserSimpleDto>();
        options.CreateMapBetween<Team, TeamSimpleDto>();
        
        options.CreateMapWithIgnore<SchoolYear, SchoolYearDto>()
            .ForMember(i => i.Start, i => i.MapFrom(j => j._start))
            .ForMember(i => i.End, i => i.MapFrom(j => j._end));
        
        options.CreateMapWithIgnore<SchoolYearDto, SchoolYear>()
            .ForMember(i => i.Start, i => i.MapFrom(j => DateOnly.FromDateTime(j.Start)))
            .ForMember(i => i.End, i => i.MapFrom(j => DateOnly.FromDateTime(j.End)));

        
        options.CreateMapWithIgnore<KeywordThesis, KeywordThesisDto>()
            .ForMember(i => i.Value, i => i.MapFrom(j => j.Keyword.Value))
            .ForMember(i => i.Locale, i => i.MapFrom(j => j.Keyword.Locale));

        options.CreateMapWithIgnore<Thesis, ThesisDto>();
        
        options.CreateMapWithIgnore<ThesisDto, Thesis>();
            

        return options;
    }

    private static IMappingExpression<TSource,TDestination> CreateMapWithIgnore<TSource, TDestination>(this IMapperConfigurationExpression options)
    {
        return options.CreateMap<TSource, TDestination>()
            .IgnoreNoMap();
    }

    private static IMapperConfigurationExpression CreateMapBetween<TSource, TDestination>(this IMapperConfigurationExpression options)
    {
        options.CreateMap<TSource, TDestination>()
            .AddTransform<string?>(i => i == null ? null : string.IsNullOrEmpty(i.Trim()) ? null : i)
            .IgnoreNoMap();
        
        options.CreateMap<TDestination, TSource>()
            .AddTransform<string?>(i => i == null ? null : string.IsNullOrEmpty(i.Trim()) ? null : i)
            .IgnoreNoMap();
        return options;
    }

    private static IMappingExpression<TSource, TDestination> IgnoreNoMap<TSource, TDestination>(
        this IMappingExpression<TSource, TDestination> expression)
    {
        var type = typeof(TDestination);
        var props = type.GetProperties().Where(i => i.GetCustomAttributes(typeof(IgnoreMappingAttribute)).Any());
        props.ForEach(i => expression.ForMember(i.Name, opt => opt.Ignore())).ToList();
        
        return expression;
    }
}