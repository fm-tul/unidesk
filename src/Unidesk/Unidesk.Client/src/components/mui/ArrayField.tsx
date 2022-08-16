import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button } from "ui/Button";
import { TextField } from "ui/TextField";

interface ArrayFieldProps {
  label: string;
  value: string[];
  setValue: (value: string[]) => void;
  minValues?: number;
  maxValues?: number;
}
export const ArrayField = (props: ArrayFieldProps) => {
  const { label, value, setValue, minValues = 3, maxValues = 20 } = props;
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
      <span>{label}</span>
      <div className="flex flex-col flex-wrap gap-1">
        {valueWithLimit.map((value, index) => (
          <div className="flex items-stretch gap-1 rounded bg-white/75 py-2 px-4" key={index}>
            <div className="grid place-items-center text-gray-500">
              <span>{index + 1}.</span>
            </div>
            <span className="my-2 ml-1 border-l border-gray-300 p-1"></span>
            <TextArea
              placeholder={`${label} ${index + 1}`}
              value={value}
              onChange={e => updateItem(index, e.target.value)}
              rows={1}
              maxRows={3}
              className="w-full resize-none bg-transparent pt-2 text-sm outline-none"
            />
            <span className="my-2 ml-1 border-r border-gray-300 p-1"></span>
            <div className="grid place-items-center">
              <Button className="rounded-full" text onClick={() => removeItem(index)} sm error tabIndex={-1}>
                <MdDelete className="text-base" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button text disabled={value.length >= maxValues} onClick={addItem}>
        Add item
      </Button>
    </div>
  );
};

interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  maxRows?: number;
}
export const TextArea = (props: TextAreaProps) => {
  const { maxRows = 3, rows = 1, className = "", ...rest } = props;
  const [nrows, setRows] = useState(rows);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // on enter, add a new line
    if (e.key === "Enter" && nrows < maxRows) {
      setRows(nrows + 1);
    }
  };
  return <textarea onKeyDown={handleKeyDown} rows={nrows} className={`resize-none ${className}`} {...rest} />;
};
