import { ColorProps, getColor, getSize, SimpleComponentProps } from "ui/shared";

export interface LinearProgressProps extends SimpleComponentProps, ColorProps {
  // value from 0 to 100
  value?: number;
  className?: string;
}

export const LinearProgress = (props: LinearProgressProps) => {
  const { value, className: classNameDefaults = "" } = props;
  const sizeCss = SIZES[getSize(props, "sm")];
  const color = getColor(props);

  const colorBarCss = COLORS[color];
  const colorBgCss = COLORS_BG[color];

  const computedWidth = value ? `${value.toFixed(2)}%` : "0%";
  const classNameBg = `pbar ${classNameDefaults} ${sizeCss} ${colorBgCss}`;
  const classNameBar = `${classNameDefaults} ${colorBarCss} h-full shadow-md shadow-info-500`;

  return (
    <div className={classNameBg}>
      <div className={classNameBar} style={{ width: computedWidth }}></div>
    </div>
  );
};

const COLORS = {
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
};

const COLORS_BG = {
  info: "bg-info-100",
  success: "bg-success-100",
  warning: "bg-warning-100",
  error: "bg-error-100",
};

const SIZES = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};
