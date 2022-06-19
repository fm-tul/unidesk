import { lazy, Suspense } from "react";
import { PathRouteProps } from "react-router-dom";

// import { StagImport } from "../components/StagImport";
const StagImport = lazy(() => import("../components/StagImport"));

// import { Styles } from "../demo/Styles";
const Styles = lazy(() => import("../demo/Styles"));

interface ExtraRouteProps extends PathRouteProps {
    title: string;
}

export const link_stagImport: ExtraRouteProps = {
    title: "Import",
    path: "/stag-import",
    element: <Suspense><StagImport /></Suspense>
}

export const link_frontPage: ExtraRouteProps = {
    title: "Go Home",
    path: "/",
    element: <div>test</div>
}

export const link_styles: ExtraRouteProps = {
    title: "Styles",
    path: "/styles",
    element: <Suspense><Styles /></Suspense>
}

export const links = [
    link_frontPage,
    link_stagImport,
    link_styles
];
