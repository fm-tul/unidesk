// takes a list of items and renders them as a toolbar

import React from "react";

import { getSize, getVariant, SizeProps, VariantProps } from "ui/shared";

interface ToolbarProps extends SizeProps, VariantProps {
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const FilterBar: React.FC<ToolbarProps> = (props) => {
    const { disabled, className="", children } = props;
    const size = getSize(props);
    const variant = getVariant(props);

    const clonedChildren = React.Children.map(children, (child) => (
        React.cloneElement(child as any, { disabled, size, variant })
    ));

    return <div className={`btn-bar ${className}`}>{clonedChildren}</div>;
}