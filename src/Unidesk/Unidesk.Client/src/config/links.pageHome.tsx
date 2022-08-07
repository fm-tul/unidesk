import { lazy, Suspense } from "react";

const PageHome = lazy(() => import("../pages/home/PageHome"));
export const PageHomeComponent = (
  <Suspense>
    <PageHome />
  </Suspense>
);
