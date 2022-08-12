using System.ComponentModel;
using System.Reflection;
using AutoMapper;
using Unidesk.Db.Core;
using Unidesk.Db.Models;
using Unidesk.Dtos;
using Unidesk.Dtos.Resolvers;
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

        options.CreateMap<SchoolYear, SchoolYearDto>()
            .ForMember(i => i.Start, i => i.MapFrom(j => j._start))
            .ForMember(i => i.End, i => i.MapFrom(j => j._end));
        
        options.CreateMap<SchoolYearDto, SchoolYear>()
            .ForMember(i => i.Start, i => i.MapFrom(j => DateOnly.FromDateTime(j.Start)))
            .ForMember(i => i.End, i => i.MapFrom(j => DateOnly.FromDateTime(j.End)));

        options.CreateMap<User, UserDto>()
            .ForMember(i => i.Grants, i => i.MapFrom(j => j.Roles.SelectMany(k => k.Grants).Select(k => k.Id)));

        options.CreateMap<KeywordThesis, KeywordThesisDto>()
            .ForMember(i => i.Keyword, i => i.MapFrom(j => j.Keyword.Value))
            .ForMember(i => i.Locale, i => i.MapFrom(j => j.Keyword.Locale));

        options.CreateMap<Thesis, ThesisDto>()
            .ForMember(i => i.KeywordThesis, i => i.MapFrom(j => j.KeywordThesis))
            .ForMember(i => i.Guidelines, i => i.MapFrom<ThesisGuidelinesResolver>())
            .ForMember(i => i.Literature, i => i.MapFrom<ThesisLiteratureResolver>())
            .IgnoreNoMap();

        options.CreateMap<Keyword, KeywordDto>()
            .ForMember(i => i.Used, opt => opt.MapFrom(i => i.KeywordThesis.Count));

        return options;
    }

    public static IMapperConfigurationExpression CreateMapBetween<TSource, TDestination>(this IMapperConfigurationExpression options)
    {
        options.CreateMap<TSource, TDestination>()
            .AddTransform<string?>(i => i == null ? null : string.IsNullOrEmpty(i.Trim()) ? null : i);
        options.CreateMap<TDestination, TSource>()
            .AddTransform<string?>(i => i == null ? null : string.IsNullOrEmpty(i.Trim()) ? null : i);
        return options;
    }

    public static IMappingExpression<TSource, TDestination> IgnoreNoMap<TSource, TDestination>(
        this IMappingExpression<TSource, TDestination> expression)
    {
        var type = typeof(TDestination);
        var props = type.GetProperties().Where(i => i.GetCustomAttributes(typeof(IgnoreMappingAttribute)).Any());
        props.ForEach(i => expression.ForMember(i.Name, opt => opt.Ignore())).ToList();
        
        return expression;
    }
}