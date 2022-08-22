import { ReactNode, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { MdClear, MdKeyboardArrowDown } from "react-icons/md";
import { debounce } from "throttle-debounce";

import { useInputState } from "hooks/useInputState";
import { useOpenClose } from "hooks/useOpenClose";

import { ListRenderer } from "./ListRenderer";
import { classnames, getHelperColor, getHelperProps, HelperProps, UiColors } from "./shared";

export interface SelectOption<T> {
  key: string;
  value: T;
  label: ReactNode;
}
interface Select2BaseProps<T> extends HelperProps {
  options: SelectOption<T>[] | ((value: string) => Promise<SelectOption<T>[]>);

  loading?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;

  width?: string;
  height?: string;

  modalHeight?: string;
  value?: SelectOption<T>[];
  onValue?: (value: SelectOption<T>[]) => void;
}

interface Select2Props<T> extends Select2BaseProps<T> {}
export const Select2 = <T,>(props: Select2Props<T>) => {
  const { options, loading, disabled, searchable, clearable, multiple } = props;
  const { value = [], onValue } = props;
  const { helperText, helperColor } = getHelperColor(props);
  const theme = THEME[(helperColor || "info") as keyof typeof THEME];

  const valueSafe = multiple ? value : value.length > 0 ? [value[0]] : [];
  const hasValue = valueSafe.length > 0;
  const isAsync = typeof options === "function";

  const { width } = props;
  const { modalHeight = "max-h-xs" } = props;

  const { value: searchText, onChange: setSearchText } = useInputState("");
  const { isOpen, close, toggle, open } = useOpenClose();
  const [searching, setSearching] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<SelectOption<T>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectClick = () => {
    console.log("handleSelectClick");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    open();
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e);
    open();
  };

  const handleOptionClickMultiple = (option: SelectOption<T>) => {
    // remove the option from the list
    if (valueSafe.map(i => i.key).includes(option.key)) {
      onValue?.([...valueSafe.filter(i => i.key !== option.key)]);
    } else {
      // add the option to the list
      onValue?.([...valueSafe, option]);
    }
  };

  const handleOptionClickSingle = (option: SelectOption<T>) => {
    onValue?.([option]);
  };

  const handleOptionClick = (option: SelectOption<T>) => {
    if (multiple) {
      handleOptionClickMultiple(option);
    } else {
      handleOptionClickSingle(option);
      close();
    }
    setSearchText("");
  };

  const handleClearClick = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    if (searchText.length > 0) {
      setSearchText("");
    } else {
      onValue?.([]);
    }
  };

  const handleSelectedOptionClick = (option: SelectOption<T>, e: React.MouseEvent<any>) => {
    e.stopPropagation();

    if (multiple) {
      handleOptionClickMultiple(option);
    } else {
      handleOptionClickSingle(option);
      close();
    }
    setSearchText("");
  };

  const doSearch = async (searchText: string) => {
    if (isAsync && searchText.length > 1) {
      setSearching(true);
      const newOptions = await options(searchText);
      setAsyncOptions(newOptions);
      setSearching(false);
    }
  };
  const debouncedSearch = useCallback(debounce(500, doSearch), []);

  const optionKeyUp = (option: SelectOption<T>, e: React.KeyboardEvent<any>) => {
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
    : options.filter(o => o.label?.toString().toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className={classnames("select-root relative select-none", width, disabled && "pointer-events-none")}>
      {/* main flex wrapper */}
      <div
        tabIndex={0}
        className={classnames("select-wrapper flex justify-between rounded border border-solid border-neutral-400 ring-0 transition-all focus-within:ring-2", theme.ring)}
      >
        {/* items (selected, input, others) */}
        <div className="flex w-full flex-wrap items-center gap-1 p-2" onClick={handleSelectClick}>
          {/* selected items */}
          {hasValue && (
            <>
              {multiple && <ListRenderer asFragment items={valueSafe} onClick={handleSelectedOptionClick} color={theme.name as UiColors} />}
              {!multiple && <span>{valueSafe[0].label}</span>}
            </>
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
              {clearable && !disabled && (searchText || value.length > 0) && (
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
        <>
          {/* modal backdrop */}
          <div className="fixed inset-0 opacity-0" onClick={close} />

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
                  value.map(j => j.key).includes(i.key) && "selected"
                )}
                tabIndex={0}
                onClick={e => handleOptionClick(i)}
                onKeyUp={e => optionKeyUp(i, e)}
              >
                {i.label}
              </div>
            ))}
            {filteredOptions.length === 0 && <div className="cursor-default p-1 px-2 text-sm text-neutral-700">No results</div>}
          </div>
        </>
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
