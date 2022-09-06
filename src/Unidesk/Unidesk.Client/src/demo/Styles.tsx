import { httpClient } from "@core/init";
import { UserDto } from "@models/UserDto";
import { Key, useState } from "react";

import { renderUser } from "models/cellRenderers/UserRenderer";
import { Button } from "ui/Button";
import { Select, SelectOption } from "ui/Select";
import { UiColors, UiSizes, UiVariants } from "ui/shared";
import { Step, Stepper } from "ui/Stepper";
import { TextField } from "ui/TextField";

import { product } from "../utils/product";
import { FormField } from "ui/FormField";

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
  const items2 = [
    { key: "1", value: "Beer", label: "Beer" },
    { key: "2", value: "Wine", label: "Wine" },
    { key: "3", value: "Long Cocktail", label: "Long Cocktail" },
  ];
  let longItems = Array.from({ length: 100 }, (_, i) => ({ key: i.toString(), value: `Item ${i}`, label: `Item ${i}` }));
  const [value, setValue] = useState<Key>();
  const [values, setValues] = useState<Key[]>([items2[0].key]);
  const [items, setItems] = useState<string[]>([]);

  const colors = "info success warning error".split(" ");
  const variants = "contained outlined text".split(" ");
  const sizes = "sm md lg".split(" ");
  const disabled = [false, true] as any;
  const combinations = true ? [] : ([...product([colors, sizes, variants, disabled])] as [UiColors, UiSizes, UiVariants, boolean][]);

  const [users, setUsers] = useState<UserDto[]>([]);
  const findUsers = (keyword: string) => {
    return new Promise<SelectOption<UserDto>[]>(async resolve => {
      const users = await httpClient.users.find({ requestBody: { keyword } });
      resolve(users.items.map(u => ({ key: u.id, value: u, label: u.firstName + " " + u.lastName })));
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {/* {combinations.map(([color, size, variant, disabled]) => (
          <>
            <SimpleSelect
              options={items2}
              value={values}
              multiple
              onValue={setValues}
              color={color}
              variant={variant}
              size={size}
              disabled={disabled}
              fullWidth={false}
            />
            <SimpleSelect
              options={items2}
              fullWidth={false}
              value={value}
              onValue={setValue}
              color={color}
              variant={variant}
              size={size}
              disabled={disabled}
            />
          </>
        ))} */}

        {/* <SimpleSelect className="min-w-xs" options={items} value={values} multiple onValue={setValues} fullWidth={false} /> */}
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        {/* <Select onValue={setItems} value={items} options={longItems} searchable clearable helperColor={items.length > 2} helperText={items.length === 0 ? "" : "asdcsa"}  />
        <Select onValue={setItems} value={items} options={longItems} searchable clearable multiple helperColor={items.length > 2 ? "success" : "warning"} helperText={items.length === 0 ? "" : "asdcsa"}  /> */}
        <hr />
        <Select onValue={setUsers} value={users} options={findUsers} optionRender={renderUser} searchable clearable />
        <Select onValue={setUsers} value={users} options={findUsers} optionRender={renderUser} searchable clearable multiple />
      </div>
    </div>
  );
};

const FormFields = () => {
  const items2 = [
    { key: "1", value: "Beer", label: "Beer" },
    { key: "2", value: "Wine", label: "Wine" },
    { key: "3", value: "Long Cocktail", label: "Long Cocktail" },
  ];

  const [value, setValue] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);

  return (
    <div className="flex items-stretch gap-2">
      <FormField
        label="csacascsa"
        as={TextField}
        value={value}
        onValue={setValue}
        helperColor={value.length > 2 ? "success" : "warning"}
        helperText={value.length < 3 ? "" : "asdcsa"}
        forceTheme
      />
      <FormField
        as={Button}
        sm
        helperColor={value.length > 2 ? "error" : undefined}
        helperText={value.length < 3 ? "" : "asdcsa"}
        forceTheme
      >
        Click me
      </FormField>
      <FormField
        width="min-w-xs"
        as={Select<string>}
        options={items2}
        value={values}
        onMultiValue={setValues}
        multiple
        helperColor={value.length > 2 ? "success" : "warning"}
        helperText={value.length < 3 ? "" : "asdcsa"}
        forceTheme
      />
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
    <div className="">
      <FormFields />
      {/* <Selects /> */}
      {/* <TextFields />
      <Buttons />
      <Steppers />  */}
    </div>
  );
};
export default Styles;
