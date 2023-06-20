import { Grants, All as GrantsAll } from "@api-client/constants/Grants";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { R, RR } from "@locales/R";
import { UserRoleDto } from "@models/UserRoleDto";
import { useContext, useState } from "react";
import { MdAdd, MdCalendarToday } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { MetadataRenderer } from "models/cellRenderers/MetadataRenderer";
import { link_settingsManageSettings } from "routes/settings/links";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { generatePrimitive, Select } from "ui/Select";
import { classnames } from "ui/shared";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { UnideskComponent } from "components/UnideskComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SelectField } from "ui/SelectField";
import { ButtonGroup } from "components/FilterBar";
import { SimpleEntityEditor } from "pages/admin/SimpleEntityEditor";
import { DepartmentDto } from "@models/DepartmentDto";
import {
  propertiesDepartmentDto,
  propertiesFacultyDto,
  propertiesSchoolYearDto,
  propertiesStudyProgrammeDto,
  propertiesThesisOutcomeDto,
  propertiesThesisTypeDto,
} from "models/dtos";
import { toKV, toKVWithCode } from "utils/transformUtils";
import { FacultyDto } from "@models/FacultyDto";
import { SchoolYearDto } from "@models/SchoolYearDto";
import { EditorPropertiesOf } from "models/typing";
import { ThesisOutcomeDto } from "@models/ThesisOutcomeDto";
import { InMemoryOptions, StudyProgrammeDto, ThesisTypeDto } from "@api-client/index";
import { ChangeTracker } from "pages/admin/ChangeTracker";
import { UserContext } from "user/UserContext";
import PageStagImport from "pages/stag-import/PageStagImport";
import { useTranslation } from "@locales/translationHooks";
import { InMemoryOptionsEditor } from "./InMemoryOptionsEditor";

interface SettingsRoute {
  name: EnKeys;
  path: string;
  component: React.FC | JSX.Element;
  grant?: string;
}

export const PageSettings = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);
  const { user: me } = useContext(UserContext);

  const { settingName: settingPath } = useParams();
  const activeSetting = settingPath !== undefined ? settingsRoutes.find(i => i.path.startsWith(settingPath)) : undefined;

  return (
    <UnideskComponent name="PageSettings">
      <div className="flex flex-wrap items-stretch gap-1">
        {/* links */}
        {settingsRoutes
          .filter(i => i.grant === undefined || me?.grantIds.some(j => j === i.grant))
          .map(i => (
            <div key={i.name}>
              <Button
                className={classnames(settingPath === i.path && "selected")}
                component={Link}
                size={activeSetting ? "sm" : "md"}
                outlined
                to={link_settingsManageSettings.navigate(i.path)}
              >
                {translate(i.name)}
              </Button>
            </div>
          ))}
      </div>

      {/* active setting, if any */}
      {activeSetting && (
        <div className="m-4">{typeof activeSetting.component === "function" ? activeSetting.component({}) : activeSetting.component}</div>
      )}
    </UnideskComponent>
  );
};

const RolesAndGrants = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const queryClient = useQueryClient();
  const saveMutation = useMutation((item: UserRoleDto) => httpClient.settings.saveRole({ requestBody: item }), {
    onSuccess: () => {
      toast.success(translate("saved"));
      queryClient.invalidateQueries("roles-and-grants");
    },
  });
  const deleteMutation = useMutation((id: string) => httpClient.settings.deleteRole({ id }), {
    onSuccess: () => {
      toast.success(translate("deleted"));
      queryClient.invalidateQueries("roles-and-grants");
      setItem(undefined);
    },
  });
  const { data } = useQuery({
    queryKey: "roles-and-grants",
    queryFn: () => httpClient.settings.getRolesAndGrants(),
  });
  const [item, setItem] = useState<UserRoleDto>();
  const renderGrant = (id: string) => GrantsAll.find(i => i.id === id)?.name;

  const GrantRenderer = (params: UserRoleDto) => {
    const { grants } = params;
    return (
      <div className="flow flex-wrap">
        {grants.length === 0 ? (
          <em>{translate("no-grants")}</em>
        ) : (
          grants.map(i => (
            <span key={i.id} className="pill">
              {renderGrant(i.id)}
            </span>
          ))
        )}
      </div>
    );
  };

  return (
    <UnideskComponent name="RolesAndGrants">
      <h1>{translate("settings.roles-and-grants")}</h1>

      <div className="flex flex-col gap-4 ">
        <Table
          clientSort
          className="no-pagination data-grid"
          selected={item?.id}
          rows={data}
          columns={[
            {
              id: "id",
              field: IdRenderer,
              headerName: "Id",
              style: { width: 90 },
            },
            {
              id: "name",
              field: "name",
              headerName: "Name",
            },
            {
              id: "description",
              field: "description",
              headerName: "Description",
            },
            {
              id: "grants",
              field: GrantRenderer,
              headerName: "Grants",
              className: "max-w-xs",
            },
            {
              id: "created",
              field: v => MetadataRenderer(v, language),
              headerName: <MdCalendarToday />,
              style: { width: 90 },
              className: "",
            },
          ]}
          onRowClick={i => setItem(i)}
          autoHeight
        />
        <div className="flex justify-end">
          <Button
            sm
            onClick={() =>
              setItem({
                id: GUID_EMPTY,
                name: "",
                description: "",
                grants: [],
              } as unknown as UserRoleDto)
            }
          >
            {RR("add-new", language)} <MdAdd className="text-base" />
          </Button>
        </div>
      </div>

      {item != null && (
        <div className="mt-4 flex items-baseline gap-1">
          <FormField as={TextField} value={item.name} label="Name" onValue={(name: string) => setItem({ ...item, name })} />
          <FormField
            as={TextField}
            value={item.description}
            label="Description"
            onValue={(description: string) => setItem({ ...item, description })}
          />
          <FormField
            classNameField="min-w-[200px] grow mr-8"
            as={SelectField<string>}
            value={item.grants.map(i => i.id)}
            options={GrantsAll.map(i => i.id)}
            getTitle={renderGrant}
            label="Grants"
            multiple
            clearable
            searchable
            onValue={(grants: string[]) => setItem({ ...item, grants: grants.map(i => GrantsAll.find(j => j.id === i)!) })}
          />
          <ButtonGroup className="ml-auto" size="sm">
            <Button success onClick={() => saveMutation.mutate(item)}>
              {item.id === GUID_EMPTY ? RR("add-new", language) : RR("update", language)}
            </Button>
            <Button error onConfirmedClick={() => deleteMutation.mutate(item.id)}>
              {RR("delete", language)}
            </Button>
          </ButtonGroup>
        </div>
      )}
    </UnideskComponent>
  );
};

const settingsRoutes: SettingsRoute[] = [
  {
    name: "settings.roles-and-grants",
    path: "roles-and-grants",
    grant: Grants.Manage_UserRoles.id,
    component: RolesAndGrants,
  },
  {
    name: "settings.departments",
    path: "departments",
    grant: Grants.Manage_Departments.id,
    component: (
      <SimpleEntityEditor
        key="departments"
        schema={propertiesDepartmentDto}
        getAll={() => httpClient.enums.departmentGetAll()}
        upsertOne={i => httpClient.enums.departmentUpsert({ requestBody: i as DepartmentDto })}
        deleteOne={id => httpClient.enums.departmentDelete({ id })}
        toKV={toKVWithCode}
      />
    ),
  },
  {
    name: "settings.faculties",
    path: "faculties",
    grant: Grants.Manage_Faculties.id,
    component: (
      <SimpleEntityEditor
        key="faculties"
        schema={propertiesFacultyDto}
        getAll={() => httpClient.enums.facultyGetAll()}
        upsertOne={i => httpClient.enums.facultyUpsert({ requestBody: i as FacultyDto })}
        deleteOne={id => httpClient.enums.facultyDelete({ id })}
        toKV={toKVWithCode}
      />
    ),
  },
  {
    name: "settings.school-years",
    path: "school-years",
    grant: Grants.Manage_SchoolYears.id,
    component: (
      <SimpleEntityEditor
        key="school-years"
        schema={propertiesSchoolYearDto as EditorPropertiesOf<SchoolYearDto>}
        getAll={() => httpClient.enums.schoolYearGetAll()}
        upsertOne={i => httpClient.enums.schoolYearUpsert({ requestBody: replaceEmptyStringWithNull(i) as SchoolYearDto })}
        deleteOne={id => httpClient.enums.schoolYearDelete({ id })}
        toKV={(i, j) => toKV(i, j, false)}
      />
    ),
  },
  {
    name: "settings.thesis-outcomes",
    path: "thesis-outcomes",
    grant: Grants.Manage_ThesisOutcomes.id,
    component: (
      <SimpleEntityEditor
        key="thesis-outcomes"
        schema={propertiesThesisOutcomeDto}
        getAll={() => httpClient.enums.thesisOutcomeGetAll()}
        upsertOne={i => httpClient.enums.thesisOutcomeUpsert({ requestBody: i as ThesisOutcomeDto })}
        deleteOne={id => httpClient.enums.thesisOutcomeDelete({ id })}
        toKV={toKV}
      />
    ),
  },
  {
    name: "settings.thesis-types",
    path: "thesis-types",
    grant: Grants.Manage_ThesisTypes.id,
    component: (
      <SimpleEntityEditor
        key="thesis-types"
        schema={propertiesThesisTypeDto}
        getAll={() => httpClient.enums.thesisTypeGetAll()}
        upsertOne={i => httpClient.enums.thesisTypeUpsert({ requestBody: i as ThesisTypeDto })}
        deleteOne={id => httpClient.enums.thesisTypeDelete({ id })}
        toKV={toKV}
      />
    ),
  },
  {
    name: "settings.study-programmes",
    path: "study-programmes",
    grant: Grants.Manage_StudyProgrammes.id,
    component: (
      <SimpleEntityEditor
        key="study-programmes"
        schema={propertiesStudyProgrammeDto}
        getAll={() => httpClient.enums.studyProgrammeGetAll()}
        upsertOne={i => httpClient.enums.studyProgrammeUpsert({ requestBody: i as StudyProgrammeDto })}
        deleteOne={id => httpClient.enums.studyProgrammeDelete({ id })}
        toKV={toKV}
      />
    ),
  },
  {
    name: "settings.change-tracker",
    path: "change-tracker",
    grant: Grants.User_SuperAdmin.id,
    component: <ChangeTracker />,
  },
  {
    name: "stag-sync",
    path: "stag-sync",
    grant: Grants.User_SuperAdmin.id,
    component: PageStagImport,
  },
  {
    name: "settings.in-memory-options",
    path: "in-memory-options",
    grant: Grants.User_SuperAdmin.id,
    component: <InMemoryOptionsEditor />,
  },
];

const replaceEmptyStringWithNull = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === "") {
      obj[key] = null;
    }
  });
  return obj;
};

export default PageSettings;
