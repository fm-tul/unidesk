import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { FocusEventHandler } from "react";

import { TextArea } from "components/mui/ArrayField";

import { classnames, ColorProps, getColor, getSize, SimpleComponentProps, UiColors } from "./shared";

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
  width?: string;
}
export const TextField = (props: TextFieldProps) => {
  const { label, value, name, type = "text", onChange, onBlur, onValue, onEnter, onEscape } = props;
  const { className, rows = 1, width = "w-full", required = false } = props;
  const { multiline = rows > 1, maxRows, loading = false, disabled = false, disableClass = "disabled", spellCheck } = props;
  const color = getColor(props, "neutral");
  const size = getSize(props);

  const sizeCss = SIZES[size];
  const colorCss = color.toString();
  const lockLabelCss = !!value || type.includes("date") ? "locked" : "";
  const disabledCss = loading || disabled ? `${disableClass} i-disabled` : "";
  const alignItems = multiline ? "items-start top-1" : "items-center";

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
    <div className={classnames("tf-wrapper", width, colorCss, className)}>
      {multiline ? (
        <TextArea
          name={name}
          className={classnames("tf", disabledCss, lockLabelCss, sizeCss)}
          rows={rows}
          maxRows={maxRows}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyUp={handleKeyUp}
          spellCheck={spellCheck}
        />
      ) : (
        <input
          name={name}
          className={classnames("tf", disabledCss, lockLabelCss, sizeCss)}
          type={type}
          value={value ?? ""}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyUp={handleKeyUp}
          spellCheck={spellCheck}
        />
      )}
      {loading && (
        <div className={classnames("pointer-events-none absolute inset-0 right-2 flex justify-end animate-in fade-in-0", alignItems)}>
          <span className="spinner info"></span>
        </div>
      )}
      {label && (
        <div className={classnames("pointer-events-none absolute inset-0 flex", alignItems)}>
          <label className={`${lockLabelCss} tf-label`}>{label}</label>
        </div>
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
};
