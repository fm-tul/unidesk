import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { FocusEventHandler } from "react";

import { TextArea } from "components/mui/ArrayField";

import { ColorProps, getColor, getSize, SimpleComponentProps, UiColors } from "./shared";

export interface TextFieldProps extends SimpleComponentProps, ColorProps {
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

  spellCheck?: boolean;
}
export const TextField = (props: TextFieldProps) => {
  const { label, value, name, type = "text", onChange, onBlur, onValue, onEnter, onEscape } = props;
  const { className: classNameDefault = "", fullWidth = true, rows = 1, required = false } = props;
  const { multiline = rows > 1, maxRows, loading = false, disabled = false, disableClass = "disabled", spellCheck } = props;
  const color = getColor(props);
  const size = getSize(props);

  const sizeCss = SIZES[size];
  const errorCss = color.toString();
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
          spellCheck={spellCheck}
        />
      ) : (
        <div className="grid grid-cols-1 items-center h-full">
          <input
            name={name}
            className={`tf peer h-full col-start-1 row-start-1 transition-all ${sizeCss} ${errorCss} ${disabledCss} ${
              loading ? "pl-10 text-neutral-600" : ""
            }`}
            type={type}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={onBlur}
            onKeyUp={handleKeyUp}
            spellCheck={spellCheck}
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
    </div>
  );
};

const SIZES = {
  sm: "tf-sm",
  md: "tf-md",
  lg: "tf-lg",
};


const HELPER_COLORS = {
  error: "text-error-600",
  success: "text-success-600",
  info: "text-info-600",
  warning: "text-warning-600",
  neutral: "text-neutral-600",
};

const ERROR_CSS = {
  error: "error",
  success: "success",
  info: "info",
  warning: "warning",
}