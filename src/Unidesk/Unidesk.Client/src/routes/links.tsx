import { User_Admin } from "@api-client/constants/UserGrants";

import { link_admin, link_adminManageEnum } from "./admin/links";
import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "./core";
import { PageHomeComponent } from "./links.pageHome";
import { PageKeywordDetailComponent, PageKeywordListComponent } from "./links.pageKeyword";
import { PageStagImportComponent } from "./links.pageStagImport";
import { PageStylesComponent } from "./links.pageStyles";
import { PageTeamDetailComponent, PageTeamEditComponent, PageTeamListComponent } from "./links.pageTeam";
import { PageThesisDetailComponent, PageThesisEditComponent, PageThesisListComponent } from "./links.pageThesis";
import { PageUserDetailComponent, PageUserListComponent, PageUserProfileComponent } from "./links.pageUser";

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

export const link_pageThesisDetail: ExtraRoutePropsWithGoto = {
  title: "Thesis",
  path: "/theses/:id",
  visible: false,
  element: PageThesisDetailComponent,
  navigate: (id: string) => `/theses/${id}`,
};

export const link_pageThesisEdit: ExtraRoutePropsWithGoto = {
  title: "Edit Thesis",
  path: "/theses/:id/edit",
  visible: false,
  element: PageThesisEditComponent,
  navigate: (id: string) => `/theses/${id}/edit`,
};

export const link_styles: ExtraRouteProps = {
  title: "styles",
  visible: false,
  path: "/styles",
  element: PageStylesComponent,
};


// keywords
export const link_pageKeywordDetail: ExtraRoutePropsWithGoto = {
  title: "Keyword",
  path: "/keywords/:id",
  visible: false,
  element: PageKeywordDetailComponent,
  navigate: (id: string) => `/keywords/${id}`,
};

export const link_pageKeywordList: ExtraRouteProps = {
  title: "Keywords",
  path: "/keywords",
  element: PageKeywordListComponent,
};

// users
export const link_pageUserDetail: ExtraRoutePropsWithGoto = {
  title: "User",
  path: "/users/:id",
  visible: false,
  element: PageUserDetailComponent,
  navigate: (id: string) => `/users/${id}`,
};

export const link_pageMyProfile: ExtraRouteProps = {
  title: "My Profile",
  path: "/users/me",
  visible: false,
  element: PageUserProfileComponent,
};

export const link_pageUserProfile: ExtraRoutePropsWithGoto = {
  title: "User's Profile",
  path: "/users/:id/profile",
  visible: false,
  element: PageUserProfileComponent,
  navigate: (id: string) => `/users/${id}/profile`,
};

export const link_pageUserList: ExtraRouteProps = {
  title: "User List",
  path: "/users",
  visible: true,
  element: PageUserListComponent,
};

// teams
export const link_pageTeamDetail: ExtraRoutePropsWithGoto = {
  title: "Team",
  path: "/teams/:id",
  visible: false,
  element: PageTeamDetailComponent,
  navigate: (id: string) => `/teams/${id}`,
};

export const link_pageTeamList: ExtraRouteProps = {
  title: "Teams",
  path: "/teams",
  visible: true,
  element: PageTeamListComponent,
};

export const link_pageTeamEdit: ExtraRoutePropsWithGoto = {
  title: "Edit Team",
  path: "/teams/:id/edit",
  visible: false,
  element: PageTeamEditComponent,
  navigate: (id: string) => `/teams/${id}/edit`,
};

export const links = [
  link_pageHome,
  link_stagImport,

  link_pageUserDetail,
  link_pageUserList,
  link_pageMyProfile,
  link_pageUserProfile,

  link_pageKeywordDetail,
  link_pageKeywordList,

  link_pageThesisList,
  link_pageThesisDetail,
  link_pageThesisEdit,

  link_pageTeamDetail,
  link_pageTeamList,
  link_pageTeamEdit,

  link_styles,

  link_admin,
  link_adminManageEnum,
];
