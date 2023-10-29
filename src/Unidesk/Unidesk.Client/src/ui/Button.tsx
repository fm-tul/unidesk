import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import React, { HtmlHTMLAttributes, useContext } from "react";
import { createElement, MouseEventHandler, PropsWithChildren } from "react";
import { confirmDialog, ConfirmDialogOptions } from "./Confirm";

import { ComplexComponentProps, getColor, getSize, getVariant } from "./shared";

interface ButtonProps extends ComplexComponentProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirmedClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;

  to?: string;
  component?: React.ElementType;
  target?: string;
  tabIndex?: number;
  title?: string;
  justify?: "justify-start" | "justify-center" | "justify-end" | "justify-between" | "justify-around";
  if?: boolean;

  withConfirmDialog?: boolean;
  confirmDialogOptions?: ConfirmDialogOptions;
  type?: "button" | "submit" | "reset";
}
export const Button = (props: PropsWithChildren<ButtonProps> & HtmlHTMLAttributes<HTMLButtonElement>) => {
  if (props.if === false) {
    return null;
  }

  const { loading, disabled, disableClass = "disabled", fullWidth = false, component, to, tabIndex, title, target, type } = props;
  const { children, onClick, className: classNameOverride = "", style, justify = "justify-center" } = props;
  const { withConfirmDialog, confirmDialogOptions, onConfirmedClick } = props;

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props);

  const colorCss = COLORS[color];
  const sizeCss = SIZES[size];
  const variantCss = VARIANTS[variant];

  const loadingCss = loading ? "loading" : "";
  const disabledCss = loading || disabled ? `${disableClass} i-disabled` : "";
  const fullWidthCss = fullWidth ? "w-full" : "";
  const className = `btn ${colorCss} ${sizeCss} ${variantCss} ${disabledCss} ${fullWidthCss} ${classNameOverride} ${loadingCss}`;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (withConfirmDialog || onConfirmedClick) {
      const result = await confirmDialog(confirmDialogOptions);
      if (result === true) {
        onConfirmedClick?.(e);
        onClick?.(e);
      }
    } else {
      onClick?.(e);
    }
  };

  if (component) {
    return createElement(component, { className: `inline-flex ${className} ${justify}`, to, title, target }, children);
  }

  return (
    <button className={className} onClick={handleClick} tabIndex={tabIndex} disabled={disabled} title={title} style={style} type={type}>
      <div role={"button"} className={`relative inline-flex w-full items-center gap-1 ${justify}`}>
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
