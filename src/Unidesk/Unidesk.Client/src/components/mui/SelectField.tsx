import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps, TextFieldProps } from "@mui/material";
import { R } from "@locales/R";
import { EnKeys } from "@locales/all";

interface KeyValueItem {
  key: string;
  value: string;
}
interface SelectFieldProps {
  props: SelectProps & TextFieldProps;
  items: KeyValueItem[];
  emptyItem?: KeyValueItem;
  label: string;
  renderValue?: ((value: unknown) => React.ReactNode) | undefined;
}
export const SelectField = (props: SelectFieldProps) => {
  const { props: selectProps, items, emptyItem, label, renderValue } = props;
  const { helperText, ...selectPropsSafe } = selectProps;

  return (
    <FormControl variant="outlined" className="w-full" size="small" error={selectProps.error}>
      <InputLabel>{label}</InputLabel>
      <Select {...selectPropsSafe} label={label} renderValue={renderValue}>
        {!!emptyItem && <MenuItem value={emptyItem.key}>{emptyItem.value}</MenuItem>}
        {items.map(item => (
          <MenuItem key={item.key} value={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
      {!!selectProps.helperText && <FormHelperText>{R(selectProps.helperText as EnKeys)}</FormHelperText>}
    </FormControl>
  );
};

export const ChipDualLangRenderer = (items: KeyValueItem[]) => {
  return (selected: any) => {
    return (
      <Box className="flex flex-wrap gap-1">
        {selected.map((value: any) => (
          <Chip key={value} label={items!.find(t => t.key === value)?.value} size="small" />
        ))}
      </Box>
    );
  };
};
