import { User_Admin } from "@api-client/constants/UserGrants_Grants";
import { ExtraRouteProps } from "../core";
import { PageAdministratorComponent } from "./links.pageAdministration";

export const link_admin: ExtraRouteProps = {
  path: "/admin",
  title: "Administration",
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
};

export const link_adminManageEnum: ExtraRouteProps = {
  path: "/admin/manage/:enumName",
  title: "Administration",
  visible: false,
  element: PageAdministratorComponent,
  requiredGrants: [User_Admin.id],
};
