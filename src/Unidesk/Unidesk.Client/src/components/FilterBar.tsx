// takes a list of items and renders them as a toolbar

import { ButtonGroup } from "@mui/material";
import React from "react";

interface ToolbarProps {
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    variant?: "btn-bar" | "btn-group" | ""
}

export const FilterBar: React.FC<ToolbarProps> = (props) => {
    const { disabled, className="", children, variant="btn-bar" } = props;

    const clonedChildren = React.Children.map(children, (child) => (
        React.cloneElement(child as any, { disabled })
    ));

    return (
        <ButtonGroup disabled={disabled} className={`${variant} ${className}`}>
            {clonedChildren}
        </ButtonGroup>
    );
}