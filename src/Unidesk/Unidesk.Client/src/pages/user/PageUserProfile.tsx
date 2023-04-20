import { TeamLookupDto, TeamRole, UserDto, UserFunction, UserInTeamStatus, UserLookupDto } from "@api-client";
import { All as UserFunctionAll } from "@api-client/constants/UserFunction";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import { FilterBar } from "components/FilterBar";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { renderTeam } from "models/cellRenderers/TeamRenderer";
import { renderUserFull, renderUserLookup } from "models/cellRenderers/UserRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { classnames } from "ui/shared";
import { TextField } from "ui/TextField";
import { UserContext } from "user/UserContext";
import { Debug } from "components/Debug";
import { compact, exceptIf } from "utils/arrays";
import { toast } from "react-toastify";
import { UnideskComponent } from "components/UnideskComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Grants, GrantsAll } from "@api-client/constants/Grants";
import { Section } from "components/mui/Section";
import { hasSomeGrant } from "utils/grants";
import { RowField } from "components/mui/RowField";
import { EnumsContext } from "models/EnumsContext";
import { Table } from "ui/Table";
import { link_pageTeamDetail } from "routes/links";
import { Collapse } from "components/mui/Collapse";
import { UserInTeamStatusRenderer } from "models/itemRenderers/UserInTeamStatusRenderer";
import { Confirm, confirmDialog } from "ui/Confirm";

type StatusUpdate = {
  status: UserInTeamStatus;
  teamId: string;
};
export const PageUserProfile = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);
  const { enums } = useContext(EnumsContext);

  const { user: me } = useContext(UserContext);
  const { id } = useParams();
  const [user, setUser] = useState<UserDto | null>(null);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["user", id ?? me.id],
    queryFn: () => httpClient.users.get({ id: id ?? me.id }),
    onSuccess: setUser,
  });

  const { data: aliases } = useQuery({
    queryKey: ["user", "aliases", user?.id],
    queryFn: () =>
      httpClient.users.find({
        requestBody: {
          keyword: user!.fullName,
          includeHidden: true,
        },
      }),
    enabled: !!user,
  });

  const [isEditing, setIsEditing] = useState(false);

  const getProps = (key: keyof UserDto) => ({
    label: translate(key as any),
    value: (user![key] as string) ?? "",
    onValue: (value: string) => {
      (user as any)![key as any] = value;
      setUser({ ...user! });
    },
  });

  const handleSave = async () => {
    const userWithoutTheses = { ...user! };
    userWithoutTheses.allThesis = [];
    const result = await httpClient.users.update({ requestBody: userWithoutTheses }).catch(e => {
      return null;
    });
    if (result) {
      toast.success("Saved");
      setIsEditing(false);
      setUser(result);
    }
  };

  const updateUserTeams = async (teamSimple: TeamLookupDto[]) => {
    const teams = teamSimple.map(t => ({
      team: t,
      role: TeamRole.MEMBER,
      status: UserInTeamStatus.REQUESTED,
    }));

    setUser({ ...user!, teams });
  };

  const userFunctions = (user?.userFunction.split(",").map(i => i.trim()) ?? []) as UserFunction[];
  const userTeams = user?.teams ?? [];
  const hasAccessToRoles = hasSomeGrant(me, Grants.User_Admin, Grants.User_SuperAdmin, Grants.Action_ManageRolesAndGrants);
  const isSuperAdminOrIsMe = hasSomeGrant(me, Grants.User_SuperAdmin) || me.id === user?.id;

  const changeStatusMutation = useMutation(
    (statusUpdate: StatusUpdate) => httpClient.team.changeStatus({ ...statusUpdate, userId: user!.id }),
    {
      onSuccess: () => {
        toast.success("Status changed");
        queryClient.invalidateQueries(["user", id ?? me.id]);
      },
      onError: (e: any) => {
        toast.error("Error");
      },
    }
  );

  return (
    <UnideskComponent name="PageUserProfile">
      <LoadingWrapper isLoading={isLoading}>
        {!!user && (
          <>
            <div className={classnames(isEditing && "animate-pulse")}>
              <h1 className="flow text-2xl font-light">
                {renderUserFull(user)}
                <MdEdit className="cursor-pointer opacity-30 hover:opacity-100" onClick={() => setIsEditing(!isEditing)} />
              </h1>

              {/* user functions */}
              <div className="flow flex-wrap">
                {user.userFunction.split(",").map(i => (
                  <span key={i} className="flow rounded-full bg-gray-200 px-2 py-1">
                    <span className="text-xs">{i}</span>
                  </span>
                ))}
              </div>

              {/* user grants */}
              <div className="flow flex-wrap">
                {user.grantIds.map(i => (
                  <span key={i} className="flow rounded-full bg-gray-200 px-2 py-1">
                    <span className="text-xs">{GrantsAll.find(j => j.id === i)?.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <Section title="section.teams-and-groups" />
            <RowField
              title={"section.teams"}
              description={"help.teams"}
              Field={
                <Table
                  EmptyContent={<div className="text-center italic text-gray-600">-- {translate("no-teams")} --</div>}
                  rows={userTeams}
                  fullWidth={false}
                  columns={[
                    {
                      id: "team",
                      headerName: translate("team-name"),
                      className: "w-xs",
                      field: i => (
                        <div className="flex justify-between">
                          <div className="font-bold">{renderTeam(i.team)}</div>
                          <Button text sm component={Link} to={link_pageTeamDetail.navigate(i.team.id)}>
                            go to profile
                          </Button>
                        </div>
                      ),
                    },
                    {
                      id: "status",
                      headerName: <div className="w-full text-center">Status</div>,
                      className: "w-xxs",
                      field: i => UserInTeamStatusRenderer(i.status),
                    },
                    {
                      id: "role",
                      headerName: translate("team-role"),
                      field: i => i.role,
                    },
                    {
                      id: "actions",
                      headerName: translate("actions"),
                      field: i => (
                        <FilterBar type="btn-group" outlined sm>
                          <Button
                            if={i.status == UserInTeamStatus.PENDING}
                            disabled={!isSuperAdminOrIsMe}
                            onClick={() => changeStatusMutation.mutate({ teamId: i.team.id, status: UserInTeamStatus.ACCEPTED })}
                          >
                            {translate("accept")}
                          </Button>
                          <Button
                            if={i.status == UserInTeamStatus.PENDING || i.status == UserInTeamStatus.ACCEPTED}
                            error
                            disabled={!isSuperAdminOrIsMe}
                            onConfirmedClick={() => changeStatusMutation.mutate({ teamId: i.team.id, status: UserInTeamStatus.DECLINED })}
                          >
                            {translate(i.status == UserInTeamStatus.PENDING ? "decline" : "leave")}
                          </Button>
                        </FilterBar>
                      ),
                    },
                  ]}
                />
              }
            />

            <Collapse open={isEditing} className="flex flex-col gap-2">
              <Section title="section.personal-information" />

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
                <FormField as={TextField} {...getProps("email")} />
              </div>

              <Section title="section.functions-and-aliases" />
              <RowField
                title="user-function"
                description="help.user-function"
                Field={
                  <FormField
                    as={SelectField<UserFunction>}
                    options={Object.values(UserFunction)}
                    value={exceptIf(userFunctions, UserFunction.NONE)}
                    getTitle={i => UserFunctionAll.find(j => j.value === i)?.[language] ?? ""}
                    multiple
                    clearable
                    searchable
                    onValue={items => setUser({ ...user!, userFunction: compact(items, UserFunction.NONE).join(", ") as UserFunction })}
                  />
                }
              />
              <RowField
                title="user-aliases"
                description="help.user-aliases"
                Field={
                  <FormField
                    as={SelectField<UserLookupDto>}
                    value={user.aliases}
                    searchable
                    clearable
                    multiple
                    options={aliases?.items ?? []}
                    getTitle={i => renderUserLookup(i, true)}
                    getValue={i => i.fullName}
                    onValue={v => setUser({ ...user, aliases: v })}
                  />
                }
              />

              {hasAccessToRoles && (
                <>
                  <Section title="section.roles-and-grants" />
                  <RowField
                    title="user-roles"
                    description="help.user-roles"
                    Field={
                      <div>
                        {enums.roles.map(i => (
                          <div key={i.id} className="grid grid-cols-2 rounded p-2 transition-colors hocus:bg-black/5">
                            <div className="flex items-stretch gap-2">
                              <div className="inline-flex cursor-pointer items-start">
                                <input
                                  id={i.id}
                                  type="checkbox"
                                  className="h-5 w-5"
                                  checked={user.roles.some(j => j.id === i.id)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setUser({ ...user, roles: [...user.roles, i] });
                                    } else {
                                      setUser({ ...user, roles: user.roles.filter(j => j.id !== i.id) });
                                    }
                                  }}
                                />
                              </div>
                              <label className="inline-flex w-full cursor-pointer items-start" htmlFor={i.id}>
                                <span>{i.name}</span>
                              </label>
                            </div>
                            <div className="text-xs">
                              {i.grants.map(j => (
                                <div key={j.id}>
                                  <span>{j.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  />
                </>
              )}
              <Button onClick={handleSave}>Save</Button>
              <Debug value={user} />
            </Collapse>
          </>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageUserProfile;
