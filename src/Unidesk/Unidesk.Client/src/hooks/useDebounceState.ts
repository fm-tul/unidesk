import { useEffect, useState } from "react";
import { debounce } from "throttle-debounce";

import { useLocalStorage } from "./useLocalStorage";

export const useDebounceState = <T>(initialValue: T, delay: number = 500) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const debouncedSetDebouncedValue = debounce(delay, setDebouncedValue);
    debouncedSetDebouncedValue(value);
    return debouncedSetDebouncedValue.cancel;
  }, [value, delay]);

  return [value, setValue, debouncedValue, setDebouncedValue] as [T, (value: T) => void, T, (value: T) => void];
};


export const useDebounceLocalStorageState = <T>(key: string, initialValue: T, delay: number = 500) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const debouncedSetDebouncedValue = debounce(delay, setDebouncedValue);
    debouncedSetDebouncedValue(value);
    return debouncedSetDebouncedValue.cancel;
  }, [value, delay]);

  return [value, setValue, debouncedValue, setDebouncedValue] as [T, (value: T) => void, T, (value: T) => void];
}