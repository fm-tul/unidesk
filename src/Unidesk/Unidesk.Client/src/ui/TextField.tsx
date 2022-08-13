import { error } from "console";
import { FocusEventHandler } from "react";
import { getSize, SimpleComponentProps } from "./shared";

interface TextFieldProps extends SimpleComponentProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  error?: boolean;
  helperText?: string;
  className?: string;
  type?: string;
}
export const TextField = (props: TextFieldProps) => {
  const { label, value, name, type = "text", onChange, onBlur } = props;
  const { error, helperText, className: classNameDefault } = props;
  const size = getSize(props);

  const sizeCss = SIZES[size];
  const errorCss = error ? "error" : "";
  const errorCssHelperText = error ? "text-error-600" : "";
  const lockLabelCss = !!value || type.includes("date") ? "locked" : "";

  return (
    <div className={`relative flex flex-col ${classNameDefault}`}>
      <input name={name} className={`tf peer ${sizeCss} ${errorCss}`} type={type} value={value ?? ""} onChange={onChange} onBlur={onBlur} />
      {label && <label className={`${sizeCss} ${errorCss} ${lockLabelCss} tf-label `}>{label}</label>}
      {helperText && <div className={`mb-1 pl-4 text-xs ${errorCssHelperText}`}>{helperText}</div>}
    </div>
  );
};

const SIZES = {
  sm: "tf-sm",
  md: "tf-md",
  lg: "tf-lg",
};
