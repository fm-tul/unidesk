using System.Text.Json;
using AutoMapper;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.Resolvers;

public class ThesisLiteratureResolver : IValueResolver<Thesis, ThesisDto, List<string>>
{
    public List<string> Resolve(Thesis source, ThesisDto destination, List<string> destMember, ResolutionContext context)
    {
        if (string.IsNullOrEmpty(source.Literature))
        {
            return new List<string>();
        }

        return  JsonSerializer.Deserialize<List<string>>(source.Literature) ?? new List<string>();
    }
}