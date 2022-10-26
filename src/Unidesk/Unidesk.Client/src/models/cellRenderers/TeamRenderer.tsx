import { TeamDto } from "@models/TeamDto";
import { TeamSimpleDto } from "@models/TeamSimpleDto";

export const renderTeam = (team: TeamDto | TeamSimpleDto) => {
  const { name, id } = team;
  return (
    <span key={id} className="inline-flex items-center gap-1">
      {/* <span className="text-xs">{id}</span> */}
      <span className="">{name}</span>
    </span>
  );
};
