namespace Unidesk.Dtos;


public class TeamDto : TrackedEntityDto
{
    public List<UserInTeamDto> UserInTeams { get; set; }

    public string Name { get; set; }
    public string Description { get; set; }
    public string Avatar { get; set; }
}