import { All as TeamRoleAll } from "@api-client/constants/TeamRole";
import { All as TeamTypeAll } from "@api-client/constants/TeamType";
import { All as UserInTeamStatusAll } from "@api-client/constants/UserInTeamStatus";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { TeamDto } from "@models/TeamDto";
import { TeamRole } from "@models/TeamRole";
import { TeamType } from "@models/TeamType";
import { UserDto } from "@models/UserDto";
import { UserInTeamDto } from "@models/UserInTeamDto";
import { UserInTeamStatus } from "@models/UserInTeamStatus";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { fakePromise, toPromiseArray, useSingleQuery } from "hooks/useFetch";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { renderUser } from "models/cellRenderers/UserRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { generatePrimitive, Select } from "ui/Select";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { addId } from "utils/arrays";
import { getErrorValue } from "utils/forms";

const teamInitialValue: Partial<TeamDto> = {
  id: GUID_EMPTY,
  name: "",
  description: "",
  users: [],
  userInTeams: [],
  type: TeamType.TEAM,
};

const teamTypeOptions = generatePrimitive(TeamTypeAll.filter(i => i !== TeamType.UNKNOWN));
interface PageTeamNewProps {
  initialValues?: TeamDto;
}

export const TeamEdit = (props: PageTeamNewProps) => {
  const { initialValues } = props;
  const { language } = useContext(LanguageContext);
  const [dto, setDto] = useState<TeamDto>((initialValues ?? teamInitialValue) as TeamDto);
  const { data, isLoading, error, loadData } = useSingleQuery<TeamDto | undefined>(undefined);
  const translate = (value: EnKeys) => RR(value, language);
  const isNew = dto.id === GUID_EMPTY;

  const getProps = (key: keyof TeamDto) => {
    const { errorText, errorColor } = getErrorValue(error?.errors ?? [], key.toLocaleLowerCase() as keyof TeamDto);

    return {
      helperText: errorText,
      helperColor: errorColor,
      label: translate(key as any),
      value: (dto![key] as string) ?? "",
      onValue: (value: string) => {
        (dto as any)![key as any] = value;
        setDto({ ...dto! });
      },
    };
  };

  const handleSave = async () => {
    await toast.promise(loadData(httpClient.team.upsert({ requestBody: dto })), {
      pending: translate("saving"),
      success: translate("saved"),
      error: translate("error-saving"),
    });
  };

  const updateUserInTeam = async (userInTeam: UserInTeamDto, props: Partial<UserInTeamDto>) => {
    setDto({
      ...dto,
      userInTeams: dto.userInTeams.map(i => (i.id === userInTeam.id ? { ...i, ...props } : i)),
    });
  };

  const addNewUser = (user: UserDto | undefined) => {
    if (!user || dto.users?.some(i => i.id === user.id)) {
      return;
    }

    setDto({
      ...dto,
      userInTeams: [
        ...dto.userInTeams,
        {
          id: `${user.id}_${dto.id}`,
          user,
          team: { id: dto.id, name: dto.name!, userTeamRoles: [] },
          userId: user.id,
          teamId: dto.id,
          role: dto.userInTeams.length === 0 ? TeamRole.OWNER : TeamRole.MEMBER,
          status: dto.userInTeams.length === 0 ? UserInTeamStatus.ACCEPTED : UserInTeamStatus.PENDING,
        },
      ],
      users: [...dto.users, user],
    });
  };

  const removeUser = (user: UserInTeamDto) => {
    setDto({
      ...dto,
      userInTeams: dto.userInTeams.filter(i => i.id !== user.id),
      users: dto.users.filter(i => i.id !== user.userId),
    });
  };

  const teamRoleOptions = generatePrimitive(
    TeamRoleAll.map(i => i.value),
    i => TeamRoleAll.find(j => j.value === i)?.[language] ?? i
  );
  const userInTeamStatusOptions = generatePrimitive(
    UserInTeamStatusAll.map(i => i.value),
    i => UserInTeamStatusAll.find(j => j.value === i)?.[language] ?? i
  );

  return (
    <div>
      <h1>Team Edit</h1>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 items-stretch gap-2">
          <FormField as={TextField} {...getProps("name")} />
          <FormField as={TextField} {...getProps("description")} />
          <FormField
            as={Select<string>}
            options={teamTypeOptions}
            value={dto.type}
            onSingleValue={(value?: string) => setDto({ ...dto, type: value as TeamType })}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          <Table
            className="col-span-3"
            rows={dto.userInTeams}
            columns={[
              { id: "id", headerName: "Id", field: i => IdRenderer({ id: i.userId }) },
              { id: "userId", headerName: "Name", field: i => i.user?.fullName! },
              {
                id: "role",
                headerName: "Role",
                field: i => (
                  <Select
                    sm
                    value={i.role!}
                    options={teamRoleOptions}
                    optionRender={i => TeamRoleAll.find(j => j.value === i)?.[language] ?? i}
                    onSingleValue={value => updateUserInTeam(i, { role: value as TeamRole })}
                  />
                ),
              },
              {
                id: "status",
                headerName: "Status",
                field: i => (
                  <Select
                    sm
                    value={i.status!}
                    options={userInTeamStatusOptions}
                    optionRender={i => UserInTeamStatusAll.find(j => j.value === i)?.[language] ?? i}
                    onSingleValue={value => updateUserInTeam(i, { status: value as UserInTeamStatus })}
                  />
                ),
              },
              {
                id: "actions" as any,
                headerName: "",
                field: i => (
                  <Button sm error outlined onClick={() => removeUser(i)}>
                    Remove
                  </Button>
                ),
              },
            ]}
          />

          <span className="col-span-2 items-center text-right">{translate("add-new")}</span>
          <FormField
            sm
            success
            as={Select<UserDto>}
            classNameField="col-span-1"
            clearable
            searchable
            options={(keyword: string) => toPromiseArray(httpClient.users.find({ requestBody: { keyword } }))}
            filter={(i: UserDto) => dto.users.some(j => j.id === i.id) === false}
            value={undefined}
            onSingleValue={(value?: UserDto) => addNewUser(value)}
            optionRender={renderUser}
          />
        </div>
        <div className="grid grid-cols-3 items-stretch gap-2">
          <FormField as={Button} onClick={handleSave} loading={isLoading}>
            {isNew ? translate("create") : translate("update")}
          </FormField>
        </div>
        <pre>{JSON.stringify(dto, null, 2)}</pre>
      </div>
    </div>
  );
};

export const PageTeamEdit = () => {
  const { id } = useParams();
  const { data, isLoading, error, loadData } = useSingleQuery<TeamDto | undefined>(undefined);
  useEffect(() => {
    if (id === "new") {
      loadData(fakePromise(teamInitialValue as TeamDto));
    } else {
      loadData(httpClient.team.getOne({ id }));
    }
  }, [id]);

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      {!!data && <TeamEdit initialValues={data} />}
    </LoadingWrapper>
  );
};

export default PageTeamEdit;
