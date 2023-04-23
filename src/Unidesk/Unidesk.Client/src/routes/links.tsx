import { User_Admin, User_SuperAdmin, Internship_Manage } from "@api-client/constants/Grants";

import { link_admin, link_adminManageEnum } from "./admin/links";
import { PageStagImportComponent } from "./admin/links.pageStagImport";
import { ExtraRouteProps, ExtraRoutePropsWithGoto } from "./core";
import { PageEvaluationManageComponent, PageEvaluationEditComponent, PageEvaluationViewComponent } from "./links.pageEvaluation";
import { PageHomeComponent } from "./links.pageHome";
import { PageInternshipDetailComponent, PageInternshipListComponent } from "./links.pageInternships";
import { PageKeywordDetailComponent, PageKeywordListComponent } from "./links.pageKeyword";
import { PageStylesComponent } from "./links.pageStyles";
import { PageTeamDetailComponent, PageTeamEditComponent, PageTeamListComponent } from "./links.pageTeam";
import { PageMyThesisListComponent, PageThesisDetailComponent, PageThesisEditComponent, PageThesisListComponent } from "./links.pageThesis";
import { PageUserDetailComponent, PageUserListComponent, PageUserProfileComponent } from "./links.pageUser";
import { link_settings, link_settingsManageSettings } from "./settings/links";

export const link_stagImport: ExtraRouteProps = {
  title: "link.import",
  path: "/admin/stag-import",
  visible: false,
  element: PageStagImportComponent,
  requiredGrants: [User_Admin.id],
};

export const link_pageHome: ExtraRouteProps = {
  title: "link.go-home",
  path: "/",
  visible: false,
  element: PageHomeComponent,
};

// theses
export const link_pageThesisList: ExtraRouteProps = {
  title: "link.theses",
  path: "/theses",
  element: PageThesisListComponent,
};

export const link_pageThesisDetail: ExtraRoutePropsWithGoto = {
  title: "link.thesis",
  path: "/theses/:id",
  visible: false,
  element: PageThesisDetailComponent,
  navigate: (id: string) => `/theses/${id}`,
};

export const link_pageMyThesisList: ExtraRouteProps = {
  title: "link.my-theses",
  path: "/my-theses",
  element: PageMyThesisListComponent,
};

export const link_pageThesisEdit: ExtraRoutePropsWithGoto = {
  title: "link.edit-thesis",
  path: "/theses/:id/edit",
  visible: false,
  element: PageThesisEditComponent,
  navigate: (id: string) => `/theses/${id}/edit`,
};
export const link_pageThesisCreate: ExtraRouteProps = {
  title: "link.create-thesis",
  path: "/theses/new",
  visible: false,
  element: PageThesisEditComponent,
};

export const link_styles: ExtraRouteProps = {
  title: "link.styles",
  visible: false,
  path: "/styles",
  element: PageStylesComponent,
  requiredGrants: [], // User_SuperAdmin.id
};

// keywords
export const link_pageKeywordDetail: ExtraRoutePropsWithGoto = {
  title: "link.keyword",
  path: "/keywords/:id",
  visible: false,
  element: PageKeywordDetailComponent,
  navigate: (id: string) => `/keywords/${id}`,
};

export const link_pageKeywordList: ExtraRouteProps = {
  title: "link.keywords",
  path: "/keywords",
  element: PageKeywordListComponent,
};

// users
export const link_pageUserDetail: ExtraRoutePropsWithGoto = {
  title: "link.user",
  path: "/users/:id",
  visible: false,
  element: PageUserDetailComponent,
  navigate: (id: string) => `/users/${id}`,
};

export const link_pageMyProfile: ExtraRouteProps = {
  title: "link.my-profile",
  path: "/users/me",
  visible: false,
  element: PageUserProfileComponent,
};

export const link_pageUserProfile: ExtraRoutePropsWithGoto = {
  title: "link.user-profile",
  path: "/users/:id/profile",
  visible: false,
  element: PageUserProfileComponent,
  navigate: (id: string) => `/users/${id}/profile`,
};

export const link_pageUserList: ExtraRouteProps = {
  title: "link.users",
  path: "/users",
  visible: true,
  element: PageUserListComponent,
  requiredGrants: [User_Admin.id, User_SuperAdmin.id],
};

// teams
export const link_pageTeamDetail: ExtraRoutePropsWithGoto = {
  title: "link.team",
  path: "/teams/:id",
  visible: false,
  element: PageTeamDetailComponent,
  navigate: (id: string) => `/teams/${id}`,
};

export const link_pageTeamList: ExtraRouteProps = {
  title: "link.teams",
  path: "/teams",
  visible: true,
  element: PageTeamListComponent,
};

export const link_pageTeamEdit: ExtraRoutePropsWithGoto = {
  title: "link.edit-team",
  path: "/teams/:id/edit",
  visible: false,
  element: PageTeamEditComponent,
  navigate: (id: string) => `/teams/${id}/edit`,
};

export const link_pageEvaluationManage: ExtraRoutePropsWithGoto = {
  title: "link.evaluation-edit",
  path: "/evaluations/:id",
  visible: false,
  element: PageEvaluationManageComponent,
  navigate: (id: string) => `/evaluations/${id}`,
  allowAnonymous: true,
};

export const link_pageEvaluationEdit: ExtraRoutePropsWithGoto = {
  title: "link.evaluation-detail",
  path: "/evaluation/:id",
  visible: false,
  element: PageEvaluationEditComponent,
  navigate: (id: string) => `/evaluation/${id}`,
  allowAnonymous: true,
};

export const link_pageEvaluationView: ExtraRoutePropsWithGoto = {
  title: "link.evaluation-detail",
  path: "/evaluation/:id/view",
  visible: false,
  element: PageEvaluationViewComponent,
  navigate: (id: string) => `/evaluation/${id}/view`,
  allowAnonymous: false,
};

// internships
export const link_pageInternshipList: ExtraRouteProps = {
  title: "link.internships",
  path: "/internships",
  visible: true,
  element: PageInternshipListComponent,
};

export const link_pageInternshipDetail: ExtraRoutePropsWithGoto = {
  title: "link.internship",
  path: "/internships/:id",
  visible: false,
  element: PageInternshipDetailComponent,
  navigate: (id: string) => `/internships/${id}`,
};

export const links = [
  link_pageHome,
  link_stagImport,

  link_pageUserDetail,
  link_pageUserList,
  link_pageMyProfile,
  link_pageUserProfile,

  // link_pageKeywordDetail,
  // link_pageKeywordList,

  // link_pageThesisList,
  // link_pageMyThesisList,
  // link_pageThesisDetail,
  // link_pageThesisEdit,
  // link_pageThesisCreate,

  // link_pageTeamDetail,
  // link_pageTeamList,
  // link_pageTeamEdit,

  // link_styles,

  link_admin,
  link_adminManageEnum,

  link_settings,
  link_settingsManageSettings,

  // link_pageEvaluationManage,
  // link_pageEvaluationEdit,
  // link_pageEvaluationView,

  // internships
  link_pageInternshipList,
  link_pageInternshipDetail,
];
