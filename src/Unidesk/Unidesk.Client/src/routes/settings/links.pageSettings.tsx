import { lazy, Suspense } from "react";

const PageSettings = lazy(() => import("../../pages/settings/PageSettings"));

export const PageSettingsComponent = (
  <Suspense>
    <PageSettings />
  </Suspense>
);
