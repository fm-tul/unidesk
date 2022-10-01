import { lazy, Suspense } from "react";

const PageTeamDetail = lazy(() => import("../pages/team/PageTeamDetail"));
const PageTeamList = lazy(() => import("../pages/team/PageTeamList"));
const PageTeamEdit = lazy(() => import("../pages/team/PageTeamEdit"));

export const PageTeamDetailComponent = (
  <Suspense>
    <PageTeamDetail />
  </Suspense>
);

export const PageTeamListComponent = (
  <Suspense>
    <PageTeamList />
  </Suspense>
);


export const PageTeamEditComponent = (
  <Suspense>
    <PageTeamEdit />
  </Suspense>
);