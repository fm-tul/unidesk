import { TeamLookupDto, TeamRole, UserDto, UserFunction, UserInTeamStatus, UserLookupDto, UserRoleDto } from "@api-client";
import { All as UserFunctionAll, UserFunction as UserFunctionMap } from "@api-client/constants/UserFunction";
import { All as UserGrantsAll } from "@api-client/constants/UserGrants";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";

import { FilterBar } from "components/FilterBar";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { castPromise, toPromiseArray, useSingleQuery, useSingleQueryDefault } from "hooks/useFetch";
import { renderTeam } from "models/cellRenderers/TeamRenderer";
import { renderUserFull, renderUserLookup } from "models/cellRenderers/UserRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { Select } from "ui/Select";
import { SelectField, SelectFieldLive } from "ui/SelectField";
import { classnames } from "ui/shared";
import { TextField } from "ui/TextField";
import { UserContext } from "user/UserContext";
import { Debug } from "components/Debug";
import { compact, except, exceptIf } from "utils/arrays";
import { toast } from "react-toastify";
import { UnideskComponent } from "components/UnideskComponent";

export const PageUserProfile = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { user: me } = useContext(UserContext);
  const { data: user, isLoading, error, loadData, setData } = useSingleQueryDefault<UserDto>();
  const { data: userRoles, loadData: loadUserRoles } = useSingleQuery<UserRoleDto[]>([]);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [aliasOptions, setAliasOptions] = useState<UserLookupDto[]>([]);

  const getProps = (key: keyof UserDto) => ({
    label: translate(key as any),
    value: (user![key] as string) ?? "",
    onValue: (value: string) => {
      (user as any)![key as any] = value;
      setData({ ...user! });
    },
  });

  const handleSave = async () => {
    const result = await httpClient.users.update({ requestBody: user! }).catch(e => {
      return null;
    });
    if (result) {
      toast.success("Saved");
      setIsEditing(false);
      setData(result);
    }
  };

  const updateUserTeams = async (teamSimple: TeamLookupDto[]) => {
    const teams = teamSimple.map(t => ({
      team: t,
      role: TeamRole.MEMBER,
      status: UserInTeamStatus.REQUESTED,
    }));

    setData({ ...user!, teams });
  };

  useEffect(() => {
    const idOrMe = id ?? me.id;
    loadData(httpClient.users.get({ id: idOrMe }));
    loadUserRoles(httpClient.enums.userRoleGetAll());
    httpClient.users
      .find({
        requestBody: {
          keyword: me.fullName,
        },
      })
      .then(i => setAliasOptions(i.items));
  }, [id]);

  const userFunctions = (user?.userFunction.split(",").map(i => i.trim()) ?? []) as UserFunction[];
  const pendingTeams = (user?.teams ?? []).filter(i => i.status === UserInTeamStatus.PENDING);

  return (
    <UnideskComponent name="PageUserProfile">
      <LoadingWrapper isLoading={isLoading} error={error}>
        {!!user && (
          <>
            <div className={classnames(isEditing && "animate-pulse")}>
              <h1 className="flow text-2xl font-light">
                {renderUserFull(user)}
                <MdEdit className="cursor-pointer opacity-30 hover:opacity-100" onClick={() => setIsEditing(!isEditing)} />
              </h1>

              {/* user functions */}
              <div className="flow">
                {user.userFunction.split(",").map(i => (
                  <span key={i} className="flow rounded-full bg-gray-200 px-2 py-1">
                    <span className="text-xs">{i}</span>
                  </span>
                ))}
              </div>

              {/* user grants */}
              <div className="flow">
                {user.grantIds.map(i => (
                  <span key={i} className="flow rounded-full bg-gray-200 px-2 py-1">
                    <span className="text-xs">{UserGrantsAll.find(j => j.id === i)?.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {pendingTeams.length > 0 && (
              <div>
                Team invitations
                {pendingTeams
                  .map(i => i.team)
                  .map(i => (
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
                    as={SelectField<UserFunction>}
                    options={Object.values(UserFunction)}
                    value={exceptIf(userFunctions, UserFunction.NONE)}
                    getTitle={i => UserFunctionAll.find(j => j.value === i)?.[language] ?? ""}
                    multiple
                    clearable
                    searchable
                    width="min-w-sm"
                    onValue={items => setData({ ...user!, userFunction: compact(items, UserFunction.NONE).join(", ") as UserFunction })}
                  />
                </div>
                <div className="flow">
                  <FormField
                    as={SelectField<UserLookupDto>}
                    value={user.aliases}
                    searchable
                    clearable
                    multiple
                    options={aliasOptions}
                    getTitle={i => renderUserLookup(i, true)}
                    getValue={i => i.fullName}
                    onValue={v => setData({ ...user, aliases: v })}
                    width="min-w-xs"
                  />
                </div>
                {/* <div className="flow">
                <FormField
                  as={Select<TeamLookupDto>}
                  width="min-w-sm"
                  label={translate("teams")}
                  searchable
                  clearable
                  multiple
                  optionRender={renderTeam}
                  options={(keyword: string) =>
                    castPromise<TeamLookupDto[]>(toPromiseArray(httpClient.team.findSimple({ requestBody: { keyword } })))
                  }
                  value={user.teams.map(i => i.team)}
                  onMultiValue={updateUserTeams}
                />
              </div>
              <div className="flow">
                <FormField
                  as={SelectFieldLive<UserRoleDto>}
                  label={translate("user-roles")}
                  width="min-w-sm"
                  searchable
                  clearable
                  multiple
                  options={() => httpClient.enums.userRoleGetAll()}
                  value={user.roles}
                  onValue={(i: UserRoleDto[]) => setData({ ...user, roles: i })}
                />
              </div> */}
                <Button onClick={handleSave}>Save</Button>
                <Debug value={user} />
              </div>
            )}
          </>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageUserProfile;
