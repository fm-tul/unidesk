import { useOpenClose } from "hooks/useOpenClose";
import { Key, useContext } from "react";
import { Button } from "./Button";
import { MdArrowDropDown } from "react-icons/md";
import { ComplexComponentProps, getColor, getSize, getVariant, UiColors } from "./shared";
import React from "react";
import { R, RR } from "@locales/R";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";

const defaultKeyGetter = (option: any) => {
  return (typeof option == "object" && (option as any).hasOwnProperty("key") ? (option as any).key : `${option}`) as Key;
};

const defaultValueGetter = (option: any) => {
  return (typeof option == "object" && (option as any).hasOwnProperty("value") ? (option as any).value : `${option}`) as Key;
};

const arrowOpenCss = "text-[22px] transition w-8 -mr-2 -rotate-180";
const arrowCloseCss = "text-[22px] transition w-8 -mr-2 rotate-0";
const buttonCss = "min-w-[50px] flex-nowrap justify-between normal-case";

interface SelectPropsBase<T> extends ComplexComponentProps {
  className?: string;
  helperText?: string;
  helperColor?: UiColors | boolean;
  label?: string;
  options: T[];
  keyGetter?: (value: T) => Key;
  valueGetter?: (value: T) => string | number | JSX.Element;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

export interface Select2MultipleProps<T> extends SelectPropsBase<T> {
  multiple: true;
  value: Key[];
  onChange?: (value: T[]) => void;
  labelGetter?: (value: T[]) => string | number | JSX.Element;
}

export interface Select2SingleProps<T> extends SelectPropsBase<T> {
  multiple?: false;
  value: Key;
  onChange?: (value: T) => void;
  labelGetter?: (value: T) => string | number | JSX.Element;
}

const SelectMultiple = <T,>(props: Select2MultipleProps<T>) => {
  const context = useContext(LanguageContext);

  const { options = [], onChange, onBlur, label = "select-option", className: classNameOverride = "" } = props;
  const { keyGetter = defaultKeyGetter, valueGetter = defaultValueGetter, labelGetter } = props;
  const { loading, disabled, fullWidth = true, value } = props;

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props, "outlined");

  const { helperText, helperColor } = props;
  const hasError = helperColor === "error" || helperColor === true;
  const errorCssHelperText = hasError ? "text-error-600" : "";

  const keyValues = options.map(option => [keyGetter(option), valueGetter(option), option] as [Key, string | number | JSX.Element, T]);
  const selectedObjs = keyValues.filter(kv => value.includes(kv[0])).map(kv => kv[2]);

  const { isOpen, open, close } = useOpenClose(false);
  const doClose = () => {
    close();
    onBlur?.({} as any);
  };

  const fullWidthCss = fullWidth ? "w-full" : "";
  const buttonProps = { loading, disabled, fullWidth, variant, size, color };
  const buttonClassName = `${buttonCss} ${classNameOverride}`;

  const handleClick = (newValue: T) => {
    const newKey = keyGetter(newValue);
    if (value.includes(newKey)) {
      const keysWithoutNewKey = value.filter(v => v !== newKey);
      const newValues = keyValues.filter(o => keysWithoutNewKey.includes(o[0])).map(o => o[2]);
      onChange?.(newValues);
    } else {
      const newKEys = [...value, newKey];
      const newValues = keyValues.filter(o => newKEys.includes(o[0])).map(o => o[2]);
      onChange?.(newValues);
    }
  };

  const labelRenderer = labelGetter ? labelGetter : () => renderPills(selectedObjs.map(valueGetter));

  return (
    <div className={`select-wrapper relative ${fullWidthCss}`}>
      <Button {...buttonProps} onClick={open} className={buttonClassName}>
        <span>{selectedObjs.length === 0 ? label : labelRenderer(selectedObjs)}</span>
        <MdArrowDropDown className={isOpen ? arrowOpenCss : arrowCloseCss} />
      </Button>
      {isOpen && (
        <>
          {/* clickable area which closes modal */}
          <div onClick={doClose} className="fixed inset-0 z-10 bg-black/10" />

          {/* actual modal */}
          <div className="select gap-1">
            {keyValues.map(([k, v, option]) => (
              <Button
                onClick={() => handleClick(option)}
                className={`${buttonClassName} select-item ${value.includes(k) ? "selected" : ""}`}
                color={color}
                text
                key={k}
              >
                {v}
              </Button>
            ))}
          </div>
        </>
      )}
      {helperText && <div className={`mb-1 pl-4 text-xs ${errorCssHelperText}`}>{RR(helperText as EnKeys, context)}</div>}
    </div>
  );
};

const SelectSingle = <T,>(props: Select2SingleProps<T>) => {
  const context = useContext(LanguageContext);
  const { options, onChange, onBlur, label = "select-option", className: classNameOverride = "" } = props;
  const { keyGetter = defaultKeyGetter, valueGetter = defaultValueGetter, labelGetter = valueGetter } = props;
  const { loading, disabled, fullWidth = true, value } = props;

  const { helperText, helperColor } = props;
  const hasError = helperColor === "error" || helperColor === true;
  const errorCssHelperText = hasError ? "text-error-600" : "";

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props, "outlined");

  const keyValues = options.map(option => [keyGetter(option), valueGetter(option), option] as [Key, string | number | JSX.Element, T]);
  const selectedObj = keyValues.find(o => o[0] === value)?.[2];

  const { isOpen, open, close } = useOpenClose(false);
  const doClose = () => {
    close();
    onBlur?.({} as any);
  };

  const fullWidthCss = fullWidth ? "w-full" : "";
  const buttonProps = { loading, disabled, fullWidth, variant, size, color };
  const buttonClassName = `${buttonCss} ${classNameOverride}`;

  const handleClick = (newValue: T) => {
    onChange?.(newValue);
    doClose();
  };

  return (
    <div className={`select-wrapper relative ${fullWidthCss}`}>
      <Button {...buttonProps} onClick={open} className={buttonClassName}>
        <span>{selectedObj === undefined ? label : labelGetter(selectedObj)}</span>
        <MdArrowDropDown className={isOpen ? arrowOpenCss : arrowCloseCss} />
      </Button>
      {isOpen && (
        <>
          {/* clickable area which closes modal */}
          <div onClick={doClose} className="fixed inset-0 z-10 bg-black/10" />

          {/* actual modal */}
          <div className="select gap-1">
            {keyValues.map(([k, v, option]) => (
              <Button
                onClick={() => handleClick(option)}
                className={`${buttonClassName} select-item ${value === k ? "selected" : ""}`}
                color={color}
                text
                key={k}
              >
                {v}
              </Button>
            ))}
          </div>
        </>
      )}
      {helperText && <div className={`mb-1 pl-4 text-xs ${errorCssHelperText}`}>{RR(helperText as EnKeys, context)}</div>}
    </div>
  );
};

export const Select = <T,>(props: Select2MultipleProps<T> | Select2SingleProps<T>) => {
  const { multiple = false } = props;
  return multiple ? <SelectMultiple {...(props as Select2MultipleProps<T>)} /> : <SelectSingle {...(props as Select2SingleProps<T>)} />;
};

export const renderPills = (options: (string | number | JSX.Element)[]) => {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {options.map(i => (
        <span className="pill" key={i.toString()}>
          {i}
        </span>
      ))}
    </span>
  );
};