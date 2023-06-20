import { Grants, User_Admin } from "@api-client/constants/Grants";

import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "routes/core";

import { PageSettingsComponent } from "./links.pageSettings";

export const link_settings: ExtraRouteProps = {
  path: "/settings",
  title: "link.settings",
  element: PageSettingsComponent,
  availableToGrants: [
    Grants.User_Admin.id,
    Grants.User_SuperAdmin.id,
    Grants.Manage_Departments.id,
    Grants.Manage_Faculties.id,
    Grants.Manage_SchoolYears.id,
    Grants.Manage_ThesisOutcomes.id,
    Grants.Manage_ThesisTypes.id,
    Grants.Manage_StudyProgrammes.id,
  ],
};


export const link_settingsManageSettings: ExtraRoutePropsWithGoto = {
  path: "/settings/manage/:settingName",
  title: "link.settings",
  element: PageSettingsComponent,
  availableToGrants: [
    Grants.User_Admin.id,
    Grants.User_SuperAdmin.id,
    Grants.Manage_Departments.id,
    Grants.Manage_Faculties.id,
    Grants.Manage_SchoolYears.id,
    Grants.Manage_ThesisOutcomes.id,
    Grants.Manage_ThesisTypes.id,
    Grants.Manage_StudyProgrammes.id,
  ],
  visible: false,
  navigate: (settingName: string) => `/settings/manage/${settingName}`,
};
