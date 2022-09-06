import { User_Admin } from "@api-client/constants/UserGrants_Grants";

import { link_admin, link_adminManageEnum } from "./admin/links";
import { ExtraRouteProps } from "./core";
import { PageHomeComponent } from "./links.pageHome";
import { PageKeywordDetailComponent, PageKeywordListComponent } from "./links.pageKeyword";
import { PageStagImportComponent } from "./links.pageStagImport";
import { PageStylesComponent } from "./links.pageStyles";
import { PageThesisDetailComponent, PageThesisListComponent } from "./links.pageThesis";
import { PageUserDetailComponent, PageUserListComponent } from "./links.pageUser";

export const link_stagImport: ExtraRouteProps = {
  title: "import",
  path: "/stag-import",
  visible: true,
  element: PageStagImportComponent,
  requiredGrants: [User_Admin.id],
};

export const link_pageHome: ExtraRouteProps = {
  title: "Go Home",
  path: "/",
  visible: false,
  element: PageHomeComponent,
};

// theses
export const link_pageThesisList: ExtraRouteProps = {
  title: "Theses",
  path: "/theses",
  element: PageThesisListComponent,
};

export const link_pageThesisDetail: ExtraRouteProps = {
  title: "Thesis",
  path: "/theses/:id",
  visible: false,
  element: PageThesisDetailComponent,
};

export const link_styles: ExtraRouteProps = {
  title: "styles",
  visible: false,
  path: "/styles",
  element: PageStylesComponent,
};


// keywords
export const link_pageKeywordDetail: ExtraRouteProps = {
  title: "Keyword",
  path: "/keywords/:keywordId",
  visible: false,
  element: PageKeywordDetailComponent,
};

export const link_pageKeywordList: ExtraRouteProps = {
  title: "Keywords",
  path: "/keywords",
  element: PageKeywordListComponent,
};

// users
export const link_pageUserDetail: ExtraRouteProps = {
  title: "User",
  path: "/users/:userId",
  visible: false,
  element: PageUserDetailComponent,
};

export const link_pageUserList: ExtraRouteProps = {
  title: "User List",
  path: "/users",
  visible: true,
  element: PageUserListComponent,
};

export const links = [
  link_pageHome,
  link_stagImport,

  link_pageUserDetail,
  link_pageUserList,

  link_pageKeywordDetail,
  link_pageKeywordList,

  link_pageThesisList,
  link_pageThesisDetail,

  link_styles,

  link_admin,
  link_adminManageEnum,
];
