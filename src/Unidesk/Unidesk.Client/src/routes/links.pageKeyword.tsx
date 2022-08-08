import { lazy, Suspense } from "react";

const PageKeywordDetail = lazy(() => import("../pages/keyword/PageKeywordDetail"));
const PageKeywordList = lazy(() => import("../pages/keyword/PageKeywordList"));

export const PageKeywordDetailComponent = (
  <Suspense>
    <PageKeywordDetail />
  </Suspense>
);

export const PageKeywordListComponent = (
  <Suspense>
    <PageKeywordList />
  </Suspense>
);
