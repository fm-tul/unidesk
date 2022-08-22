import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { FocusEventHandler } from "react";

import { TextArea } from "components/mui/ArrayField";

import { getSize, SimpleComponentProps, UiColors } from "./shared";

interface TextFieldProps extends SimpleComponentProps {
  label?: string;
  name?: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValue?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  onEnter?: () => void;
  onEscape?: () => void;
  className?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;

  required?: boolean;

  helperColor?: UiColors | boolean;
  helperText?: string;
}
export const TextField = (props: TextFieldProps) => {
  const { label, value, name, type = "text", onChange, onBlur, onValue, onEnter, onEscape } = props;
  const { helperColor, helperText, className: classNameDefault = "", fullWidth = true, rows = 1, required = false } = props;
  const { multiline = rows > 1, maxRows, loading = false, disabled = false, disableClass = "disabled" } = props;
  const size = getSize(props);

  const hasError = helperColor === "error" || helperColor === true;
  const sizeCss = SIZES[size];
  const errorCss = hasError ? "error" : "";
  const errorCssHelperText = hasError ? "text-error-600" : "";
  const lockLabelCss = !!value || type.includes("date") ? "locked" : "";
  const fullWidthCss = fullWidth ? "w-full" : "";
  const disabledCss = loading || disabled ? `${disableClass} i-disabled` : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e);
    onValue?.(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    } else if (e.key === "Escape") {
      onEscape?.();
    }
  };

  return (
    <div className={`relative flex flex-col ${classNameDefault} ${fullWidthCss}`}>
      {multiline ? (
        <TextArea
          rows={rows}
          maxRows={maxRows}
          name={name}
          className={`tf peer ${sizeCss} ${errorCss} ${disabledCss}`}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
        />
      ) : (
        <div className="grid grid-cols-1 items-center">
          <input
            name={name}
            className={`first-letter:tf peer col-start-1 row-start-1 transition-all ${sizeCss} ${errorCss} ${disabledCss} ${
              loading ? "pl-10 text-neutral-600" : ""
            }`}
            type={type}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={onBlur}
            onKeyUp={handleKeyUp}
          />
          {loading && (
            <div className="col-start-1 row-start-1 ml-2 flex max-w-[40px] items-center bg-gradient-to-r from-white via-white/90 fade-in-0 animate-in">
              <span className="spinner info"></span>
            </div>
          )}
        </div>
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
