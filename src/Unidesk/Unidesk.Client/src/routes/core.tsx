import { PathRouteProps } from "react-router-dom";

export interface ExtraRouteProps extends PathRouteProps {
  title: string;
  visible?: boolean;
  requiredGrants?: string[];
}
