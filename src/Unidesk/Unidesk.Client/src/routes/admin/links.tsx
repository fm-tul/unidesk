import { User_Admin } from "@api-client/constants/UserGrants";

import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "../core";
import { PageAdministratorComponent } from "./links.pageAdministration";

export const link_admin: ExtraRouteProps = {
  path: "/admin",
  title: "Administration",
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
};

export const link_adminManageEnum: ExtraRoutePropsWithGoto = {
  path: "/admin/manage/:enumName",
  title: "Administration",
  visible: false,
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
  navigate: (enumName: string) => `/admin/manage/${enumName}`,
};
