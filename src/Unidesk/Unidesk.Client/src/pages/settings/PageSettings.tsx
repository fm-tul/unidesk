import { All as GrantsAll } from "@api-client/constants/Grants";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
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

interface SettingsRoute {
  name: EnKeys;
  path: string;
  component: React.FC;
}

export const PageSettings = () => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { settingName: settingPath } = useParams();
  const activeSetting = settingsRoutes.find(i => i.path === settingPath);

  return (
    <UnideskComponent name="PageSettings">
      <h1>Settings</h1>

      <div className="flow">
        {/* links */}
        {settingsRoutes.map(i => (
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
      {activeSetting && <activeSetting.component />}
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

  const userGrantsOtions = generatePrimitive(
    GrantsAll.map(i => i.id),
    renderGrant
  );

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
            classNameField="min-w-[200px] max-w-md"
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
          <Button className="ml-auto" success onClick={() => saveMutation.mutate(item)}>
            {item.id === GUID_EMPTY ? RR("add-new", language) : RR("update", language)}
          </Button>
        </div>
      )}
    </UnideskComponent>
  );
};

const settingsRoutes: SettingsRoute[] = [
  {
    name: "settings.roles-and-grants",
    path: "roles-and-grants",
    component: RolesAndGrants,
  },
];
export default PageSettings;
