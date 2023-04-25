import { Button } from "./Button";
import { classnames } from "./shared";
import { ComplexComponentProps, getColor, getSize, getVariant } from "./shared";

export interface CheckboxProps extends ComplexComponentProps {
  value?: boolean;
  onValue?: (value: boolean) => void;
  className?: string;
  after?: boolean;
  label?: JSX.Element|string|undefined;
  justify?: "justify-start" | "justify-center" | "justify-end" | "justify-between" | "justify-around";
}
export const Checkbox = (props: CheckboxProps) => {
  const { value, onValue, className, after, label, justify="justify-start" } = props;
  const checked = !!value;

  const size = getSize(props, "md");
  const color = getColor(props, "info");
  const variant = getVariant(props, "text");
  const afterCss = after ? "flex-row-reverse" : "";

  const colorCss = COLORS[color];
  const sizeCss = SIZES[size];
  const sizeRootCss = SIZE_ROOT[size];

  const onClick = (e: React.MouseEvent<any, MouseEvent>) => {
    e.stopPropagation();
    onValue?.(!checked);
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      justify={justify}
      className={classnames("flex cursor-pointer items-center", className, sizeRootCss)}
      onClick={onClick}
    >
      <div className={classnames("flex items-center justify-center", afterCss, className)}>
        <input
          type="checkbox"
          className={classnames("cursor-pointer", sizeCss, colorCss)}
          checked={checked}
          onClick={onClick}
          onChange={() => {}}
          tabIndex={-1}
        />
        <label className="inline-block grow cursor-pointer px-2 mt-0.5">
          {label}
        </label>
      </div>
    </Button>
  );
};

const COLORS = {
  info: "accent-blue-500",
  success: "accent-success-500",
  warning: "accent-warning-500",
  error: "accent-error-500",
  neutral: "accent-neutral-500",
};

const SIZES = {
  sm: "",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const SIZE_ROOT = {
  sm: "p-0",
  md: "p-2",
  lg: "p-3",
};


export default Checkbox;
