import { User_Admin } from "@api-client/constants/UserGrants";

import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "routes/core";

import { PageSettingsComponent } from "./links.pageSettings";

export const link_settings: ExtraRouteProps = {
  path: "/settings",
  title: "link.settings",
  element: PageSettingsComponent,
  requiredGrants: [User_Admin.id],
};


export const link_settingsManageSettings: ExtraRoutePropsWithGoto = {
  path: "/settings/manage/:settingName",
  title: "link.settings",
  element: PageSettingsComponent,
  requiredGrants: [User_Admin.id],
  visible: false,
  navigate: (settingName: string) => `/settings/manage/${settingName}`,
};
