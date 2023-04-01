import useAutosizeTextArea from "hooks/useAutosizeTextArea";
import { FocusEventHandler, useState } from "react";
import { SimpleComponentProps, ColorProps, getColor, getSize, classnames } from "./shared";

export interface TextAreaProps extends SimpleComponentProps, ColorProps {
  label?: string | JSX.Element;
  name?: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValue?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement> | undefined;
  onEnter?: () => void;
  onEscape?: () => void;
  className?: string;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  required?: boolean;

  spellCheck?: boolean;
  width?: string;

  disabled?: boolean;
  disableClass?: string;
}
export const TextArea = (props: TextAreaProps) => {
  const { label, value, name, onChange, onBlur, onValue, onEnter, onEscape, disabled, disableClass="disabled" } = props;
  const { minRows, maxRows, rows, spellCheck, width, className  } = props;
  const [textAreaRef, setRef] = useState<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(textAreaRef, value ?? "", minRows, maxRows);

  const color = getColor(props, "neutral");
  const size = getSize(props);

  const sizeCss = SIZES[size];
  const colorCss = color.toString();
  const disabledCss = disabled ? `${disableClass} i-disabled` : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    onValue?.(e.target.value);
  };

  return (
    <div className={classnames("tf-wrapper", colorCss, sizeCss, className, width ?? "w-full")}>
      <textarea
        ref={setRef}
        className={classnames("tf resize-none", disabledCss)}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        placeholder={label as string}
        value={value ?? ""}
        rows={rows}
        spellCheck={spellCheck}
        disabled={disabled}
      />
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
