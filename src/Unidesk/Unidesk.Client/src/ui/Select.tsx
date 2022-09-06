import { Key, ReactNode, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { MdClear, MdKeyboardArrowDown } from "react-icons/md";
import { debounce } from "throttle-debounce";

import { useInputState } from "hooks/useInputState";
import { useOpenClose } from "hooks/useOpenClose";
import { distinctBy } from "utils/arrays";

import { ListRenderer } from "./ListRenderer";
import { classnames, getHelperColor, getHelperProps, getSize, HelperProps, SizeProps, UiColors, UiSizes } from "./shared";

export interface TId {
  id: string;
}

export interface SelectOption<T extends TId | string> {
  key: string;
  value: T;
  label: ReactNode;
}
interface SelectBaseProps<T extends TId | string> extends HelperProps, SizeProps {
  options: SelectOption<T>[] | ((value: string) => Promise<SelectOption<T>[]>) | ((value: string) => Promise<T[]>);
  label?: ReactNode;

  loading?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;

  width?: string;
  height?: string;

  modalHeight?: string;
  value?: T[] | T | string;
  optionRender?: (option: T) => ReactNode;
  onValue?: (value: T[], first: T | undefined) => void;
  onBlur?: () => void;
  textSize?: UiSizes;
  className?: string;

  onSingleValue?: (value: T|undefined) => void;
  onMultiValue?: (value: T[]) => void;
}

const getValuesSafe = <T extends TId | string>(
  value: T[] | T | string,
  multiple: boolean | undefined,
  options: SelectOption<T>[] | ((value: string) => Promise<SelectOption<T>[]>) | ((value: string) => Promise<T[]>),
  asyncOptions: SelectOption<T>[]
): T[] => {
  const isAsync = typeof options === "function";
  const validOptions = isAsync ? asyncOptions : options;
  const isArray = Array.isArray(value);
  const itemsAsArray = isArray ? value : [value];

  // here we have either list of values or list of keys, check for guid
  const itemsAreStrings = itemsAsArray.every(v => typeof v === "string" && v.length === 36);
  let result: T[] = [];

  if (itemsAreStrings && validOptions) {
    // every selected options is a key so we can map them to options
    if (itemsAsArray.every((i: string | T) => validOptions.find(o => o.key === i))) {
      result = itemsAsArray.map(key => validOptions.find(o => o.key === key)!.value);
    } else {
      result = itemsAsArray as T[];
    }
  } else {
    result = itemsAsArray as T[];
  }

  if (multiple) {
    return result;
  }

  return result.length > 0 ? [result[0]] : [];
};

export interface SelectProps<T extends TId | string> extends SelectBaseProps<T> {}
export const Select = <T extends TId | string>(props: SelectProps<T>) => {
  const { options, loading, disabled, searchable, clearable, multiple, label, className } = props;
  const { value = [], textSize, onValue, onBlur, optionRender, onSingleValue, onMultiValue } = props;
  const { helperText, helperColor } = getHelperColor(props);
  const theme = THEME[(helperColor || "info") as keyof typeof THEME];
  const sizeText = SIZES_TEXT[textSize ?? getSize(props)];
  const sizeTheme = SIZES_THEME[getSize(props)];

  const { value: searchText, onChange: setSearchText } = useInputState("");
  const { isOpen, close, open } = useOpenClose();
  const [searching, setSearching] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SelectOption<T>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const valueSafe = getValuesSafe(value, multiple, options, asyncOptions);
  const hasValue = valueSafe.length > 0 && !!valueSafe[0];
  const isAsync = typeof options === "function";
  const selectedOptionSafe: SelectOption<T>[] = valueSafe.map(v => ({
    key: typeof v === "string" ? v : v.id,
    value: v,
    label: optionRender?.(v) ?? (typeof v === "string" ? (v as string) : v.id),
  }));

  const { width } = props;
  const { modalHeight = "max-h-xs" } = props;

  const handleSelectClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    open();
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e);
    open();
  };

  const doClose = () => {
    close();
    onBlur?.();
  };

  const handleOptionClickMultiple = (option: T) => {
    // remove the option from the list
    const optionId = typeof option === "string" ? option : option.id;
    if (valueSafe.map(i => (typeof i === "string" ? i : i.id)).includes(optionId)) {
      const newValue = [...valueSafe.filter(i => (typeof i === "string" ? i : i.id) !== optionId)];
      onValue?.(newValue, newValue[0]);
      if(multiple) {
        onMultiValue?.(newValue);
      } else {
        onSingleValue?.(newValue[0]);
      }
    } else {
      // add the option to the list
      const newValue = [...valueSafe, option];
      onValue?.(newValue, newValue[0]);
      if(multiple) {
        onMultiValue?.(newValue);
      } else {
        onSingleValue?.(newValue[0]);
      }
    }
  };

  const handleOptionClickSingle = (option: T) => {
    onValue?.([option], option);

    if(multiple) {
      onMultiValue?.([option]);
    } else {
      onSingleValue?.(option);
    }
  };

  const handleOptionClick = (option: T) => {
    if (multiple) {
      handleOptionClickMultiple(option);
    } else {
      handleOptionClickSingle(option);
      doClose();
    }
    setSearchText("");
  };

  const handleClearClick = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    if (searchText.length > 0) {
      setSearchText("");
    } else {
      onValue?.([], undefined);
      if(multiple) {
        onMultiValue?.([]);
      } else {
        onSingleValue?.(undefined);
      }
    }
  };

  const handleSelectedOptionClick = (option: SelectOption<T>, e: React.MouseEvent<any>) => {
    e.stopPropagation();

    if (multiple) {
      handleOptionClickMultiple(option.value);
    } else {
      handleOptionClickSingle(option.value);
      doClose();
    }
    setSearchText("");
  };

  const doSearch = async (searchText: string) => {
    if (isAsync && searchText.length > 0) {
      setSearching(true);
      const newOptions = await options(searchText);
      let newSelectOptions: SelectOption<T>[] = [];
      if (newOptions.some((i: any) => "key" in i)) {
        // it's SelectOption<T>[]
        newSelectOptions = newOptions as SelectOption<T>[];
      } else {
        // it's T[]
        newSelectOptions = newOptions.map((i: any) => ({
          key: typeof i === "string" ? (i as string) : i.id,
          value: i,
          label: optionRender?.(i) ?? (typeof i === "string" ? (i as string) : i.id),
        }));
      }

      setAsyncOptions(newSelectOptions);
      setSearching(false);
    }
  };
  const debouncedSearch = useCallback(debounce(500, doSearch), []);

  const optionKeyUp = (option: T, e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();
      handleOptionClick(option);
    }
  };

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText]);

  const filteredOptions = isAsync
    ? asyncOptions
    : options.filter(
        o =>
          o.label
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase() ?? false) || o.key.toLowerCase().includes(searchText.toLowerCase())
      );

  return (
    <div className={classnames("select-root relative select-none inline-flex flex-col", width, disabled && "pointer-events-none", className)}>
      {/* main flex wrapper */}
      <div
        tabIndex={0}
        className={classnames(
          "select-wrapper flex justify-between bg-white/80 rounded border border-solid border-neutral-400 ring-0 transition-all focus-within:ring-2 h-full",
          theme.ring
        )}
      >
        {/* items (selected, input, others) */}
        <div className={classnames("flex w-full flex-wrap items-center gap-1", sizeTheme)} onClick={handleSelectClick}>
          {/* selected items */}
          {hasValue ? (
            <>
              {multiple && (
                <ListRenderer
                  // className={classnames(size)}
                  asFragment
                  items={selectedOptionSafe}
                  onClick={handleSelectedOptionClick}
                  color={theme.name as UiColors}
                />
              )}
              {!multiple && <span className={classnames(sizeText)}>{selectedOptionSafe[0].label}</span>}
            </>
          ) : (
            <span className={classnames(sizeText, "pl-1 text-sm italic text-neutral-600")}>{label}</span>
          )}

          {/* input */}
          {searchable && (
            <div className="grid grid-cols-[0px_min-content]">
              <input
                ref={inputRef}
                spellCheck={false}
                value={searchText}
                disabled={disabled}
                type="text"
                className="col-start-2 row-start-1 w-full min-w-[10px] select-text bg-transparent outline-none"
                onChange={handleSearchTextChange}
                tabIndex={0}
              />
              <span className="invisible col-start-2 row-start-1">{searchText}&nbsp;</span>
            </div>
          )}
          <span>&nbsp;</span>
        </div>

        {/* indicators (arrow, clear) */}
        <div className="flex items-stretch gap-1">
          {/* search && clear */}
          {searching ? (
            <div className="flex w-full items-center animate-in fade-in-0 ">
              <span className="spinner black"> </span>
            </div>
          ) : (
            <>
              {clearable && !disabled && (searchText || valueSafe.length > 0) && (
                <MdClear className="box-content h-full w-4 px-2 text-neutral-400 hover:text-black" onClick={handleClearClick} />
              )}
            </>
          )}

          {/* separator */}
          <div className="my-1 -mr-1 h-[calc(100%-8px)] w-px bg-neutral-400" />

          {/* arrow */}
          <MdKeyboardArrowDown
            onClick={handleSelectClick}
            className={classnames(
              "box-content h-full w-5 min-w-[20px] px-2 text-neutral-700 transition hover:text-black",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </div>
      </div>

      {/* modal */}
      {isOpen && !disabled && !loading && (
        <div className="modal-wrapper">
          {/* modal backdrop */}
          <div className="fixed inset-0 opacity-0" onClick={doClose} />

          {/* popup */}
          <div
            className={classnames(
              "select-modal absolute left-0 right-0 z-10 mt-2 cursor-pointer overflow-auto shadow-xl",
              "pretty-scrollbar rounded border border-solid bg-white",
              theme.border,
              modalHeight
            )}
          >
            {filteredOptions.map(i => (
              <div
                key={i.key}
                className={classnames(
                  "p-1 px-2 transition",
                  theme.option,
                  valueSafe.map(j => (typeof j === "string" ? j : j.id)).includes(i.key) && "selected"
                )}
                tabIndex={0}
                onClick={e => handleOptionClick(i.value)}
                onKeyUp={e => optionKeyUp(i.value, e)}
              >
                {i.label}
              </div>
            ))}
            {filteredOptions.length === 0 && <div className="cursor-default p-1 px-2 text-sm text-neutral-700">No results</div>}
          </div>
        </div>
      )}
      {!!helperText && <div className={classnames("animate-reveal-var pl-2 text-sm", theme.helperColor)}>{helperText}</div>}
    </div>
  );
};

const THEME = {
  info: {
    name: "info",
    border: "border-info-500",
    ring: "ring-info-500/50 focus-within:border-info-500",
    helperColor: "text-neutral-700",
    option: "hocus:bg-info-200 selected:bg-info-300",
  },
  error: {
    name: "error",
    border: "border-error-500",
    ring: "ring-error-500/50 focus-within:border-error-500",
    helperColor: "text-error-600",
    option: "hocus:bg-error-200 selected:bg-error-300",
  },
  success: {
    name: "success",
    border: "border-success-500",
    ring: "ring-success-500/50 focus-within:border-success-500",
    helperColor: "text-success-700",
    option: "hocus:bg-success-200 selected:bg-success-300",
  },
  warning: {
    name: "warning",
    border: "border-warning-500",
    ring: "ring-warning-500/50 focus-within:border-warning-500",
    helperColor: "text-warning-600",
    option: "hocus:bg-warning-200 selected:bg-warning-300",
  },
};

const SIZES_TEXT = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const SIZES_THEME = {
  sm: "px-2 py-1",
  md: "px-2 py-2",
  lg: "px-2 py-3",
};

export interface PrimitiveOption<T> {
  id: string;
  value: T;
}

export const generateOptions = <T,>(values: T[]): SelectOption<PrimitiveOption<T>>[] => {
  return values.map(generateOption);
};

export const generateOption = <T,>(value: T): SelectOption<PrimitiveOption<T>> => {
  const id = `${value}`;
  return { key: id, label: id, value: { id, value: value } };
};

export const generatePrimitive = <T extends string>(values: T[], renderer?: (value: T) => React.ReactNode): SelectOption<T>[] => {
  return values.map(i => {
    const id = `${i}`;
    return { key: id, value: i, label: renderer?.(i) ?? id };
  });
};
