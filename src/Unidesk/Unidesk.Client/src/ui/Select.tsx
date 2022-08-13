import { useOpenClose } from "hooks/useOpenClose";
import { Key, useState } from "react";
import { Button } from "./Button";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ComplexComponentProps, getColor, getSize, getVariant } from "./shared";

interface SelectProps<T> extends ComplexComponentProps {
  options: T[];
  label?: string;
  value?: Key;
  onChange?: (value: T) => void;
  keyGetter?: (value: T) => Key;
  valueGetter?: (value: T) => string | number | JSX.Element;
  labelGetter?: (value: T) => string | number | JSX.Element;
  className?: string;
}

const defaultKeyGetter = (option: any) => {
  return typeof option == "object" && (option as any).hasOwnProperty("key") ? (option as any).key : `${option}`;
};

const defaultValueGetter = (option: any) => {
  return typeof option == "object" && (option as any).hasOwnProperty("value") ? (option as any).value : `${option}`;
};

const arrowOpenCss = "transition -mr-1 -rotate-180";
const arrowCloseCss = "transition -mr-1 rotate-0";
export const Select = <T,>(props: SelectProps<T>) => {
  const { options, onChange, label = "select-option", className: classNameOverride = "" } = props;
  const { keyGetter = defaultKeyGetter, valueGetter = defaultValueGetter, labelGetter = valueGetter } = props;

  const { loading, disabled, fullWidth = false, value } = props;

  const size = getSize(props);
  const color = getColor(props);
  const variant = getVariant(props);

  const { isOpen, open, close } = useOpenClose(false);

  const selected = options.find(option => keyGetter(option) == value);
  const className = `${classNameOverride}`;

  const handleClick = (v: T) => {
    const newSelectedId = keyGetter(v);
    if (newSelectedId !== value) {
      onChange?.(v);
    }
    close();
  };

  return (
    <div className="relative">
      <Button
        onClick={open}
        className={`${className} min-w-[50px] justify-between normal-case`}
        variant={variant}
        size={size}
        color={color}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
      >
        {selected === undefined ? label : labelGetter(selected)}
        {!loading && <MdKeyboardArrowDown className={isOpen ? arrowOpenCss : arrowCloseCss} />}
      </Button>

      {isOpen && (
        <>
          {/* clickable area which closes modal */}
          <div onClick={close} className="fixed inset-0 z-10 bg-black/10"></div>

          {/* actual modal */}
          <div className="select absolute z-20">
            {options.map(option => {
              const k = keyGetter(option);
              const v = valueGetter(option);
              const isSelectedCss = selected != null && k === keyGetter(selected) ? "selected" : "";

              return (
                <Button
                  onClick={() => handleClick(option)}
                  className={`${className} select-item ${isSelectedCss} normal-case`}
                  text
                  key={k}
                  color={color}
                >
                  {v}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
