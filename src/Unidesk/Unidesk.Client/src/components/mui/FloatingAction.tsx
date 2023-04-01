import { createElement, CSSProperties, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaPlus } from "react-icons/fa";
import { classnames, ColorProps, getColor, getSize, SizeProps } from "ui/shared";
import { Tooltip } from "utils/Tooltip";

interface FloatingActionProps extends ColorProps, SizeProps {
  fixed?: boolean;
  component?: React.ElementType;
  to?: string;
  tooltip?: string | JSX.Element;
  icon?: React.ReactNode;
  onClick?: () => void;
}
export const FloatingAction = (props: FloatingActionProps) => {
  const { fixed = true, component, to, onClick, icon, tooltip="..." } = props;
  const colorCss = COLORS[getColor(props, "info")];
  const sizeCss = SIZES[getSize(props, "md")];
  const className = classnames("rounded-full shadow-lg transition-none", colorCss, sizeCss);
  const container = document.getElementById("modal-root")!;

  if (component) {
    const fullClassName = classnames(className, "fixed bottom-12 right-12");
    return createPortal(createElement(component, { className: fullClassName, to }, <FaPlus />), container);
  }

  return createPortal(
    <>
      {tooltip ? (
        <div className={classnames(fixed && "fixed bottom-12 right-12")}>
          <Tooltip content={tooltip} placement="left">
            <button className={className} onClick={onClick}>
              {icon || <FaPlus />}
            </button>
          </Tooltip>
        </div>
      ) : (
        <div className={classnames(fixed && "fixed bottom-12 right-12")}>
          <button className={className} onClick={onClick}>
            {icon || <FaPlus />}
          </button>
        </div>
      )}
    </>,
    container
  );
};

export const FloatingActionGroup = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const container = document.getElementById("modal-root")!;
  return createPortal(<div className="fixed bottom-12 right-12">{children}</div>, container);
};

const COLORS = {
  info: "bg-info-500 hover:bg-info-700 text-white shadow-info-500/30",
  success: "bg-success-500 hover:bg-success-700 text-white shadow-success-500/30",
  warning: "bg-warning-500 hover:bg-warning-700 text-white shadow-warning-500/30",
  error: "bg-error-500 hover:bg-error-700 text-white shadow-error-500/30",
  neutral: "bg-neutral-500 hover:bg-neutral-700 text-white shadow-neutral-500/30",
};

const SIZES = {
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};
