import { UserDto } from "@models/UserDto";

export const renderUser = (user: UserDto) => {
    const { firstName, lastName, username, middleName, stagId } = user;
    return <span key={user.id} className="inline-flex gap-1 items-center font-normal">
        <span className="text-xs">{stagId ? stagId : ""}</span>
        <>{firstName}</>
        <>{middleName ? ` ${middleName}` : ""}</>
        <span className="font-semibold">{lastName ? ` ${lastName}` : ""}</span>
        <span className="text-xs">{username ? ` (${username})` : ""}</span>
    </span>
}