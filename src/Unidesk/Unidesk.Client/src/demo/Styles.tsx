import { Key, useState } from "react";
import { Button } from "ui/Button";
import { Select } from "ui/Select";
import { SimpleSelect } from "ui/SimpleSelect";
import { Step, Stepper } from "ui/Stepper";
import { TextField } from "ui/TextField";
import { UiColors, UiSizes, UiVariants } from "ui/shared";
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
            {/* <ButtonMui key={++i} color={color[1] as any} size={size[1] as any} variant={variant[1] as any} disabled={disabled[1] as any}>
              {color[0]} {size[0]} {variant[0]}
            </ButtonMui> */}
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
  const [value, setValue] = useState<Key>();
  const [values, setValues] = useState<Key[]>([items[0].key]);

  const colors = "info success warning error".split(" ");
  const variants = "contained outlined text".split(" ");
  const sizes = "sm md lg".split(" ");
  const disabled = [false, true] as any;
  const combinations = [...product([colors, sizes, variants, disabled])] as [UiColors, UiSizes, UiVariants, boolean][];

  return (
    <div className="flex flex-wrap gap-2">
      {combinations.map(([color, size, variant, disabled]) => (
        <>
          <SimpleSelect
            options={items}
            value={values}
            multiple
            onValue={setValues}
            color={color}
            variant={variant}
            size={size}
            disabled={disabled}
          />
          <SimpleSelect options={items} value={value} onValue={setValue} color={color} variant={variant} size={size} disabled={disabled} />
        </>
      ))}
    </div>
  );
};

const TextFields = () => {
  const [value, setValue] = useState("");
  const setValue2 = (e: any) => setValue(e.target.value);
  return (
    <div className="flex flex-col gap-4">
      <TextField loading label="Label" value={value} onChange={setValue2} />
      <TextField label="Label" value={"ascas"} />
      <TextField label="Label" helperColor helperText="debile" value={value} onChange={setValue2} />
      {/* <TextFieldMui label="Label" size="small" /> */}
    </div>
  );
};

const Steppers = () => {
  return (
    <Stepper step={1}>
      <Step label="cascsa">Step 1</Step>
      <h1>Step 2</h1>
      <div>Complex Step 3</div>
    </Stepper>
  );
};

export const Styles = () => {
  return (
    <div className="flex flex-col">
      {/* <Selects /> */}
      {/* <TextFields />
      <Buttons />
      <Steppers />  */}
    </div>
  );
};
export default Styles;
