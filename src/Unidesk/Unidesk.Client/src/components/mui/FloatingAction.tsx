import { createElement } from "react";
import { FaPlus } from "react-icons/fa";
import { classnames, ColorProps, getColor, getSize, SizeProps } from "ui/shared";

interface FloatingActionProps extends ColorProps, SizeProps {
  fixed?: boolean;
  component?: React.ElementType;
  to?: string;
  tooltip?: string;
}
export const FloatingAction = (props: FloatingActionProps) => {
  const { fixed = true, component, to } = props;
  const colorCss = COLORS[getColor(props, "info")];
  const sizeCss = SIZES[getSize(props, "md")];
  const className = classnames("rounded-full shadow-lg transition-all", fixed && "fixed bottom-12 right-12", colorCss, sizeCss);

  if (component) {
    return createElement(component, { className, to }, <FaPlus />);
  }

  return (
    <button className={className}>
      <FaPlus />
    </button>
  );
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
