import { lazy, Suspense } from "react";

const PageEvaluationManage = lazy(() => import("../pages/evaluations/PageEvaluationManage"));
const PageEvaluationDetail = lazy(() => import("../pages/evaluations/PageEvaluationDetail"));

export const PageEvaluationManageComponent = (
  <Suspense>
    <PageEvaluationManage />
  </Suspense>
);

export const PageEvaluationDetailComponent = (
  <Suspense>
    <PageEvaluationDetail />
  </Suspense>
);
