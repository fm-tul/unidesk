import { lazy, Suspense } from "react";

const PageThesisList = lazy(() => import("../pages/thesis/PageThesisList"));
const PageThesisDetail = lazy(() => import("../pages/thesis/PageThesisDetail"));
const PageThesisEdit = lazy(() => import("../pages/thesis/PageThesisEdit"));

export const PageThesisListComponent = (
  <Suspense>
    <PageThesisList />
  </Suspense>
);

export const PageMyThesisListComponent = (
  <Suspense>
    <PageThesisList myThesis />
  </Suspense>
);

export const PageThesisDetailComponent = (
  <Suspense>
    <PageThesisDetail />
  </Suspense>
);

export const PageThesisEditComponent = (
  <Suspense>
    <PageThesisEdit />
  </Suspense>
);
