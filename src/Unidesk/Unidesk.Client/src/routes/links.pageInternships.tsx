import { lazy, Suspense } from "react";

const PageInternshipList = lazy(() => import("../pages/internships/PageInternshipList"));
const PageInternshipDetail = lazy(() => import("../pages/internships/PageInternshipDetail"));

export const PageInternshipListComponent = (
  <Suspense>
    <PageInternshipList />
  </Suspense>
);

export const PageInternshipDetailComponent = (
  <Suspense>
    <PageInternshipDetail />
  </Suspense>
);