import { User_Admin } from "@api-client/constants/Grants";

import { ExtraRoutePropsWithGoto } from "../core";
import { PageAdministratorComponent } from "./links.pageAdministration";


export const link_adminManageEnum: ExtraRoutePropsWithGoto = {
  path: "/settings/manage/:enumName",
  title: "link.admin",
  visible: false,
  element: PageAdministratorComponent,
  availableToGrants: [User_Admin.id],
  navigate: (enumName: string) => `/settings/manage/${enumName}`,
};
