import { LoadingButton } from "@mui/lab";
import { MouseEventHandler } from "react";

interface ButtonProps {
  texted?: boolean;
  contained?: boolean;
  outlined?: boolean;

  small?: boolean;
  medium?: boolean;
  large?: boolean;

  error?: boolean;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";

  loading?: boolean;
  position?: "start" | "end" | "center";
  icon?: React.ReactNode;

  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  label: string;
}
export const UButton = (props: ButtonProps) => {
  const { texted, outlined, small, medium, large, error, color, loading = false, icon, position = "center", onClick, label } = props;
  const size = small ? "small" : large ? "large" : "medium";
  const variant = texted ? "text" : outlined ? "outlined" : "contained";
  const _color = error ? "error" : color ? color : "primary";
  const iconProps = !icon
    ? {}
    : position === "start"
    ? { startIcon: icon, loadingPosition: position }
    : position === "end"
    ? { endIcon: icon, loadingPosition: position }
    : { startIcon: icon, loadingPosition: position };

  return (
    <LoadingButton color={_color} variant={variant} size={size} loading={loading} {...iconProps} onClick={onClick}>
      {label}
    </LoadingButton>
  );
};
