import { Button, TextField, InputLabel, IconButton, InputBase, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ArrayFieldProps {
  label: string;
  value: string[];
  setValue: (value: string[]) => void;
  minValues?: number;
}
export const ArrayField = (props: ArrayFieldProps) => {
  const { label, value, setValue, minValues = 3 } = props;
  const valueWithLimit = value.length < minValues ? [...value, ...Array(minValues - value.length).fill("")] : value;
  const addItem = () => setValue([...value, ""]);
  const removeItem = (index: number) => setValue(value.filter((_, i) => i !== index));
  const updateItem = (index: number, v: string) => {
    const newValue = [...valueWithLimit];
    newValue[index] = v;
    setValue(newValue);
  };

  return (
    <div className="w-full">
      <InputLabel>{label}</InputLabel>
      <div className="flex flex-col flex-wrap gap-1">
        {valueWithLimit.map((value, index) => (
          <div className="flex items-stretch gap-1 rounded bg-white/75 py-2 px-4" key={index}>
            <div className="grid place-items-center text-gray-500">
              <span>{index + 1}.</span>
            </div>
            <span className="my-2 ml-1 border-l border-gray-300 p-1"></span>
            <InputBase value={value} onChange={e => updateItem(index, e.target.value)} fullWidth size="small" multiline minRows={1} />
            <span className="my-2 ml-1 border-r border-gray-300 p-1"></span>
            <div className="grid place-items-center">
              <IconButton onClick={() => removeItem(index)} size="small" color="error" tabIndex={-1}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem}>Add item</Button>
    </div>
  );
};
