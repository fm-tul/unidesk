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

export const renderUserPretty = (user: UserDto) => {
    // format LASTNAME middleName? Firstname <Email>
    const { firstName, lastName, middleName, email} = user;
    return (
        <span key={user.id} className="inline-flex gap-1 items-center">
            <span>{lastName?.toUpperCase()}</span>
            {!!middleName && <span>{` ${middleName}`}</span>}
            <span>{` ${firstName}`}</span>
            {!!email && <span className="italic">{` <${email}>`}</span>}
        </span>
    )
}