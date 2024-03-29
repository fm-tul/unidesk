import { httpClient } from "@core/init";
import { UserDto } from "@models/UserDto";
import { UserLookupDto } from "@models/UserLookupDto";
import { UserRoleDto } from "@models/UserRoleDto";
import { Key, useEffect, useRef, useState } from "react";

import { FilterBar } from "components/FilterBar";
import { renderUser, renderUserLookup } from "models/cellRenderers/UserRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { Select, SelectOption } from "ui/Select";
import { SelectField, SelectFieldLive } from "ui/SelectField";
import { UiColors, UiSizes, UiVariants } from "ui/shared";
import { Step, Stepper } from "ui/Stepper";
import { TextField } from "ui/TextField";

import { product } from "../utils/product";
import { useCollape } from "hooks/useCollapse";
import { Collapse } from "components/mui/Collapse";
import Timeline from "components/Timeline";

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

  const [users, setUsers] = useState<UserLookupDto[]>([]);
  const findUsers = (keyword: string) => {
    return new Promise<SelectOption<UserLookupDto>[]>(async resolve => {
      const users = await httpClient.users.find({ requestBody: { keyword } });
      resolve(users.items.map(u => ({ key: u.id, value: u, label: u.fullName })));
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
        <Select onValue={setUsers} value={users} options={findUsers} optionRender={renderUserLookup} searchable clearable />
        <Select onValue={setUsers} value={users} options={findUsers} optionRender={renderUserLookup} searchable clearable multiple />
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
    <div>
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
          loading
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
          helperColor={value.length > 2 ? "success" : "info"}
          helperText={value.length < 3 ? "" : "asdcaaaasa"}
          forceTheme
        />
      </div>
      <FormField
        label="csacascsa"
        as={TextField}
        value={value}
        onValue={setValue}
        helperColor={value.length > 2 ? "error" : "warning"}
        helperText={value.length < 3 ? "" : "asdcsa"}
        forceTheme
      />
      <FormField label="csacascsa" as={TextField} value={value} onValue={setValue} />
      <FormField color="info" label="csacascaaaasa" as={TextField} value={value} onValue={setValue} forceTheme={false} />
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

interface ComplexValue {
  id: string;
  name: string;
  key: string;
  value: string;
  label: string;
}
export const Styles = () => {
  const [value, setValue] = useState([1, 2]);
  const options = [0, 1, 2, 3, 4, 5, 99];

  const [complexValue, setComplexValue] = useState<ComplexValue[]>([{ id: "1", name: "Beer", key: "1", value: "Beer", label: "Beer" }]);
  const complexOptions = [
    { id: "1", name: "Beer", key: "1", value: "Beer", label: "Beer" },
    { id: "2", name: "Wine", key: "2", value: "Wine", label: "Wine" },
    { id: "3", name: "Long Cocktail", key: "3", value: "Long Cocktail", label: "Long Cocktail" },
  ];

  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<UserRoleDto[]>([]);

  const handleOptionClick = (option: number) => {
    if (value.includes(option)) {
      setValue(value.filter(v => v !== option));
    } else {
      setValue([...value, option]);
    }
  };

  const handleComplexOptionClick = (option: ComplexValue) => {
    if (complexValue.includes(option)) {
      setComplexValue(complexValue.filter(v => v !== option));
    } else {
      setComplexValue([...complexValue, option]);
    }
  };

  const searchUserRoles = async (search: string) => {
    const userRoles = await httpClient.enums.userRoleGetAll();
    return userRoles.filter(userRole => userRole.name.toLowerCase().includes(search.toLowerCase()));
  };

  useEffect(() => {
    httpClient.enums.userRoleGetAll().then(setUserRoleOptions);
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Select</h1>

      <Timeline items={[
        "Lorem Impsum",
        "Lorem Impsum",
        "Lorem Impsum",
        "Lorem Impsum",
        "Lorem Impsum",
        "Lorem Impsum",
        "Lorem Impsum",
      ]}
      />
      {/* <Test /> */}
      {/* <FilterBar> */}
        {/* <FormField as={SelectField<number>} value={value} options={options} onValue={setValue} multiple searchable /> */}

        {/* <FormField
          as={SelectField<UserRoleDto>}
          value={userRoles}
          options={userRoleOptions}
          onValue={setUserRoles}
          multiple
          clearable
          searchable
        />

        <FormField
          as={SelectFieldLive<UserRoleDto>}
          value={userRoles}
          label="User Roles"
          options={searchUserRoles}
          onValue={setUserRoles}
          multiple
          clearable
          searchable
        /> */}
        {/* 
        <FormField as={Select<any>} value={complexValue} options={complexOptions} onValue={setComplexValue} multiple clearable searchable />

        <FormField
          as={SelectField<ComplexValue>}
          value={complexValue}
          options={complexOptions}
          onValue={setComplexValue}
          multiple
          clearable
          searchable
        />

        <FormField
          as={SelectField<ComplexValue>}
          value={complexValue}
          options={complexOptions}
          onValue={setComplexValue}
          clearable
          searchable
        /> */}
      {/* </FilterBar> */}
    </div>
  );
};
export default Styles;

const Test = () => {
  const [collaped, setCollaped] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  useCollape(divRef.current, collaped);

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setCollaped(!collaped)}>we are now {collaped ? "collapsed" : "expanded"}</Button>

      <Collapse open={!collaped}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo maxime deleniti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, consectetur porro. Nisi euti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, com explicabo dolorum dicta assumenda veniam architecto!

        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo maxime deleniti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, coti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, coti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, consectetur porro. Nisi eum explicabo dolorum dicta assumenda veniam architecto!

        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo maxime deleniti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, consectetur porro.ti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, co Nisi eum explicabo dolorum dicta assumenda veniam architecto!

        Lorem ipsum ti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, codolor sit amet consectetur adipisicing elit. Nemo maxime deleniti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, consectetur porro. Nisi eum explicabo dolorum dicta assumenda veniam architecto!

        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo maxime deleniti voluptate excepturi ipsam, consequatur temporibus
        neque accti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, cousamus optio unde, consectetur porro. Nisi eum explicabo dolorum dicta assumendti voluptate excepturi ipsam, consequatur temporibus
        neque accusamus optio unde, coa veniam architecto!
      </Collapse>
    </div>
  );
};
