import { EnKeys } from "@locales/all";
import { PathRouteProps } from "react-router-dom";

export interface ExtraRouteProps extends PathRouteProps {
  title: EnKeys;
  visible?: boolean;
  requiredGrants?: string[];
  path: string;
}

export interface ExtraRoutePropsWithGoto extends ExtraRouteProps {
  navigate: (...args: any[]) => string;
}
