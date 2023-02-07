import useAutosizeTextArea from "hooks/useAutosizeTextArea";
import { FocusEventHandler, useEffect, useRef, useState } from "react";
import { SimpleComponentProps, ColorProps, getColor, getSize, classnames } from "./shared";

export interface TextAreaProps extends SimpleComponentProps, ColorProps {
  label?: string;
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
}
export const TextArea = (props: TextAreaProps) => {
  const { label, value, name, onChange, onBlur, onValue, onEnter, onEscape } = props;
  const { minRows, maxRows, rows, spellCheck } = props;
  const [textAreaRef, setRef] = useState<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(textAreaRef, value ?? "", minRows, maxRows);

  const color = getColor(props, "neutral");
  const size = getSize(props);

  const sizeCss = SIZES[size];
  const colorCss = color.toString();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    onValue?.(e.target.value);
    console.log(e);
  };

  return (
    <div className={classnames("tf-wrapper", colorCss, sizeCss)}>
      <textarea
        ref={setRef}
        className="tf resize-none"
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        placeholder={label}
        value={value ?? ""}
        rows={rows}
        spellCheck={spellCheck}
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
