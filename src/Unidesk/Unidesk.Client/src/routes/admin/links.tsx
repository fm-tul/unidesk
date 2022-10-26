import { User_Admin } from "@api-client/constants/UserGrants";

import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "../core";
import { PageAdministratorComponent } from "./links.pageAdministration";

export const link_admin: ExtraRouteProps = {
  path: "/admin",
  title: "link.admin",
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
};

export const link_adminManageEnum: ExtraRoutePropsWithGoto = {
  path: "/admin/manage/:enumName",
  title: "link.admin",
  visible: false,
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
  navigate: (enumName: string) => `/admin/manage/${enumName}`,
};
