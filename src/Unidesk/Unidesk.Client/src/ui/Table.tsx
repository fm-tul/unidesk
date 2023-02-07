import React from "react";
import { HTMLAttributes, Key, useState } from "react";
import { MdOutlineArrowDownward } from "react-icons/md";

import { classnames } from "./shared";

const asSortAscCss = "transition text-base text-gray-600 hover:text-gray-700";
const asSortDescCss = "transition text-base text-gray-600 hover:text-gray-700 rotate-180";

export interface TId {
  id: string;
}
export interface ColumnDefinition<TValue> {
  id: string | keyof TValue;
  field?: keyof TValue | ((value: TValue) => Key | JSX.Element);
  headerName?: string | JSX.Element;
  style?: React.CSSProperties;
  className?: string;
  sortFunc?: (a: TValue, b: TValue) => number;
  sortable?: boolean;
  visible?: boolean;
}

export type TableProps<TValue> = HTMLAttributes<HTMLDivElement> & {
  rows?: TValue[];
  columns: ColumnDefinition<TValue>[];
  onRowClick?: (value: TValue) => void;
  autoHeight?: boolean;
  fullWidth?: boolean;
  clientSort?: boolean;
  selected?: Key;
  idGetter?: (value: TValue) => string;
  EmptyContent?: JSX.Element;
};

interface SortBy<TValue> {
  col: ColumnDefinition<TValue>;
  direction: "asc" | "desc";
}

const applySort = <TValue,>(rows: TValue[], sortBy: SortBy<TValue>): TValue[] => {
  const newRows = rows.sort((a, b) => {
    if (sortBy.col.sortFunc) {
      return sortBy.col.sortFunc(a, b);
    }

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

const defaultIdGetter = <TValue,>(value: TValue) => (value as any).id ?? JSON.stringify(value);

export const Table = <TValue, >(props: TableProps<TValue>) => {
  const { rows = [], columns, onRowClick, autoHeight, fullWidth = true, clientSort = false, selected, className, idGetter=defaultIdGetter, EmptyContent, ...rest } = props;
  const fullWidthCss = fullWidth ? "w-full" : "";
  const visibleColumns = columns.filter(i => i.visible !== false);

  const [sortColumn, setSortColumn] = useState<SortBy<TValue>>();
  const handleHeaderClick = (column: ColumnDefinition<TValue>) => {
    if (clientSort) {
      if (column.sortable === false) {
        return;
      }
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
    <div className={classnames("table-wrapper", fullWidthCss, className)}>
      <table className={`table ${fullWidthCss}`}>
        <thead>
          <tr className="table-tr table-header">
            {visibleColumns.map(col => {
              const HeaderValue = typeof col.headerName === "function" ? (col.headerName as () => JSX.Element) : null;
              return (
                <th key={col.id as string} onClick={() => handleHeaderClick(col)} className={col.className} style={col.style}>
                  <div className="flex">
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
                idGetter(item) === selected ? "selected" : ""
              } selected:bg-gradient-to-r selected:from-info-500/30`}
              key={idGetter(item)}
              onClick={() => onRowClick?.(item)}
            >
              {visibleColumns.map((col, index) => (
                <td key={index}>{typeof col.field === "function" ? col.field(item) : <>{item[col.field as keyof TValue]}</>}</td>
              ))}
            </tr>
          ))}
          
          {!!EmptyContent && sortedRows.length === 0 && (
            <tr className="table-tr table-body">
              <td colSpan={visibleColumns.length}>{EmptyContent}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// just like Table but we are rendering more complex items, which can be interacted with and rendered in a custom way
export interface ItemListProps<TValue extends TId> extends TableProps<TValue> {
  renderItem: (value: TValue) => JSX.Element;
  listClassName?: string;
}
export const ItemList = <TValue extends TId>(props: ItemListProps<TValue>) => {
  const { rows = [], columns, onRowClick, autoHeight, fullWidth = true, clientSort = false, selected, className, ...rest } = props;
  const { renderItem, listClassName } = props;
  const fullWidthCss = fullWidth ? "w-full" : "";
  const visibleColumns = columns.filter(i => i.visible !== false);

  const [sortColumn, setSortColumn] = useState<SortBy<TValue>>();
  const handleHeaderClick = (column: ColumnDefinition<TValue>) => {
    if (clientSort) {
      if (column.sortable === false) {
        return;
      }
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
    <div className={classnames("table-wrapper", fullWidthCss, className)}>
      <div className={classnames("table", fullWidthCss)}>
        <div className="table-tr table-header flow">
          {visibleColumns.map(col => {
            const HeaderValue = typeof col.headerName === "function" ? (col.headerName as () => JSX.Element) : null;
            const { width, ...colStyle } = col.style ?? {};
            return (
              <div
                key={col.id as string}
                onClick={() => handleHeaderClick(col)}
                className={classnames("th", col.className)}
                style={colStyle}
              >
                <div className="flex">
                  {!!HeaderValue ? <HeaderValue /> : <>{col.headerName}</>}
                  {sortColumn?.col.id === col.id && (
                    <MdOutlineArrowDownward className={sortColumn.direction === "asc" ? asSortAscCss : asSortDescCss} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={classnames("flex flex-col", listClassName)}>
          {sortedRows.map(i => {
            return (
              <div
                key={i.id}
                onClick={e => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === "A" || target.tagName === "BUTTON") {
                    return;
                  }
                  return onRowClick?.(i);
                }}
                role="button"
                className={classnames("table-body cursor-pointer", i.id === selected ?? "selected")}
              >
                {renderItem(i)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
