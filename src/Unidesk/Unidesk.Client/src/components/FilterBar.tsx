// takes a list of items and renders them as a toolbar

import React from "react";

import { classnames, getSize, getVariant, SizeProps, VariantProps } from "ui/shared";

interface ToolbarProps extends SizeProps, VariantProps {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  type?: "btn-bar" | "btn-group";
}

export const FilterBar: React.FC<ToolbarProps> = props => {
  const { disabled, className = "", children, type = "btn-bar", loading=false } = props;
  const size = getSize(props);
  const variant = getVariant(props);

  const clonedChildren = React.Children.map(children, child => {
    return React.cloneElement(child as any, {
      variant: (child as any).props.variant ?? variant,
      size: (child as any).props.size ?? size,
      loading: (child as any).props.loading ?? loading,
      disabled,
    });
  });

  return <div className={classnames(className, type)}>{clonedChildren}</div>;
};
