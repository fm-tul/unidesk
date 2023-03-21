import { UserFunction } from "@api-client/constants/UserFunction";
import { UserLookupDto } from "@models/UserLookupDto";
import { UserSimpleDto } from "@models/UserSimpleDto";
import { UserLink } from "components/utils/UserLink";
import { MdVerified } from "react-icons/md";
import { except } from "utils/arrays";
import { Tooltip } from "utils/Tooltip";
import { MdCoPresent } from "react-icons/md";
import { FaHospitalUser, FaUserGraduate, FaUserTie } from "react-icons/fa";

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

const userFunctionIconMap = (fnc: string) => {
  switch (fnc) {
    case UserFunction.Teacher.value:
      return (<span key={fnc} title={fnc}>
        <MdCoPresent className="w-6 h-6" />
      </span>);

    case UserFunction.Supervisor.value:
      return (
        <span key={fnc} title={fnc}>
          <FaUserTie className="w-5 h-5" />
        </span>
      );
    case UserFunction.Opponent.value:
      return (
        <span key={fnc} title={fnc}>
          <FaHospitalUser className="w-6 h-6" />
        </span>
      );

    case UserFunction.Author.value:
      return (
        <span key={fnc} title={fnc}>
          <FaUserGraduate className="w-5 h-5" />
        </span>
      );
  }
  return null;
};
