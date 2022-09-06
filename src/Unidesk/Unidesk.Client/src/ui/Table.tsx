import { getMoment } from "@core/momentProvider";
import moment from "moment";
import { HTMLAttributes, Key, useState } from "react";
import { MdOutlineArrowDownward } from "react-icons/md";

const asSortAscCss = "transition text-base text-gray-600 hover:text-gray-700";
const asSortDescCss = "transition text-base text-gray-600 hover:text-gray-700 rotate-180";

export interface TId {
  id: string;
}
export interface ColumnDefinition<TValue> {
  id: keyof TValue;
  field?: keyof TValue | ((value: TValue) => Key | JSX.Element);
  headerName?: string | JSX.Element;
  style?: React.CSSProperties;
  className?: string;
}

export type TableProps<TValue extends TId> = HTMLAttributes<HTMLDivElement> & {
  rows?: TValue[];
  columns: ColumnDefinition<TValue>[];
  onRowClick?: (value: TValue) => void;
  autoHeight?: boolean;
  fullWidth?: boolean;
  clientSort?: boolean;
  selected?: Key;
};

interface SortBy<TValue extends TId> {
  col: ColumnDefinition<TValue>;
  direction: "asc" | "desc";
}

const applySort = <TValue extends TId>(rows: TValue[], sortBy: SortBy<TValue>): TValue[] => {
  const newRows = rows.sort((a, b) => {
    const aValue = a[sortBy.col.id as keyof TValue];
    const bValue = b[sortBy.col.id as keyof TValue];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return aValue - bValue;
    }
    return 0;
  });
  if (sortBy.direction === "desc") {
    return newRows.reverse();
  }
  return newRows;
};

export const Table = <TValue extends TId>(props: TableProps<TValue>) => {
  const { rows = [], columns, onRowClick, autoHeight, fullWidth = true, clientSort = false, selected, ...rest } = props;
  const fullWidthCss = fullWidth ? "w-full" : "";

  const [sortColumn, setSortColumn] = useState<SortBy<TValue>>();
  const handleHeaderClick = (column: ColumnDefinition<TValue>) => {
    if (clientSort) {
      if (sortColumn?.col.id === column.id) {
        setSortColumn({
          col: column,
          direction: sortColumn.direction === "asc" ? "desc" : "asc",
        });
      } else {
        setSortColumn({
          col: column,
          direction: "asc",
        });
      }
    }
  };

  const sortedRows = !!sortColumn ? applySort(rows, sortColumn) : rows;

  return (
    <div className={`table-wrapper ${fullWidthCss}`}>
      <table className={`table ${fullWidthCss}`}>
        <thead>
          <tr className="table-tr table-header">
            {columns.map(col => {
              const HeaderValue = typeof col.headerName === "function" ? (col.headerName as () => JSX.Element) : null;
              return (
                <th key={col.id as string} onClick={() => handleHeaderClick(col)} className={col.className} style={col.style}>
                  <div className="flex justify-center">
                    {!!HeaderValue ? <HeaderValue /> : <>{col.headerName}</>}
                    {sortColumn?.col.id === col.id && (
                      <MdOutlineArrowDownward className={sortColumn.direction === "asc" ? asSortAscCss : asSortDescCss} />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map(item => (
            <tr
              className={`table-tr table-body ${
                item.id === selected ? "selected" : ""
              } selected:bg-gradient-to-r selected:from-info-500/30`}
              key={item.id}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, index) => (
                <td key={index}>{typeof col.field === "function" ? col.field(item) : <>{item[col.field as keyof TValue]}</>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
