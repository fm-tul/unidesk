import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { TextArea } from "components/mui/ArrayField";
import { FocusEventHandler } from "react";
import { getSize, SimpleComponentProps, UiColors } from "./shared";

interface TextFieldProps extends SimpleComponentProps {
  label?: string;
  name?: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  className?: string;
  type?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;

  required?: boolean;

  helperColor?: UiColors | boolean;
  helperText?: string;
}
export const TextField = (props: TextFieldProps) => {
  const { label, value, name, type = "text", onChange, onBlur } = props;
  const { helperColor, helperText, className: classNameDefault = "", fullWidth = true, rows = 1, required = false } = props;
  const { multiline = rows > 1, maxRows } = props;
  const size = getSize(props);

  const hasError = helperColor === "error" || helperColor === true;
  const sizeCss = SIZES[size];
  const errorCss = hasError ? "error" : "";
  const errorCssHelperText = hasError ? "text-error-600" : "";
  const lockLabelCss = !!value || type.includes("date") ? "locked" : "";
  const fullWidthCss = fullWidth ? "w-full" : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  return (
    <div className={`relative flex flex-col ${classNameDefault} ${fullWidthCss}`}>
      {multiline ? (
        <TextArea
          rows={rows}
          maxRows={maxRows}
          name={name}
          className={`tf peer ${sizeCss} ${errorCss}`}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
        />
      ) : (
        <input
          name={name}
          className={`tf peer ${sizeCss} ${errorCss}`}
          type={type}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
        />
      )}
      {label && (
        <label className={`${sizeCss} ${errorCss} ${lockLabelCss} tf-label `}>
          {required && <span className="pr-1 text-red-900 opacity-60">*</span>}
          {label}
        </label>
      )}
      {helperText && <div className={`mb-1 pl-4 text-xs ${errorCssHelperText}`}>{R(helperText as EnKeys)}</div>}
    </div>
  );
};

const SIZES = {
  sm: "tf-sm",
  md: "tf-md",
  lg: "tf-lg",
};
