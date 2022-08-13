import React from "react";
import { createElement, MouseEventHandler, PropsWithChildren } from "react";
import { ComplexComponentProps, getColor, getSize, getVariant } from "./shared";

interface ButtonProps extends ComplexComponentProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;

  to?: string;
  component?: React.ElementType;
}
export const Button = (props: PropsWithChildren<ButtonProps>) => {
  const { loading, disabled, fullWidth = false, component, to } = props;
  const { children, onClick, className: classNameOverride } = props;

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props);

  const colorCss = COLORS[color];
  const sizeCss = SIZES[size];
  const variantCss = VARIANTS[variant];

  const loadingCss = loading ? "loading" : "";
  const disabledCss = loading || disabled ? "disabled" : "";
  const fullWidthCss = fullWidth ? "w-full" : "";
  const className = `btn ${colorCss} ${sizeCss} ${variantCss} ${disabledCss} ${fullWidthCss} ${classNameOverride} ${loadingCss}`;

  if (component) {
    return createElement(component, { className, to }, children);
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
      {loading && <span className="spinner2"></span>}
    </button>
  );
};

const COLORS = {
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
};

const VARIANTS = {
  outlined: "btn-outlined",
  text: "btn-text",
  contained: "btn-contained",
};

const SIZES = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};
