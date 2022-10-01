import { lazy, Suspense } from "react";

const PageUserDetail = lazy(() => import("../pages/user/PageUserDetail"));
const PageUserList = lazy(() => import("../pages/user/PageUserList"));
const PageUserProfile = lazy(() => import("../pages/user/PageUserProfile"));

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


export const PageUserProfileComponent = (
  <Suspense>
    <PageUserProfile />
  </Suspense>
);