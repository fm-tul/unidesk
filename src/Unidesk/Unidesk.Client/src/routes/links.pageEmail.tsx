import { lazy, Suspense } from "react";

const PageEmailList = lazy(() => import("../pages/emails/PageEmailList"));


export const PageEmailListComponent = (
  <Suspense>
    <PageEmailList />
  </Suspense>
);