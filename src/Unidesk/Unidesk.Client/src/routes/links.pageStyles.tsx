import { lazy, Suspense } from "react";

const PageStyles = lazy(() => import("../demo/Styles"));

export const PageStylesComponent = (
  <Suspense>
    <PageStyles />
  </Suspense>
);
