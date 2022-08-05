import { lazy, Suspense } from "react";
import { PathRouteProps } from "react-router-dom";

const Styles = lazy(() => import("../demo/Styles"));
const PageHome = lazy(() => import("../pages/home/PageHome"));

const PageStagImport = lazy(() => import("../pages/stag-import/PageStagImport"));
const PageUserDetail = lazy(() => import("../pages/user/PageUserDetail"));
const PageUserList = lazy(() => import("../pages/user/PageUserList"));

const PageKeywordDetail = lazy(() => import("../pages/keyword/PageKeywordDetail"));
const PageKeywordList = lazy(() => import("../pages/keyword/PageKeywordList"));

const PageThesisList = lazy(() => import("../pages/thesis/PageThesisList"));
interface ExtraRouteProps extends PathRouteProps {
  title: string;
  visible?: boolean;
}

export const link_stagImport: ExtraRouteProps = {
  title: "import",
  path: "/stag-import",
  visible: true,
  element: (
    <Suspense>
      <PageStagImport />
    </Suspense>
  ),
};

export const link_pageHome: ExtraRouteProps = {
  title: "Go Home",
  path: "/",
  visible: false,
  element: (
    <Suspense>
      <PageHome />
    </Suspense>
  ),
};

export const link_pageUserDetail: ExtraRouteProps = {
  title: "User",
  path: "/users/:userId",
  visible: false,
  element: (
    <Suspense>
      <PageUserDetail />
    </Suspense>
  ),
};

export const link_pageUserList: ExtraRouteProps = {
  title: "User List",
  path: "/users",
  visible: true,
  element: (
    <Suspense>
      <PageUserList />
    </Suspense>
  ),
};

export const link_pageKeywordDetail: ExtraRouteProps = {
  title: "Keyword",
  path: "/keywords/:keywordId",
  visible: false,
  element: (
    <Suspense>
      <PageKeywordDetail />
    </Suspense>
  ),
};

export const link_pageKeywordList: ExtraRouteProps = {
  title: "Keywords",
  path: "/keywords",
  element: (
    <Suspense>
      <PageKeywordList />
    </Suspense>
  ),
};

export const link_pageThesisList: ExtraRouteProps = {
  title: "Theses",
  path: "/theses",
  element: (
    <Suspense>
      <PageThesisList />
    </Suspense>
  ),
};

export const link_styles: ExtraRouteProps = {
  title: "styles",
  visible: false,
  path: "/styles",
  element: (
    <Suspense>
      <Styles />
    </Suspense>
  ),
};

export const links = [
  link_pageHome,
  link_stagImport,

  link_pageUserDetail,
  link_pageUserList,

  link_pageKeywordDetail,
  link_pageKeywordList,

  link_pageThesisList,

  link_styles,
];
