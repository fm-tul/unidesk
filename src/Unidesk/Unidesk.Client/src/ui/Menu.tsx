import { useOpenClose } from "hooks/useOpenClose";
import React from "react";
import { MdMoreVert, MdMenu } from "react-icons/md";
import { Button } from "./Button";

interface MenuProps {
  children: JSX.Element | JSX.Element[];
  icon?: "more" | "menu" | JSX.Element;
  pop?: "left" | "right";
  minWidth?: number | string;
  className?: string;
}

export const Menu = (props: MenuProps) => {
  const { icon = "more", pop = "right", minWidth = 200, className = "relative" } = props;
  const children = React.Children.toArray(props.children) as JSX.Element[];
  const { isOpen, open, close, toggle } = useOpenClose(false);
  const popCss = pop === "left" ? "left-0" : "right-0";

  return (
    <div className={`menu ${className}`}>
      <Button onClick={toggle} sm text>
        {icon === "more" && <MdMoreVert className="text-xl" />}
        {icon === "menu" && <MdMenu className="text-xl" />}
        {icon !== "more" && icon !== "menu" && icon}
      </Button>
      {isOpen && (
        <>
          {/* clickable area which closes modal */}
          <div onClick={close} className="fixed inset-0 z-10 bg-black/10" />

          {/* actual modal */}
          <div
            style={{ minWidth }}
            onClick={close}
            className={`absolute z-10 flex flex-col rounded  bg-white p-2 shadow-xl shadow-black/10 has-backdrop:bg-white/70 has-backdrop:backdrop-blur-md ${popCss}`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};
