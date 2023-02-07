import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext, useEffect, useRef, useState } from "react";
import { MdClear, MdKeyboardArrowDown } from "react-icons/md";

import { useDebounceState } from "hooks/useDebounceState";
import { useOpenClose } from "hooks/useOpenClose";

import { classnames, UiColors } from "./shared";
import { useQuery } from "react-query";
import { Button } from "./Button";

type Primitive = string | number | boolean | null | undefined;
type IdLike = { id: string };
type KeyFunc = <T>(item: T) => React.Key;
type TitleFunc = <T>(item: T) => Primitive | JSX.Element;
const isPrimitiveType = (value: unknown): value is Primitive => {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null || value === undefined;
};

const isKey = (value: unknown): value is string | number => {
  return typeof value === "string" || typeof value === "number";
};

const idKey = (value: IdLike) => value.id;

const getKeyFuncBasedOnOption = <T,>(item: T, keyGetter?: (value: T) => Primitive): KeyFunc => {
  // we have keyGetter, just call it
  if (keyGetter) {
    if (isKey(keyGetter(item))) {
      return keyGetter as KeyFunc;
    }
    return ((item: T) => JSON.stringify(keyGetter(item))) as KeyFunc;
  }

  // we don't have keyGetter, and items is object, use item.id
  if (typeof item === "object" && (item as Object).hasOwnProperty("id")) {
    return idKey as KeyFunc;
  }

  // we don't have keyGetter, and items is primitive, use item
  return (isKey(item) ? item => item : item => JSON.stringify(item)) as KeyFunc;
};

const getTitleFuncBasedOnOption = <T,>(item: T, titleGetter?: (value: T) => Primitive | JSX.Element): TitleFunc => {
  // we have titleGetter, just call it
  if (titleGetter) {
    return titleGetter as TitleFunc;
  }

  // we don't have titleGetter, and items is object, use item.name or title
  if (typeof item === "object") {
    if ((item as Object).hasOwnProperty("name")) {
      return ((item: T) => (item as any).name) as TitleFunc;
    }
    if ((item as Object).hasOwnProperty("title")) {
      return ((item: T) => (item as any).title) as TitleFunc;
    }
    return ((item: T) => JSON.stringify(item)) as TitleFunc;
  }

  // we don't have titleGetter, and items is primitive, use item
  return (isPrimitiveType(item) ? item => item : item => JSON.stringify(item)) as TitleFunc;
};

interface SelectFieldProps<T> {
  value: T | T[] | undefined;
  options: T[];
  multiple?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValue?: (value: T[]) => void;
  getKey?: (value: T) => Primitive;
  getTitle?: (value: T) => Primitive | JSX.Element;
  getValue?: (value: T) => Primitive;
  onSearch?: (search: string) => void;
  label?: string | JSX.Element;
  size?: "sm" | "md" | "lg";
  width?: string;
  color?: UiColors;
  clientFilter?: boolean;
  onAddNew?: (value: string) => void;
}
export const SelectField = <T,>(props: SelectFieldProps<T>) => {
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const {
    value,
    multiple = false,
    clearable = false,
    searchable = false,
    loading = false,
    label,
    disabled = false,
    onAddNew,
    options,
  } = props;
  const { size = "md", width = "w-full min-w-[200px]", color = "info" } = props;
  const { onValue, getTitle, getKey, getValue, onSearch, clientFilter = true } = props;
  const values = value == undefined ? [] : Array.isArray(value) ? value : [value];
  const selectedValues = multiple ? values : values.length > 0 ? [values[0]] : [];

  // states
  const { isOpen, close, open } = useOpenClose(false);
  const [searchText, setSearchText, debouncedSearchText, setDebounceText] = useDebounceState("", 300);

  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const theme = THEME[color];
  const sizeTheme = SIZES_THEME[size];

  const onValueConditionally = (value: T[]) => {
    if (onValue && !disabled) {
      onValue(value);
    }
  };

  const handleOptionClick = (option: T, event?: React.MouseEvent<any, MouseEvent>) => {
    if (disabled) {
      return;
    }
    event?.stopPropagation();
    setSearchText("");
    if (onValue == undefined) {
      return;
    }

    const keyFunc = getKeyFuncBasedOnOption<T>(option, getKey);

    if (multiple) {
      const includesOption = selectedValues.some(v => keyFunc(v) === keyFunc(option));

      if (includesOption) {
        onValueConditionally(selectedValues.filter(v => keyFunc(v) !== keyFunc(option)));
      } else {
        onValueConditionally([...selectedValues, option]);
      }
    } else {
      if (clearable && selectedValues.length > 0 && keyFunc(selectedValues[0]) === keyFunc(option)) {
        onValueConditionally([]);
      } else {
        onValueConditionally([option]);
      }
      onClose();
    }
  };

  const handleSelectClick = () => {
    if (disabled) {
      return;
    }
    inputRef.current?.focus();
    open();
  };

  const handleClearClick = (e: React.MouseEvent) => {
    if (disabled) {
      return;
    }
    e.stopPropagation();
    setSearchText("");
    if (selectedValues.length > 0) {
      onValueConditionally?.([]);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    onSearch?.(debouncedSearchText);
  }, [debouncedSearchText]);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    setSearchText(e.target.value);
    open();
  };

  const onAddNewClick = () => {
    if (onAddNew) {
      onAddNew(searchText);
      onClose();
    }
  };

  const someValue = options[0] ?? selectedValues[0];
  const titleFunc = (!!someValue ? getTitleFuncBasedOnOption<T>(someValue, getTitle) : null) as TitleFunc | undefined;
  const keyFunc = (!!someValue ? getKeyFuncBasedOnOption<T>(someValue, getKey) : null) as KeyFunc | undefined;

  const filteredOptions = options.filter(option => {
    if (searchText === "" || !clientFilter) {
      return true;
    }
    const searchLower = searchText.toLowerCase();
    return (
      getValue?.(option)?.toString().toLowerCase().includes(searchLower) ??
      (titleFunc!(option) as any).toString().toLowerCase().includes(searchLower)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    // arrow down?
    const isArrowDownOrUp = e.key === "ArrowDown" || e.key === "ArrowUp";
    if (isArrowDownOrUp) {
      e.preventDefault();
      const selectedOptionIndex = filteredOptions.findIndex(option => keyFunc!(option) === keyFunc!(selectedValues[0]));

      if (e.key === "ArrowDown") {
        const nextOption = filteredOptions[(selectedOptionIndex + 1) % filteredOptions.length];
        handleOptionClick(nextOption);
      } else if (e.key === "ArrowUp") {
        const prevOption = filteredOptions[(selectedOptionIndex - 1 + filteredOptions.length) % filteredOptions.length];
        handleOptionClick(prevOption);
      }
    }
  };

  const onClose = () => {
    close();
    inputRef.current?.focus();
    setSearchText("");
  };

  const hasValue = selectedValues.length > 0;

  return (
    <div ref={selectRef} className={classnames("select-root relative inline-flex h-full select-none flex-col", width)}>
      <div
        onClick={handleSelectClick}
        className={classnames(
          disabled && "cursor-not-allowed bg-neutral-200 opacity-80",
          "select-wrapper flex h-full justify-between rounded border border-solid border-neutral-400 bg-white/80 ring-0 transition-all focus-within:ring-2",
          theme.ring
        )}
      >
        {/* options */}
        <div className={classnames("flex w-full flex-wrap items-center gap-1", sizeTheme)} onClick={handleSelectClick}>
          {selectedValues.map(i => {
            return (
              <span
                key={keyFunc!(i)}
                className={classnames("", theme.name, multiple ? "clickable pill cursor-pointer" : "pl-1")}
                onClick={e => {
                  multiple && handleOptionClick(i, e);
                }}
              >
                {titleFunc!(i)}
              </span>
            );
          })}
          {searchable && (multiple || !hasValue) && (
            <div className="grid grid-cols-[10px_max-content]">
              <input
                ref={inputRef}
                spellCheck={false}
                value={searchText}
                disabled={disabled}
                type="text"
                className={classnames("pointer-events-none absolute col-start-2 row-start-1 min-w-[10px] select-text bg-transparent outline-none", multiple && "max-w-[100px]")}
                onChange={handleSearchTextChange}
                onKeyDown={e => {
                  if (e.key === "Backspace" && searchText === "") {
                    onValueConditionally?.(selectedValues.slice(0, -1));
                  } else {
                    handleKeyDown(e);
                  }
                }}
                tabIndex={0}
              />
              <span className="invisible col-start-2 row-start-1">{searchText}&nbsp;</span>
            </div>
          )}
          <span>&nbsp;</span>
          {!!label && <span className={classnames("select-label pl-2", (hasValue || searchText.length > 0) && "with-value")}>{label}</span>}
        </div>

        {/* indicators (arrow, clear) */}
        <div className="flex items-stretch gap-1">
          {/* search && clear */}
          {loading ? (
            <div className="flex w-full items-center animate-in fade-in-0 ">
              <span className="spinner black"> </span>
            </div>
          ) : (
            <>
              {clearable && selectedValues.length > 0 && (
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

      <div className="relative">
        {isOpen && (
          <div className="modal-wrapper">
            {/* modal backdrop */}
            <div className="fixed inset-0 z-20 h-screen bg-black opacity-0" onClick={onClose} />

            {filteredOptions.length > 0 ? (
              <OptionList
                selected={selectedValues}
                options={filteredOptions}
                getKey={keyFunc!}
                getTitle={titleFunc!}
                onOptionClick={handleOptionClick}
                theme={theme}
              />
            ) : (
              <div
                className={classnames(
                  "select-modal absolute left-0 right-0 z-30 mt-2 cursor-pointer overflow-auto p-1 text-sm italic text-black/70 shadow-xl",
                  "pretty-scrollbar rounded border border-solid bg-white",
                  theme.border
                )}
              >
                {(onAddNew && !hasValue) ? (
                  <Button fullWidth onClick={onAddNewClick}>{translate("add-new")}</Button>
                ) : (
                  <>
                    {debouncedSearchText.length === 0
                      ? translate("select-component.type-to-search")
                      : translate("select-component.no-results-found")}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface OptionListProps<T> {
  selected: T[];
  options: T[];
  getKey: (value: T) => React.Key;
  getTitle: (value: T) => Primitive | JSX.Element;
  onOptionClick: (option: T) => void;
  theme: {
    option: string;
    border: string;
  };
}
const OptionList = <T,>(props: OptionListProps<T>) => {
  const { selected, options, theme, getKey, getTitle, onOptionClick } = props;

  return (
    <div
      className={classnames(
        "select-modal absolute left-0 right-0 z-30 mt-2 cursor-pointer overflow-auto shadow-xl",
        "pretty-scrollbar rounded border border-solid bg-white",
        theme.border
      )}
    >
      {options.map(i => {
        const key = getKey(i);
        const title = getTitle(i);
        const isSelected = selected.some(s => getKey(s) === key);

        return (
          <button
            key={key}
            className={classnames("block w-full p-1 px-2 text-left transition", theme.option, isSelected && "selected")}
            tabIndex={0}
            onClick={() => onOptionClick(i)}
          >
            {title}
          </button>
        );
      })}
      {/* {options.length === 0 && (
        <div className="cursor-default p-1 px-2 text-sm text-neutral-700">
          {debouncedSearchText.length === 0 ? translate("select-component.type-to-search") : translate("select-component.no-results-found")}
        </div>
      )} */}
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
    ring: "ring-error-500/50 focus-within:border-error-500 border-error-500 ring-1",
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
  neutral: {
    name: "neutral",
    border: "border-neutral-500",
    ring: "ring-neutral-500/50 focus-within:border-neutral-500",
    helperColor: "text-neutral-700",
    option: "hocus:bg-neutral-200 selected:bg-neutral-300",
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

// SelectField with dynamic options
type SekectFieldLiveProps<T> = Omit<SelectFieldProps<T>, "options"> & {
  options: (searchText: string) => Promise<T[]>;
  loadAll?: boolean;
};
export const SelectFieldLive = <T,>(props: SekectFieldLiveProps<T>) => {
  const { options: searchFunc, onSearch, loadAll = false, ...rest } = props;
  const [liveOptions, setLiveOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (loadAll) {
    useQuery({
      queryFn: () => searchFunc(""),
      onSuccess: data => {
        setLiveOptions(data);
      },
    });
  }

  const handleSearch = async (searchText: string) => {
    if (loadAll) {
      return;
    }

    if (searchText.length === 0) {
      setLiveOptions([]);
      return;
    }

    setIsLoading(true);
    const newOptions = await searchFunc(searchText);
    setLiveOptions(newOptions);
    setIsLoading(false);
  };

  return <SelectField {...rest} clientFilter={loadAll} options={liveOptions} loading={isLoading} onSearch={onSearch ?? handleSearch} />;
};
