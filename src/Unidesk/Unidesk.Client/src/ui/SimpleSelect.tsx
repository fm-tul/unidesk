import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useOpenClose } from "hooks/useOpenClose";
import { Key, useContext } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { Button } from "./Button";
import { ComplexComponentProps, HelperProps, getStyleProps, getHelperProps, UiColors } from "./shared";

type BaseProps<TValue> = React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
  HelperProps &
  ComplexComponentProps & {
    keyProp?: keyof TValue | ((value: TValue) => Key);
    valueProp?: keyof TValue | ((value: TValue) => Key | JSX.Element);
    label?: string | JSX.Element;
    required?: boolean;
    deselectLabel?: string | JSX.Element;
  };

type SimpleSelectProps<TValue> = BaseProps<TValue> &
  (
    | {
        options: TValue[];
        value?: Key[] | null;
        onValue?: (keys: Key[], values: TValue[]) => void;
        multiple: true;
      }
    | {
        options: TValue[];
        value?: Key | null;
        onValue?: (key: Key, value: TValue) => void;
        multiple?: never;
      }
  );

const defaultKeyGetter = (value: any): Key => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "object") {
    return "key" in value ? value.key : `${value}`;
  }
  return `${value}`;
};

const defaultValueGetter = (value: any): Key => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "object") {
    return "value" in value ? value.value : `${value}`;
  }
  return `${value}`;
};

const renderPills = (options: any[], color: UiColors = "info") => {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {options.map(i => (
        <span className={`pill ${color}`} key={i}>
          {i}
        </span>
      ))}
    </span>
  );
};

const arrowOpenCss = "text-[22px] transition w-8 -mr-2 -rotate-180";
const arrowCloseCss = "text-[22px] transition w-8 -mr-2 rotate-0";
const buttonBaseCss = "min-w-[50px] flex-nowrap justify-between normal-case";

export const SimpleSelect = <TValue,>(props: SimpleSelectProps<TValue>) => {
  // contexts
  const context = useContext(LanguageContext);

  // extract props
  const { value, options, label = "select-item", keyProp = defaultKeyGetter, valueProp = defaultValueGetter } = props;
  const { onValue, onBlur, onChange } = props;
  const { className = "" } = props;
  const { fullWidth, loading, disabled, multiple = false, required = true, deselectLabel } = props;
  const { color, size, variant } = getStyleProps(props, "outlined");
  const { helperText, helperColorCss } = getHelperProps(props);

  // states
  const { isOpen, open, close } = useOpenClose(false);

  // css
  const fullWidthCss = fullWidth ? "w-full" : "";
  const buttonCss = `${buttonBaseCss} ${className}`;

  // button props
  const buttonProps = { loading, disabled, fullWidth, color, size, variant };

  // logic
  const valueIsArray = Array.isArray(value);
  const valueIsFalsy = value === null || value === undefined || (valueIsArray && value.length === 0);
  const optionsWithKey = options.map(
    i =>
      ({
        key: typeof keyProp === "function" ? keyProp(i) : i[keyProp],
        label: typeof valueProp === "function" ? valueProp(i) : i[valueProp],
        value: i,
      } as {
        key: Key;
        label: Key | JSX.Element;
        value: TValue;
      })
  );

  // handlers
  const doClose = () => {
    close();
    onBlur?.({} as any);
  };

  const resetSelection = () => {
    if (multiple) {
      (onValue as any)?.([], []);
    } else {
      (onValue as any)?.(null, null);
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
      <Button {...buttonProps} className={buttonCss} onClick={open}>
        <span>
          {valueIsFalsy ? (
            label
          ) : (
            <>
              {valueIsArray
                ? renderPills(
                    optionsWithKey.filter(i => value.includes(i.key)).map(i => i.label),
                    color
                  )
                : optionsWithKey.find(i => i.key === value)!.label}
            </>
          )}
        </span>
        <MdArrowDropDown className={isOpen ? arrowOpenCss : arrowCloseCss} />
      </Button>
      {isOpen && (
        <>
          {/* clickable area which closes modal */}
          <div onClick={doClose} className="fixed inset-0 z-10 bg-black/10" />

          {/* actual modal */}
          <div className="select gap-1">
            {optionsWithKey.map(({ key, label, value: option }) => (
              <Button
                onClick={() => handleClick(key, option)}
                className={`${buttonCss} select-item ${selectedCss(key)}`}
                color={color}
                text
                key={key}
              >
                {label}
              </Button>
            ))}
            {required === false && (
              <Button onClick={resetSelection} className={`${buttonCss} select-item`} text>
                {deselectLabel ?? "Cancel"}
              </Button>
            )}
          </div>
        </>
      )}
      {helperText && <div className={`mb-1 pl-4 text-xs ${helperColorCss}`}>{RR(helperText as EnKeys, context)}</div>}
    </div>
  );
};
