using System.Text.Json;
using AutoMapper;
using Unidesk.Db.Models;

namespace Unidesk.Dtos.Resolvers;

public class ThesisGuidelinesResolver : IValueResolver<Thesis, ThesisDto, List<string>>
{
    public List<string> Resolve(Thesis source, ThesisDto destination, List<string> destMember, ResolutionContext context)
    {
        return StringListParser.Parse(source.Guidelines);
    }

}

