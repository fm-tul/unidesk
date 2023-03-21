import { lazy, Suspense } from "react";

const PageEvaluationManage = lazy(() => import("../pages/evaluations/PageEvaluationManage"));
const PageEvaluationEdit = lazy(() => import("../pages/evaluations/PageEvaluationEdit"));
const PageEvaluationView = lazy(() => import("../pages/evaluations/PageEvaluationView"));

export const PageEvaluationManageComponent = (
  <Suspense>
    <PageEvaluationManage />
  </Suspense>
);

export const PageEvaluationEditComponent = (
  <Suspense>
    <PageEvaluationEdit />
  </Suspense>
);

export const PageEvaluationViewComponent = (
  <Suspense>
    <PageEvaluationView />
  </Suspense>
);
