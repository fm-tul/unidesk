import { TeamLookupDto } from "@models/TeamLookupDto";

export const renderTeam = (team: TeamLookupDto) => {
  const { name, id } = team;
  return (
    <span key={id} className="inline-flex items-center gap-1">
      {/* <span className="text-xs">{id}</span> */}
      <span className="">{name}</span>
    </span>
  );
};
