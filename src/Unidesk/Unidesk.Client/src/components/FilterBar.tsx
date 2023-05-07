// takes a list of items and renders them as a toolbar

import React from "react";

import { classnames, getSize, getVariant, SizeProps, VariantProps } from "ui/shared";

interface ToolbarProps extends SizeProps, VariantProps {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  type?: "btn-bar" | "btn-group";
  if?: boolean;
}

export const FilterBar: React.FC<ToolbarProps> = props => {
  const { disabled, className = "", children, type = "btn-bar", loading = false } = props;
  const size = getSize(props);
  const variant = getVariant(props);

  if (!(props.if ?? true)) {
    return null;
  }

  const clonedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return React.cloneElement(child as any, {
      variant: (child as any).props.variant ?? variant,
      size: (child as any).props.size ?? size,
      loading: (child as any).props.loading ?? loading,
      disabled: (child as any).props.disabled ?? disabled,
    });
  });

  return <div className={classnames(className, type)}>{clonedChildren}</div>;
};

export const ButtonGroup: React.FC<ToolbarProps> = props => {
  const { disabled, className = "", children, type = "btn-group", loading = false } = props;
  const size = getSize(props);
  const variant = getVariant(props);

  if (!(props.if ?? true)) {
    return null;
  }

  const clonedChildren = recursiveChildMap(children, child => {
    return React.cloneElement(child as any, {
      variant: (child as any).props.variant ?? variant,
      size: (child as any).props.size ?? size,
      loading: (child as any).props.loading ?? loading,
      disabled: (child as any).props.disabled ?? disabled,
    });
  });

  return <div className={classnames(className, type)}>{clonedChildren}</div>;
};

const recursiveChildMap = (children: React.ReactNode, callback: (child: React.ReactNode) => React.ReactNode): any => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    if (React.isValidElement(child)) {
      if (child.type === React.Fragment) {
        return recursiveChildMap(child.props.children, callback);
      }
    }
    return callback(child);
  });
};
