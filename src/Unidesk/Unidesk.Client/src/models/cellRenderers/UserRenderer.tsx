import { UserFunction } from "@api-client/constants/UserFunction";
import { UserLookupDto } from "@models/UserLookupDto";
import { UserSimpleDto } from "@models/UserSimpleDto";
import { UserLink } from "components/utils/UserLink";
import { IoBulbOutline, IoEaselOutline, IoSchoolOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { link_pageUserProfile } from "routes/links";
import { except } from "utils/arrays";
import { Tooltip } from "utils/Tooltip";

export const renderUser = (user: UserSimpleDto) => {
  const { firstName, lastName, username, middleName, stagId } = user;
  return (
    <span key={user.id} className="inline-flex items-center gap-1 font-normal">
      <span className="text-xs">{stagId ? stagId : ""}</span>
      <>{firstName}</>
      <>{middleName ? ` ${middleName}` : ""}</>
      <span className="font-semibold">{lastName ? ` ${lastName}` : ""}</span>
      <span className="text-xs">{username ? ` (${username})` : ""}</span>
    </span>
  );
};

export const renderUserPretty = (user: UserSimpleDto) => {
  // format LASTNAME middleName? Firstname <Email>
  const { firstName, lastName, middleName, email } = user;
  return (
    <span key={user.id} className="inline-flex items-center gap-1">
      <span>{lastName?.toUpperCase()}</span>
      {!!middleName && <span>{` ${middleName}`}</span>}
      <span>{` ${firstName}`}</span>
      {!!email && <span className="italic">{` <${email}>`}</span>}
    </span>
  );
};

export const renderUserFull = (user: UserSimpleDto) => {
  // format titleBefore LASTNAME middleName? Firstname titleAfter <Email>
  const { firstName, lastName, middleName, email, titleBefore, titleAfter } = user;
  return (
    <span key={user.id} className="inline-flex items-center gap-1">
      <span>{titleBefore}</span>
      <span>{lastName?.toUpperCase()}</span>
      {!!middleName && <span>{` ${middleName}`}</span>}
      <span>{` ${firstName}`}</span>
      <span>{titleAfter}</span>
      {!!email && <span className="italic">{` <${email}>`}</span>}
    </span>
  );
};

export const renderUserLookup = (user: UserLookupDto, withFunctions: boolean = false) => {
  const { fullName, stagId, userFunction } = user;
  const functions = except(
    (userFunction ?? "").split(",").map(i => i.trim()),
    UserFunction.None.value
  );

  return (
    <span key={user.id} className="inline-flex items-center gap-1 font-normal">
      {withFunctions && !!stagId && (
        <Tooltip content={<UserLink user={user} />}>
          <MdVerified className="text-sm" />
        </Tooltip>
      )}
      {withFunctions && functions.length > 0 && <span className="flow text-xl">{functions.map(userFunctionIconMap)}</span>}

      <>{fullName}</>
    </span>
  );
};

const userFunctionIconMap = (fuction: string) => {
  switch (fuction) {
    case UserFunction.Teacher.value:
    case UserFunction.Supervisor.value:
    case UserFunction.Opponent.value:
      return (
        <span key={fuction} title={fuction}>
          <IoBulbOutline />
        </span>
      );
    case UserFunction.Author.value:
      return (
        <span key={fuction} title={fuction}>
          <IoSchoolOutline />
        </span>
      );
  }
  return null;
};
