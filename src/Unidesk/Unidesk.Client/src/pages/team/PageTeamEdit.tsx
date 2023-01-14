import { All as TeamTypeAll } from "@api-client/constants/TeamType";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { TeamDto } from "@models/TeamDto";
import { TeamType } from "@models/TeamType";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { fakePromise, toPromiseArray, useSingleQuery } from "hooks/useFetch";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { Table } from "ui/Table";
import { UserContext } from "user/UserContext";
import { UserGrants } from "@api-client/constants/UserGrants";
import { TeamRole } from "@models/TeamRole";
import { Button } from "ui/Button";
import { FilterBar } from "components/FilterBar";
import { SelectField, SelectFieldLive } from "ui/SelectField";
import { All as TeamRoleAll } from "@api-client/constants/TeamRole";
import { UserInTeamStatus } from "@models/UserInTeamStatus";
import { UserLookupDto } from "@models/UserLookupDto";
import { FaPlus } from "react-icons/fa";
import { IoAddCircle, IoAddCircleOutline, IoAddCircleSharp, IoAddSharp, IoPersonAdd } from "react-icons/io5";
import { FormField } from "ui/FormField";
import { classnames } from "ui/shared";
import { IsNew } from "utils/IsNew";
import { TeamUserLookupDto } from "@models/TeamUserLookupDto";
import { UnideskComponent } from "components/UnideskComponent";

const teamInitialValue: Partial<TeamDto> = {
  id: GUID_EMPTY,
  name: "",
  description: "",
  users: [],
  type: TeamType.TEAM,
};

const teamTypeOptions = TeamTypeAll.filter(i => i !== TeamType.UNKNOWN);
interface PageTeamNewProps {
  initialValues?: TeamDto;
}

interface TeamDetailsProps {
  team: TeamDto;
  onChange: (team: TeamDto) => void;
}
const TeamDetail = (props: TeamDetailsProps) => {
  const { user: me } = useContext(UserContext);
  const { team, onChange } = props;
  const canEdit =
    me.grantIds.includes(UserGrants.User_Admin.id) ||
    me.grantIds.includes(UserGrants.User_SuperAdmin.id) ||
    team.users.some(u => u.user.id === me.id && u.role === TeamRole.OWNER);

  return (
    <div>
      <h1 className="text-2xl font-bold">{team.name}</h1>
      <div className="text-sm italic">{team.description}</div>

      <h2 className="text-xl font-bold">Users</h2>
      <Table
        clientSort
        rows={team.users.map(i => ({ ...i, id: i.user.id }))}
        columns={[
          {
            id: "fullname",
            headerName: "User",
            field: i => <span className={classnames((i as IsNew<any>).isNew && "text-green-600")}>{renderUserLookup(i.user, true)}</span>,
            sortFunc: (a, b) => a.user.fullName.localeCompare(b.user.fullName),
          },
          {
            id: "role",
            headerName: "Role",
            field: i => i.role,
          },
          {
            id: "status",
            headerName: "Status",
            field: i => i.status,
          },
          {
            id: "actions",
            headerName: "Actions",
            visible: canEdit,
            field: teamUser => (
              <FilterBar outlined sm>
                <Button if={teamUser.status === UserInTeamStatus.ACCEPTED} error>
                  Kick
                </Button>

                <Button if={teamUser.status !== UserInTeamStatus.ACCEPTED} warning>
                  Cancel
                </Button>

                <Button if={teamUser.status === UserInTeamStatus.PENDING && teamUser.user.id === me.id} success>
                  Accept
                </Button>

                <SelectField<TeamRole>
                  value={teamUser.role}
                  options={TeamRoleAll.filter(i => i.value !== "Unknown").map(i => i.value as TeamRole)}
                  width="min-w-xxs"
                  onValue={v => {
                    teamUser.role = v[0];
                    team.users[team.users.map(i => i.user.id).indexOf(teamUser.user.id)] = teamUser;
                    onChange({ ...team });
                  }}
                />
              </FilterBar>
            ),
          },
        ]}
      />
    </div>
  );
};

export const TeamEdit = (props: PageTeamNewProps) => {
  const { initialValues } = props;
  const [dto, setDto] = useState<TeamDto>(initialValues || (teamInitialValue as TeamDto));
  const [newUser, setNewUser] = useState<UserLookupDto>();

  const addNewUser = () => {
    if (!newUser) {
      return;
    }
    dto.users.push({
      user: newUser,
      role: TeamRole.MEMBER,
      status: UserInTeamStatus.PENDING,
      isNew: true,
    } as TeamUserLookupDto);
    setDto({ ...dto });
    setNewUser(undefined);
  };

  const canAddNewUser = newUser && !dto.users.some(i => i.user.id === newUser.id);

  return (
    <div>
      <TeamDetail team={dto} onChange={setDto} />

      <div className="flow ">
        <FormField
          as={SelectFieldLive<UserLookupDto>}
          value={newUser}
          searchable
          clearable
          options={keyword => toPromiseArray(httpClient.users.find({ requestBody: { keyword, filter: { page: 1, pageSize: 10 } } }))}
          getTitle={i => renderUserLookup(i, true)}
          getValue={i => i.fullName}
          onValue={v => setNewUser(v[0])}
          width="min-w-xs"
        />
        <FormField
          as={Button}
          outlined
          onClick={addNewUser}
          disabled={!canAddNewUser}
          helperText={!canAddNewUser && !!newUser ? "User already added" : ""}
          helperColor={canAddNewUser ? "success" : "error"}
        >
          <IoPersonAdd className="text-base" />
          Invite user
        </FormField>
      </div>
    </div>
  );
  // const { language } = useContext(LanguageContext);
  // const [dto, setDto] = useState<TeamDto>((initialValues ?? teamInitialValue) as TeamDto);
  // const { data, isLoading, error, loadData } = useSingleQuery<TeamDto | undefined>(undefined);
  // const translate = (value: EnKeys) => RR(value, language);
  // const isNew = dto.id === GUID_EMPTY;

  // const getProps = (key: keyof TeamDto) => {
  //   const { errorText, errorColor } = getErrorValue(error?.errors ?? [], key.toLocaleLowerCase() as keyof TeamDto);

  //   return {
  //     helperText: errorText,
  //     helperColor: errorColor,
  //     label: translate(key as any),
  //     value: (dto![key] as string) ?? "",
  //     onValue: (value: string) => {
  //       (dto as any)![key as any] = value;
  //       setDto({ ...dto! });
  //     },
  //   };
  // };

  // const handleSave = async () => {
  //   await toast.promise(loadData(httpClient.team.upsert({ requestBody: dto })), {
  //     pending: translate("saving"),
  //     success: translate("saved"),
  //     error: translate("error-saving"),
  //   });
  // };

  // const updateUserInTeam = async (userInTeam: any, props: Partial<any>) => {
  //   // setDto({
  //   //   ...dto,
  //   //   userInTeams: dto.userInTeams.map(i => (i.id === userInTeam.id ? { ...i, ...props } : i)),
  //   // });
  // };

  // const addNewUser = (user: UserLookupDto | undefined) => {
  //   if (!user || dto.users?.some(i => i.id === user.id)) {
  //     return;
  //   }

  //   // setDto({
  //   //   ...dto,
  //   //   userInTeams: [
  //   //     ...dto.userInTeams,
  //   //     {
  //   //       id: `${user.id}_${dto.id}`,
  //   //       user,
  //   //       team: { id: dto.id, name: dto.name!, userTeamRoles: [] },
  //   //       userId: user.id,
  //   //       teamId: dto.id,
  //   //       role: dto.userInTeams.length === 0 ? TeamRole.OWNER : TeamRole.MEMBER,
  //   //       status: dto.userInTeams.length === 0 ? UserInTeamStatus.ACCEPTED : UserInTeamStatus.PENDING,
  //   //     },
  //   //   ],
  //   //   users: [...dto.users, user],
  //   // });
  // };

  // const removeUser = (user: UserInTeamDto) => {
  //   setDto({
  //     ...dto,
  //     userInTeams: dto.userInTeams.filter(i => i.id !== user.id),
  //     users: dto.users.filter(i => i.id !== user.userId),
  //   });
  // };

  // const teamRoleOptions = generatePrimitive(
  //   TeamRoleAll.map(i => i.value),
  //   i => TeamRoleAll.find(j => j.value === i)?.[language] ?? i
  // );
  // const userInTeamStatusOptions = generatePrimitive(
  //   UserInTeamStatusAll.map(i => i.value),
  //   i => UserInTeamStatusAll.find(j => j.value === i)?.[language] ?? i
  // );

  // return (
  //   <div>
  //     <h1>Team Edit</h1>
  //     <div className="flex flex-col gap-4">
  //       <div className="grid grid-cols-3 items-stretch gap-2">
  //         <FormField as={TextField} {...getProps("name")} />
  //         <FormField as={TextField} {...getProps("description")} />
  //         <FormField
  //           as={Select<string>}
  //           options={teamTypeOptions}
  //           value={dto.type}
  //           onSingleValue={(value?: string) => setDto({ ...dto, type: value as TeamType })}
  //         />
  //       </div>
  //       <div className="grid grid-cols-3 items-center gap-2">
  //         <Table
  //           className="col-span-3"
  //           rows={dto.userInTeams}
  //           columns={[
  //             { id: "id", headerName: "Id", field: i => IdRenderer({ id: i.userId }) },
  //             { id: "userId", headerName: "Name", field: i => i.user?.fullName! },
  //             {
  //               id: "role",
  //               headerName: "Role",
  //               field: i => (
  //                 <Select
  //                   sm
  //                   value={i.role!}
  //                   options={teamRoleOptions}
  //                   optionRender={i => TeamRoleAll.find(j => j.value === i)?.[language] ?? i}
  //                   onSingleValue={value => updateUserInTeam(i, { role: value as TeamRole })}
  //                 />
  //               ),
  //             },
  //             {
  //               id: "status",
  //               headerName: "Status",
  //               field: i => (
  //                 <Select
  //                   sm
  //                   value={i.status!}
  //                   options={userInTeamStatusOptions}
  //                   optionRender={i => UserInTeamStatusAll.find(j => j.value === i)?.[language] ?? i}
  //                   onSingleValue={value => updateUserInTeam(i, { status: value as UserInTeamStatus })}
  //                 />
  //               ),
  //             },
  //             {
  //               id: "actions" as any,
  //               headerName: "",
  //               field: i => (
  //                 <Button sm error outlined onClick={() => removeUser(i)}>
  //                   Remove
  //                 </Button>
  //               ),
  //             },
  //           ]}
  //         />

  //         <span className="col-span-2 items-center text-right">{translate("add-new")}</span>
  //         <FormField
  //           sm
  //           success
  //           as={Select<UserLookupDto>}
  //           classNameField="col-span-1"
  //           clearable
  //           searchable
  //           options={(keyword: string) => toPromiseArray(httpClient.users.find({ requestBody: { keyword } }))}
  //           filter={i => dto.users.some(j => j.id === i.id) === false}
  //           value={undefined}
  //           onSingleValue={value => addNewUser(value)}
  //           optionRender={renderUserLookup}
  //         />
  //       </div>
  //       <div className="grid grid-cols-3 items-stretch gap-2">
  //         <FormField as={Button} onClick={handleSave} loading={isLoading}>
  //           {isNew ? translate("create") : translate("update")}
  //         </FormField>
  //       </div>
  //     </div>
  //   </div>
  // );

  return <div>Team Edit</div>;
};

export const PageTeamEdit = () => {
  const { id } = useParams();
  const { data, isLoading, error, loadData } = useSingleQuery<TeamDto | undefined>(undefined);
  useEffect(() => {
    if (id === "new") {
      loadData(fakePromise(teamInitialValue as TeamDto));
    } else {
      loadData(httpClient.team.get({ id: id! }));
    }
  }, [id]);

  return (
    <UnideskComponent name="PageTeamEdit">
      <LoadingWrapper isLoading={isLoading} error={error}>
        {!!data && <TeamEdit initialValues={data} />}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageTeamEdit;
