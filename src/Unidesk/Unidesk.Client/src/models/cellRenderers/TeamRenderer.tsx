import { TeamLookupDto } from "@models/TeamLookupDto";

export const renderTeam = (team: TeamLookupDto) => {
  const { name, id } = team;
  return (
    <span key={id} className="inline-flex items-center gap-1">
      <span className="">{name}</span>
    </span>
  );
};
