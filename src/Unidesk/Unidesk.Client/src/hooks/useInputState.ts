import { useState } from "react";

export const useInputState = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === "string") {
      setValue(e);
    } else {
      setValue(e.target.value);
    }
  };
  return {
    value,
    onChange,
    setValue,
  };
};
