import { TeamDto } from "@models/TeamDto";

export const renderTeam = (team: TeamDto) => {
    const { name, id } = team;
    return <span key={id} className="inline-flex gap-1 items-center font-normal">
        <span className="text-xs">{id}</span>
        <span className="font-semibold">{name}</span>
    </span>
}