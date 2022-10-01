import React, { HtmlHTMLAttributes } from "react";
import { createElement, MouseEventHandler, PropsWithChildren } from "react";

import { ComplexComponentProps, getColor, getSize, getVariant } from "./shared";

interface ButtonProps extends ComplexComponentProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;

  to?: string;
  component?: React.ElementType;
  tabIndex?: number;
  title?: string;
  justify?: "justify-start" | "justify-center" | "justify-end" | "justify-between" | "justify-around";
}
export const Button = (props: PropsWithChildren<ButtonProps> & HtmlHTMLAttributes<HTMLButtonElement>) => {
  const { loading, disabled, disableClass="disabled", fullWidth = false, component, to, tabIndex, title } = props;
  const { children, onClick, className: classNameOverride="", style, justify="justify-center" } = props;

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props);

  const colorCss = COLORS[color];
  const sizeCss = SIZES[size];
  const variantCss = VARIANTS[variant];

  const loadingCss = loading ? "loading" : "";
  const disabledCss = loading || disabled ? `${disableClass} i-disabled`: "";
  const fullWidthCss = fullWidth ? "w-full" : "";
  const className = `btn ${colorCss} ${sizeCss} ${variantCss} ${disabledCss} ${fullWidthCss} ${classNameOverride} ${loadingCss}`;

  if (component) {
    return createElement(component, { className:`inline-flex ${className} ${justify}`, to, title }, children);
  }

  return (
    <button className={className} onClick={onClick} tabIndex={tabIndex} disabled={disabled} title={title} style={style}>
      <div role={"button"} className={`inline-flex items-center gap-1 relative w-full ${justify}`} >
        {children}
        {loading && <span className="spinner2"></span>}
      </div>
    </button>
  );
};

const COLORS = {
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  neutral: "btn-neutral",
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
