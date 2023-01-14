import { lazy, Suspense } from "react";

const PageStagImport = lazy(() => import("../../pages/stag-import/PageStagImport"));

export const PageStagImportComponent = (
  <Suspense>
    <PageStagImport />
  </Suspense>
);
