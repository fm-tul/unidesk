type sizes = "sm" | "md" | "lg";
type colors = "info" | "success" | "warning" | "error";
type variants = "contained" | "outlined" | "text";

export interface SizeProps {
  // sizes, default medium
  md?: boolean;
  sm?: boolean;
  lg?: boolean;
  size?: sizes;
}

export interface ColorProps {
  // colors, default info
  info?: boolean;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  color?: colors;
}

export interface VariantProps {
  // variants, default contained
  contained?: boolean;
  outlined?: boolean;
  text?: boolean;
  variant?: variants;
}

export interface SimpleComponentProps extends SizeProps {
  // extra
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface ComplexComponentProps extends SizeProps, ColorProps, VariantProps {
  // extra
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const getSize = (props: SimpleComponentProps, def: sizes = "md") => {
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

export const getColor = (props: ComplexComponentProps, def: colors = "info") => {
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

export const getVariant = (props: ComplexComponentProps, def: variants = "contained") => {
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
