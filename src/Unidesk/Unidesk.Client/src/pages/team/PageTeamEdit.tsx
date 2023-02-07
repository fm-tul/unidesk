import { All as TeamTypeAll } from "@api-client/constants/TeamType";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { TeamDto } from "@models/TeamDto";
import { TeamType } from "@models/TeamType";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { fakePromise, toPromiseArray, useSingleQuery } from "hooks/useFetch";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { Table } from "ui/Table";
import { UserContext } from "user/UserContext";
import { Grants } from "@api-client/constants/Grants";
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
import { hasSomeGrant } from "utils/grants";
import { TextField } from "ui/TextField";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { Section } from "components/mui/Section";
import { RowField } from "components/mui/RowField";
import { TextArea } from "ui/TextArea";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { extractErrors, FormErrors, getPropsFactory } from "utils/forms";
import { link_pageTeamEdit, link_pageTeamList, link_pageUserProfile } from "routes/links";
import { UserInTeamStatusRenderer } from "models/itemRenderers/UserInTeamStatusRenderer";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ImageEditor } from "components/mui/ImageEditor";

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

  return (
    <div>
      <div className="text-2xl font-bold">{team.name}</div>
      <div className="text-sm italic">{team.description}</div>
    </div>
  );
};

type StatusUpdate = {
  status: UserInTeamStatus;
  userId: string;
};
export const TeamEdit = (props: PageTeamNewProps) => {
  const { initialValues } = props;
  const { language } = useContext(LanguageContext);
  const { user: me } = useContext(UserContext);
  const { translateName, translateVal, translate } = useTranslation(language);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<UserLookupDto>();
  const [errors, setErrors] = useState<FormErrors<TeamDto>>();
  const [dto, setDto] = useState<TeamDto>(initialValues || (teamInitialValue as TeamDto));

  const canAddNewUser = newUser && !dto.users.some(i => i.user.id === newUser.id);
  const canEdit =
    hasSomeGrant(me, Grants.User_Admin, Grants.User_SuperAdmin, Grants.Entity_Team_Edit) ||
    dto.users.some(u => u.user.id === me.id && u.role === TeamRole.OWNER);

  useQuery({
    queryKey: ["team", dto.id],
    queryFn: () => httpClient.team.get({ id: dto.id }),
    enabled: dto.id !== GUID_EMPTY,
    onSuccess: data => {
      setDto(data);
    },
  });

  const propsFactory = getPropsFactory(dto, setDto, errors);
  const getProps = (key: keyof TeamDto) => ({
    ...propsFactory(key),
    label: translate(key as any),
  });

  const updateTeamMutation = useMutation((dto: TeamDto) => httpClient.team.upsert({ requestBody: dto }), {
    onSuccess: data => {
      toast.success("Team saved");
      setErrors(undefined);
      if (dto.id === GUID_EMPTY) {
        navigate(link_pageTeamEdit.navigate(data.id));
        setDto(data);
      } else {
        setDto(data);
      }
    },
    onError: (e: any) => {
      setErrors(extractErrors(e));
      console.log(errors);
    },
  });

  const deleteTeamMutation = useMutation((id: string) => httpClient.team.deleteOne({ id }), {
    onSuccess: () => {
      toast.success("Team deleted");
      navigate(link_pageTeamList.path);
    },
  });

  const handleSaveClick = () => {
    updateTeamMutation.mutate(dto);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      deleteTeamMutation.mutate(dto.id);
    }
  };

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

  const changeStatusMutation = useMutation(
    (statusUpdate: StatusUpdate) => httpClient.team.changeStatus({ ...statusUpdate, teamId: dto.id }),
    {
      onSuccess: () => {
        toast.success("Status changed");
        queryClient.invalidateQueries(["team", dto.id]);
      },
    }
  );

  return (
    <div>
      {/* <TeamDetail team={dto} onChange={setDto} /> */}

      <Section title="section.team-information" />
      <div className="grid grid-cols-1">
        <RowField title="name" Field={<FormField as={TextField} {...getProps("name")} />} />
        <RowField title="description" Field={<FormField as={TextArea} {...getProps("description")} minRows={2} maxRows={5} />} />
        <RowField
          title="team.contact-email"
          Field={
            <FormField
              as={SelectField<string>}
              options={dto.users.filter(i => !!i.user.email).map(i => i.user.email!)}
              searchable
              onAddNew={v => setDto({ ...dto, email: v })}
              clearable
              onValue={v => setDto({ ...dto, email: v[0] ?? null })}
              {...getProps("email")}
            />
          }
        />
        <RowField
          title="abstract"
          Field={
            <ImageEditor
              className="max-h-sm"
              style={{ width: "100%", height: 200 }}
              value={dto.avatar}
              onValue={v => setDto({ ...dto, avatar: v })}
            />
          }
        />
      </div>

      {dto.id !== GUID_EMPTY && (
        <>
          <Section title="section.team-composition" />

          <RowField
            title="team.members"
            Field={
              <Table
                rows={dto.users.sort(sortByRole).map(i => ({ ...i, id: i.user.id }))}
                columns={[
                  {
                    id: "fullname",
                    headerName: "User",
                    className: "w-sm",
                    field: i => (
                      <div className="flex justify-between">
                        <span className={classnames((i as IsNew<any>).isNew && "text-green-600")}>{renderUserLookup(i.user, true)}</span>
                        <Button text sm component={Link} to={link_pageUserProfile.navigate(i.user.id)}>
                          go to profile
                        </Button>
                      </div>
                    ),
                    sortFunc: (a, b) => a.user.fullName.localeCompare(b.user.fullName),
                  },
                  {
                    id: "role",
                    headerName: "Role",
                    className: "w-xxs",
                    field: teamUser =>
                      canEdit ? (
                        <SelectField<TeamRole>
                          value={teamUser.role}
                          options={TeamRoleAll.filter(i => i.value !== "Unknown").map(i => i.value as TeamRole)}
                          size="sm"
                          onValue={v => {
                            teamUser.role = v[0];
                            dto.users[dto.users.map(i => i.user.id).indexOf(teamUser.user.id)] = teamUser;
                            setDto({ ...dto });
                          }}
                        />
                      ) : (
                        <span>{teamUser.role}</span>
                      ),
                  },
                  {
                    id: "status",
                    headerName: <div className="w-full text-center">Status</div>,
                    className: "w-xxs",
                    field: i => UserInTeamStatusRenderer(i.status),
                  },
                  {
                    id: "actions",
                    headerName: "Actions",
                    visible: canEdit,
                    field: teamUser => (
                      <div className="flow">
                        <FilterBar outlined sm if={(teamUser as any).isNew !== true}>
                          <Button
                            error
                            if={canEdit && teamUser.status === UserInTeamStatus.ACCEPTED}
                            onClick={i => changeStatusMutation.mutate({ userId: teamUser.id, status: UserInTeamStatus.DECLINED })}
                          >
                            {translate(teamUser.user.id === me.id ? "leave" : "decline")}
                          </Button>

                          <Button
                            warning
                            if={canEdit && teamUser.status !== UserInTeamStatus.ACCEPTED}
                            onClick={i => changeStatusMutation.mutate({ userId: teamUser.id, status: UserInTeamStatus.REMOVED })}
                          >
                            {translate("remove")}
                          </Button>

                          <Button
                            success
                            if={
                              canEdit &&
                              (teamUser.status === UserInTeamStatus.PENDING || teamUser.status === UserInTeamStatus.REMOVED) &&
                              teamUser.user.id === me.id
                            }
                            onClick={i => changeStatusMutation.mutate({ userId: teamUser.id, status: UserInTeamStatus.ACCEPTED })}
                          >
                            {translate("accept")}
                          </Button>
                        </FilterBar>
                      </div>
                    ),
                  },
                ]}
              />
            }
          />

          <RowField
            title="team.invite-new-user"
            Field={
              <div className="flow">
                <FormField
                  as={SelectFieldLive<UserLookupDto>}
                  value={newUser}
                  searchable
                  clearable
                  options={keyword =>
                    toPromiseArray(httpClient.users.find({ requestBody: { keyword, filter: { page: 1, pageSize: 10 } } }))
                  }
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
            }
          />
        </>
      )}

      <div className="flex justify-center">
        <FilterBar type="btn-group" className="mt-16" size="lg">
          <Button onClick={handleSaveClick} loading={updateTeamMutation.isLoading}>
            {translate(dto.id === GUID_EMPTY ? "create" : "update")}
          </Button>
          <Button if={canEdit && dto.id !== GUID_EMPTY} onClick={handleDeleteClick} error loading={deleteTeamMutation.isLoading}>
            {translate("delete")}
          </Button>
        </FilterBar>
      </div>
    </div>
  );
};

export const PageTeamEdit = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => (id === "new" ? fakePromise(teamInitialValue as TeamDto) : httpClient.team.get({ id: id! })),
  });

  return (
    <UnideskComponent name="PageTeamEdit">
      <LoadingWrapper isLoading={isLoading} error={error}>
        {!!data && <TeamEdit initialValues={data} />}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageTeamEdit;

const teamRolesList = Object.keys(TeamRole).map(i => TeamRole[i as keyof typeof TeamRole]);
const sortByRole = (a: TeamUserLookupDto, b: TeamUserLookupDto) => {
  const roleAInt = teamRolesList.indexOf(a.role);
  const roleBInt = teamRolesList.indexOf(b.role);
  return roleAInt - roleBInt;
};
