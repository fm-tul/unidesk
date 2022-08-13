import { Button as ButtonMui, MenuItem, Select as SelectMui, TextField as TextFieldMui } from "@mui/material";
import { useState } from "react";
import { Button } from "ui/Button";
import { Select } from "ui/Select";
import { TextField } from "ui/TextField";
import { product } from "../utils/product";

const Buttons = () => {
  const colors = [
    ["info", "info"],
    ["success", "success"],
    ["warning", "warning"],
    ["error", "error"],
  ];
  const sizes = [
    ["sm", "small"],
    ["md", "medium"],
    ["lg", "large"],
  ];

  const variants = [
    ["contained", "contained"],
    ["outlined", "outlined"],
    ["text", "text"],
  ];

  const disabled = [
    [undefined, undefined],
    ["disabled", true],
  ];

  const combinations = [...product([colors, sizes, variants, disabled])];
  console.log(combinations);
  const getProps = (color: any, size: any, variant: any, disabled: any) => {
    let result = {} as any;
    result[color] = true;
    result[size] = true;
    result[variant] = true;
    if (disabled) result[disabled] = true;
    return result;
  };

  let i = 0;
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        {combinations.map(([color, size, variant, disabled]) => (
          <>
            <Button key={++i} {...getProps(color[0], size[0], variant[0], disabled[0])}>
              {" "}
              {color[0]} {size[0]} {variant[0]}{" "}
            </Button>
            <ButtonMui key={++i} color={color[1] as any} size={size[1] as any} variant={variant[1] as any} disabled={disabled[1] as any}>
              {color[0]} {size[0]} {variant[0]}
            </ButtonMui>
          </>
        ))}
      </div>
    </div>
  );
};

const Selects = () => {
  const items = [
    { key: 1, value: "Beer" },
    { key: 2, value: "Wine" },
    { key: 3, value: "Long Cocktail" },
  ];
  let longItems = Array.from({ length: 100 }, (_, i) => ({ key: i, value: `Item ${i}` }));

  return (
    <div className="flex">
      <Select options={items} onChange={console.log} success />
      <SelectMui className="min-w-xs" label="cascsa" title="cascsa" variant="filled" value={"2"}>
        {items.map(item => (
          <MenuItem key={item.key} value={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </SelectMui>
    </div>
  );
};

const TextFields = () => {
  const [value, setValue] = useState("");
  const setValue2 = (e: any) => setValue(e.target.value);
  return (
    <div className="flex flex-col gap-4">
      <TextField label="Label" value={value} onChange={setValue2} />
      <TextField label="Label" value={"ascas"} />
      <TextField label="Label" error helperText="debile" value={value} onChange={setValue2} />
      <TextFieldMui label="Label" size="small" />
    </div>
  );
};
export const Styles = () => {
  return (
    <div className="flex flex-col">
      {/* <Selects /> */}
      <TextFields />
      {/* <Buttons /> */}
    </div>
  );
};
export default Styles;
