export type UiSizes = "sm" | "md" | "lg";
export type UiColors = "info" | "success" | "warning" | "error" | "neutral";
export type UiVariants = "contained" | "outlined" | "text";

export interface HelperProps {
  helperText?: string | JSX.Element;
  helperColor?: UiColors | boolean;
  helperClassName?: string;
}

export interface SizeProps {
  // sizes, default medium
  md?: boolean;
  sm?: boolean;
  lg?: boolean;
  size?: UiSizes;
}

export interface ColorProps {
  // colors, default info
  info?: boolean;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  color?: UiColors;
}

export interface VariantProps {
  // variants, default contained
  contained?: boolean;
  outlined?: boolean;
  text?: boolean;
  variant?: UiVariants;
}

export interface SimpleComponentProps extends SizeProps {
  // extra
  loading?: boolean;
  disabled?: boolean;
  disableClass?: string;
  fullWidth?: boolean;
}

export interface ComplexComponentProps extends SizeProps, ColorProps, VariantProps {
  // extra
  loading?: boolean;
  disabled?: boolean;
  disableClass?: string;
  fullWidth?: boolean;
}

export const getSize = (props: SizeProps, def: UiSizes = "md") => {
  if (props.size) {
    return props.size;
  }
  if (props.lg) {
    return "lg";
  }
  if (props.sm) {
    return "sm";
  }
  return def;
};

export const getColor = (props: ColorProps, def: UiColors = "info") => {
  if (props.color) {
    return props.color;
  }
  if (props.success) {
    return "success";
  }
  if (props.warning) {
    return "warning";
  }
  if (props.error) {
    return "error";
  }
  return def;
};

export const getVariant = (props: ComplexComponentProps, def: UiVariants = "contained") => {
  if (props.variant) {
    return props.variant;
  }
  if (props.contained) {
    return "contained";
  }
  if (props.outlined) {
    return "outlined";
  }
  if (props.text) {
    return "text";
  }
  return def;
};

export const getStyleProps = (
  props: ComplexComponentProps,
  defaultVariant: UiVariants = "contained",
  defaultColor: UiColors = "info",
  defaultSize: UiSizes = "md"
) => ({
  color: getColor(props, defaultColor),
  variant: getVariant(props, defaultVariant),
  size: getSize(props, defaultSize),
});

export const getHelperProps = (props: HelperProps) => ({
  helperText: props.helperText,
  helperColorCss: props.helperColor === true || props.helperColor === "error" ? "text-error-600" : "",
});

export const getHelperColor = (props: HelperProps) => ({
  helperText: props.helperText,
  helperColor: (typeof props.helperColor === "boolean" ? (props.helperColor === true ? "error" : "") : props.helperColor) as
    | UiColors
    | undefined,
    helperClassName: props.helperClassName,
});

export const classnames = (...args: any[]) => {
  const classes = args.filter(Boolean).join(" ");
  return classes.length ? classes : undefined;
};
