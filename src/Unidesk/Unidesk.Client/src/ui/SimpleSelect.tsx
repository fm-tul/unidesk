import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { Key, ReactNode, useContext } from "react";
import { MdArrowDropDown } from "react-icons/md";

import { useOpenClose } from "hooks/useOpenClose";

import { Button } from "./Button";
import { ListItem, ListRenderer } from "./ListRenderer";
import { ComplexComponentProps, getHelperProps, getStyleProps, HelperProps, UiColors } from "./shared";

type BaseProps<TValue> = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  HelperProps &
  ComplexComponentProps & {
    keyProp?: keyof TValue | ((value: TValue) => Key);
    valueProp?: keyof TValue | ((value: TValue) => Key | JSX.Element);
    label?: string | JSX.Element;
    required?: boolean;
    deselectLabel?: string | JSX.Element;
    open?: boolean;
    onClose?: () => void;
    hidden?: boolean;
  };

export type SimpleSelectProps<TValue> = BaseProps<TValue> &
  (
    | {
        options: TValue[];
        value?: Key[] | null;
        onValue?: (keys: Key[], values?: TValue[] | undefined) => void;
        multiple: true;
      }
    | {
        options: TValue[];
        value?: Key | null;
        onValue?: (key: Key, value?: TValue | undefined) => void;
        multiple?: never;
      }
  );

const keyProps = ["key", "id"];
const defaultKeyGetter = (value: any): Key => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "object") {
    const firstValid = keyProps.find(i => i in value);
    return firstValid ? value[firstValid] : `${value}`;
  }
  return `${value}`;
};

const valueProps = ["value", "name"];
const defaultValueGetter = (value: any): Key => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "object") {
    const firstValid = valueProps.find(i => i in value);
    if (firstValid) {
      return value[firstValid];
    }
    debugger;
    return `${value}`;
  }
  return `${value}`;
};

const renderPills = (options: [Key, any][], color: UiColors = "info") => {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {options.map(([key, value]) => (
        <span className={`pill ${color}`} key={key}>
          {value}
        </span>
      ))}
    </span>
  );
};

const arrowOpenCss = "text-[22px] transition w-8 -mr-2 -rotate-180";
const arrowCloseCss = "text-[22px] transition w-8 -mr-2 rotate-0";
const buttonBaseCss = "min-w-[50px] flex-nowrap normal-case";

export const SimpleSelect = <TValue,>(props: SimpleSelectProps<TValue>) => {
  // contexts
  const context = useContext(LanguageContext);

  // extract props
  const { value, options, label = "select-item", keyProp = defaultKeyGetter, valueProp = defaultValueGetter } = props;
  const { onValue, onBlur, onChange, open: manualOpen, hidden, onClose } = props;
  const { className = "" } = props;
  const { fullWidth = true, loading, disabled, multiple = false, required = true, deselectLabel } = props;
  const { color, size, variant } = getStyleProps(props, "outlined");
  const { helperText, helperColorCss } = getHelperProps(props);

  // states
  const { isOpen, open, close } = useOpenClose(false);

  // css
  const fullWidthCss = fullWidth ? "w-full" : "";
  const buttonCss = `${buttonBaseCss} ${className}`;
  const hiddenCss = hidden ? "hidden" : "";

  // button props
  const buttonProps = { loading, disabled, fullWidth, color: helperColorCss ? "error" : color, size, variant, justify: "justify-between" };

  // logic
  const valueIsArray = Array.isArray(value);
  const valueIsFalsy = value === null || value === undefined || value === "" || (valueIsArray && value.length === 0);
  const optionsWithKey = options.map(
    i =>
      ({
        key: typeof keyProp === "function" ? keyProp(i) : i[keyProp],
        label: typeof valueProp === "function" ? valueProp(i) : i[valueProp],
        value: i,
      } as ListItem<TValue>)
  );

  // handlers
  const doClose = () => {
    close();
    onClose?.();
    onBlur?.({} as any);
  };

  const resetSelection = () => {
    if (multiple) {
      (onValue as any)?.([], []);
    } else {
      (onValue as any)?.(undefined, undefined);
    }
    doClose();
  };

  const handleClick = (key: Key, option: TValue) => {
    if (multiple) {
      const valueArray = valueIsFalsy ? [] : (value as Key[]);
      if (valueArray.includes(key)) {
        const newKeys = valueArray.filter(i => i !== key);
        const newValues = newKeys.map(i => optionsWithKey.find(j => j.key === i)!.value);
        (onValue as any)?.(newKeys, newValues);
      } else {
        const newKeys = [...valueArray, key];
        const newValues = newKeys.map(i => optionsWithKey.find(j => j.key === i)!.value);
        (onValue as any)?.(newKeys, newValues);
      }
    } else {
      (onValue as any)?.(key, option);
      doClose();
    }
  };

  const selectedCss = (option: Key) => {
    if (valueIsFalsy) {
      return "";
    }

    return value === option || (valueIsArray && value.includes(option)) ? "selected" : "";
  };

  return (
    <div className={`select-wrapper relative ${fullWidthCss}`}>
      <Button {...buttonProps} className={`${buttonCss} ${hiddenCss}`} onClick={open}>
        <span>
          {valueIsFalsy ? (
            label
          ) : (
            <>
              {valueIsArray ? (
                <ListRenderer items={optionsWithKey.filter(i => value.includes(i.key))} color={color} />
              ) : (
                optionsWithKey.find(i => i.key === value)!.label
              )}
            </>
          )}
        </span>
        <MdArrowDropDown className={isOpen ? arrowOpenCss : arrowCloseCss} />
      </Button>
      {(isOpen || manualOpen) && (
        <>
          {/* clickable area which closes modal bg-black/10 */}
          <div onClick={doClose} className="fixed inset-0 z-10 " />

          {/* actual modal */}
          <div className="select gap-1">
            {required === false && !valueIsFalsy && (
              <div className="w-full">
                <Button onClick={resetSelection} className={`${buttonBaseCss} select-item w-full`} text warning justify="justify-between">
                  {deselectLabel ?? "Cancel"}
                </Button>
              </div>
            )}
            {optionsWithKey.map(({ key, label, value: option }) => (
              <Button
                onClick={() => handleClick(key, option!)}
                className={`${buttonCss} select-item ${selectedCss(key)}`}
                color={color}
                text
                key={key}
                justify="justify-between"
              >
                {label}
              </Button>
            ))}
          </div>
        </>
      )}
      {helperText && <div className={`mb-1 pl-4 text-xs ${helperColorCss}`}>{RR(helperText as EnKeys, context)}</div>}
    </div>
  );
};
