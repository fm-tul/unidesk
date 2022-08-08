import { lazy, Suspense } from "react";

const PageAdministrator = lazy(() => import("../../pages/admin/PageAdministrator"));
export const PageAdministratorComponent = (
  <Suspense>
    <PageAdministrator />
  </Suspense>
);
