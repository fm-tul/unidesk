import { UserDto } from "@models/UserDto";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { debounce } from "throttle-debounce";

import { useOpenClose } from "hooks/useOpenClose";

import { Button } from "./Button";
import { ListItem, ListRenderer } from "./ListRenderer";
import { TId } from "./Table";
import { TextField } from "./TextField";

export interface SelectResourceProps<T extends TId> {
  find: (value: string) => Promise<T[]>;
  label?: ReactNode;
  value?: ListItem<T>[];
  onChange?: (key?: Key | Key[] | null, value?: (T | undefined) | (T | undefined)[] | null) => void;
  valueProp?: (value: T) => ReactNode;
  multiple?: true | undefined;
}

export const SelectResource = <T extends TId>(props: SelectResourceProps<T>) => {
  const { find, label, onChange, valueProp, multiple, value = [] } = props;
  const [search, setSearch] = useState("");
  const { open, close, isOpen } = useOpenClose(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<T[]>([]);

  const fireFind = async (value: string) => {
    if (value.length < 2) {
      return;
    }

    setLoading(true);
    const items = await find(value);
    setOptions(items);
    open();
    setLoading(false);
  };

  const handleOptionClick = (option: T) => {
    let newKeys = value.map(v => v.key);
    let newValues = value.map(v => v.value);

    if (newKeys.includes(option.id)) {
      newKeys = newKeys.filter(i => i !== option.id);
      newValues = newValues.filter(i => i.id !== option.id);
    } else {
      newKeys.push(option.id);
      newValues.push(option);
    }
    onChange?.(newKeys, newValues);
  };

  const reset = () => {
    onChange?.(null);
    close();
  };

  const debouncedSearch = useCallback(debounce(500, fireFind), []);

  useEffect(() => {
    debouncedSearch(search);
  }, [search]);

  return (
    <div>
      {/* {label && (
        <div>
          <Button text sm onClick={reset}>
            <MdEdit className="text-base" />
          </Button>
          <span>{label}</span>
        </div>
      )} */}

      <div className="flex flex-wrap items-center gap-2 bg-white">
        <ListRenderer asFragment items={value} onClick={i => handleOptionClick(i.value)} />
        <TextField
          className="min-w-xs grow ring ring-neutral-300"
          fullWidth={false}
          sm
          loading={loading}
          value={search}
          onValue={setSearch}
          onEnter={open}
          onEscape={close}
        />
      </div>

      {isOpen && (
        <>
          {multiple === true ? (
            <>
              <div className="pretty-scrollbar absolute flex max-h-xs flex-col overflow-auto bg-white shadow-lg">
                {options.map(i => (
                  <Button sm text key={i.id} className={`text-sm normal-case ${value.find(j => j.key === i.id) ? "selected" : ""}`} justify="justify-start" onClick={() => handleOptionClick(i)}>
                    {valueProp?.(i)}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
