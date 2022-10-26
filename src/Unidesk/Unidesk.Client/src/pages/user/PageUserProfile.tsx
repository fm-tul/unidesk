import { TeamDto, TeamSimpleDto, UserDto, UserFunction, UserInTeamStatus } from "@api-client";
import { All } from "@api-client/constants/UserFunction";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { castPromise, toPromiseArray, useSingleQueryDefault } from "hooks/useFetch";
import { renderTeam } from "models/cellRenderers/TeamRenderer";
import { renderUserFull } from "models/cellRenderers/UserRenderer";
import { FormField } from "ui/FormField";
import { generatePrimitive, Select } from "ui/Select";
import { classnames } from "ui/shared";
import { TextField } from "ui/TextField";
import { UserContext } from "user/UserContext";
import { Button } from "ui/Button";
import { FilterBar } from "components/FilterBar";

const userFunctionsOptions = generatePrimitive(All);
export const PageUserProfile = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { user: me } = useContext(UserContext);
  const { data: user, isLoading, error, loadData, setData } = useSingleQueryDefault<UserDto>();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const getProps = (key: keyof UserDto) => ({
    label: translate(key as any),
    value: (user![key] as string) ?? "",
    onValue: (value: string) => {
      (user as any)![key as any] = value;
      setData({ ...user! });
    },
  });

  const enterEditMode = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const idOrMe = id ?? me.id;
    loadData(httpClient.users.get({ id: idOrMe }));
  }, [id]);

  const userFunctions = user?.userFunction?.split(",").map(i => i.trim()) ?? [];
  const pendingTeams = (user?.teams ?? []).filter(i =>
    i.userTeamRoles.some(i => i.status === UserInTeamStatus.PENDING && i.userId === user?.id)
  );

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      {!!user && (
        <>
          <div className={classnames(isEditing && "animate-pulse")}>
            <h1 className="flow text-2xl font-light">
              {renderUserFull(user)}
              <MdEdit className="cursor-pointer opacity-30 hover:opacity-100" onClick={() => setIsEditing(!isEditing)} />
            </h1>
            <div className="flow">
              {user.userFunction.split(",").map(f => (
                <span key={f} className="flow rounded-full bg-gray-200 px-2 py-1">
                  <span className="text-xs">{f}</span>
                </span>
              ))}
            </div>
          </div>

          {pendingTeams.length > 0 && (
            <div>
              Team invitations
              {pendingTeams.map(i => (
                <div key={i.id} className="flow">
                  <div className="font-bold">{renderTeam(i)}</div>
                  <FilterBar type="btn-group" className="items-center" size="sm">
                    <Button
                      onClick={() => httpClient.team.changeStatus({ teamId: i.id, userId: user.id, status: UserInTeamStatus.ACCEPTED })}
                    >
                      {translate("accept")}
                    </Button>
                    <Button
                      error
                      onClick={() => httpClient.team.changeStatus({ teamId: i.id, userId: user.id, status: UserInTeamStatus.DECLINED })}
                    >
                      {translate("decline")}
                    </Button>
                  </FilterBar>
                </div>
              ))}
            </div>
          )}

          {isEditing === true && (
            <div className="flex flex-col gap-2 p-2">
              <div className="flow">
                <FormField as={TextField} {...getProps("titleBefore")} />
              </div>
              <div className="flow">
                <FormField as={TextField} {...getProps("firstName")} />
                <FormField as={TextField} {...getProps("middleName")} />
                <FormField as={TextField} {...getProps("lastName")} />
              </div>
              <div className="flow">
                <FormField as={TextField} {...getProps("titleAfter")} />
              </div>
              <div className="flow">
                <FormField
                  width="min-w-sm"
                  as={Select<string>}
                  label={translate("user-function")}
                  options={userFunctionsOptions}
                  multiple
                  value={userFunctions}
                  onMultiValue={(i: string[]) => {
                    return setData({ ...user, userFunction: i.filter(j => !!j).join(", ") as UserFunction });
                  }}
                />
              </div>
              <div className="flow">
                <FormField
                  as={Select<TeamSimpleDto>}
                  width="min-w-sm"
                  label={translate("teams")}
                  searchable
                  clearable
                  multiple
                  optionRender={renderTeam}
                  options={(keyword: string) =>
                    castPromise<TeamSimpleDto[]>(toPromiseArray(httpClient.team.find({ requestBody: { keyword } })))
                  }
                  value={user.teams}
                  onMultiValue={(teams: TeamSimpleDto[]) => setData({ ...user, teams })}
                />
              </div>
              <pre>
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
            </div>
          )}
        </>
      )}
    </LoadingWrapper>
  );
};

export default PageUserProfile;
