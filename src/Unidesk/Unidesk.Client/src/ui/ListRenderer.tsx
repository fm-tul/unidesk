import React, { Key, ReactNode } from "react";

import { UiColors } from "./shared";

interface ListRendererProps<T> {
  items?: ListItem<T>[];
  color?: UiColors;
  asFragment?: boolean;
  onClick?: (item: ListItem<T>, event: React.MouseEvent<HTMLElement>) => void;
  commas?: boolean;
  clickable?: boolean;
  className?: string;
}
export interface ListItem<T> {
  key: string;
  value: T;
  label: ReactNode;
}

export const ListRenderer = <T,>(props: ListRendererProps<T>) => {
  const { items = [], color = "info", asFragment, onClick, commas, clickable = true, className = "" } = props;

  const body = items.map((item, j) => (
    <React.Fragment key={item.key}>
      <span
        className={`pill ${className} ${color} ${clickable ? "clickable" : ""}`}
        onClick={e => clickable && onClick?.(item, e)}
      >
        {item.label}
      </span>
      <>{commas && j < items.length - 1 ? ", " : ""}</>
    </React.Fragment>
  ));

  if (asFragment) {
    return <>{body}</>;
  }

  return <span className="inline-flex flex-wrap gap-1">{body}</span>;
};
