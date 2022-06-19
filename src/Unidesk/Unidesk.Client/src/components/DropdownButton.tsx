import { useState } from "react";

interface DropdownButtonProps<T> {
    required?: boolean;
    defaultText?: string;
    items: T[];
    onChange: (item: T) => void;
    getLabel: (item: T) => string;
    getId: (item: T) => string | number;
}
export function DropdownButton<T>(props: DropdownButtonProps<T>) {
    const { items, onChange, getLabel, getId, required=false, defaultText="Select Item" } = props;
    const [selected, setSelected] = useState<T | undefined>(required ? items[0] : undefined);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = () => {
        setMenuOpen(!menuOpen);
    }

    const handleChange = (item: T) => {
        setSelected(item);
        onChange(item);
        setMenuOpen(false);
    }


    return (
        <div className="dropdown-button relative">
            <div className="btn-group">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleClick}>
                    {selected == undefined ? defaultText : getLabel(selected)}
                </button>
                {!required &&
                    <button className="btn">
                        x
                    </button>
                }
            </div>
            {menuOpen && (<div className="flex flex-col absolute bg-white min-w-[100px] shadow-xl z-10 [&>*]:p-1" aria-labelledby="dropdownMenuButton">
                {items.map(item => (
                    <button key={getId(item)} className="bg-white hover:bg-gray-100" type="button" onClick={() => handleChange(item)}>
                        {getLabel(item)}
                    </button>
                ))}
            </div>)}

        </div>
    );
}