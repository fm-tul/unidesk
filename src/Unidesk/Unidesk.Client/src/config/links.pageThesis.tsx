import { lazy, Suspense } from "react";

const PageThesisList = lazy(() => import("../pages/thesis/PageThesisList"));

export const PageThesisListComponent = (
  <Suspense>
    <PageThesisList />
  </Suspense>
);
