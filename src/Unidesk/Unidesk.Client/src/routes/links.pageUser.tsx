import { lazy, Suspense } from "react";

const PageUserDetail = lazy(() => import("../pages/user/PageUserDetail"));
const PageUserList = lazy(() => import("../pages/user/PageUserList"));

export const PageUserDetailComponent = (
  <Suspense>
    <PageUserDetail />
  </Suspense>
);

export const PageUserListComponent = (
  <Suspense>
    <PageUserList />
  </Suspense>
);
