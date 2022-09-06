import { useState, useEffect } from "react";
import { debounce } from "throttle-debounce";

export const useDebounceState = <T>(initialValue: T, delay: number = 500) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const debouncedSetDebouncedValue = debounce(delay, setDebouncedValue);
    debouncedSetDebouncedValue(value);
    return debouncedSetDebouncedValue.cancel;
  }, [value, delay]);

  return [value, setValue, debouncedValue] as [T, (value: T) => void, T];
};