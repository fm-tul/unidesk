import { lazy, Suspense } from "react";

const PageThesisList = lazy(() => import("../pages/thesis/PageThesisList"));
const PageThesisDetail = lazy(() => import("../pages/thesis/PageThesisDetail"));

export const PageThesisListComponent = (
  <Suspense>
    <PageThesisList />
  </Suspense>
);

export const PageThesisDetailComponent = (
  <Suspense>
    <PageThesisDetail />
  </Suspense>
);