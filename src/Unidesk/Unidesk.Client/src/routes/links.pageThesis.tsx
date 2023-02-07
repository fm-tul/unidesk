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
  <Suspense key={"my-thesis"}>
    <PageThesisList myThesis />
  </Suspense>
);

export const PageThesisDetailComponent = (
  <Suspense key={"thesis-detail"}>
    <PageThesisDetail />
  </Suspense>
);

export const PageThesisEditComponent = (
  <Suspense>
    <PageThesisEdit />
  </Suspense>
);
