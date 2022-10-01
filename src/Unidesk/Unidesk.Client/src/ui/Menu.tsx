import React from "react";
import { MdMenu, MdMoreVert } from "react-icons/md";

import { useOpenClose } from "hooks/useOpenClose";

import { Button } from "./Button";
import { ModalMenu } from "./ModalMenu";

type Element = JSX.Element | false | undefined;

interface MenuProps {
  children: Element[] | Element;
  link?: "more" | "menu" | JSX.Element;
  pop?: "left" | "right";
  minWidth?: number;
  className?: string;
  withModal?: boolean;
  bgColor?: string;
  closeOnButtonClick?: boolean;
}

export const Menu = (props: MenuProps) => {
  const { link = "more", pop = "right", minWidth = 200, withModal = true, closeOnButtonClick=true } = props;
  const className = props.className ?? "bg-white p-2 shadow-xl shadow-black/10 has-backdrop:bg-white/80 has-backdrop:backdrop-blur-md";
  const children = React.Children.toArray(props.children) as JSX.Element[];
  const { isOpen, open, close } = useOpenClose(false);
  const popCss = pop === "left" ? "left-0" : "right-0";
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(!closeOnButtonClick) {
      return;
    }

    const role = (e.target as HTMLDivElement).getAttribute("role");
    // if button or a, close menu
    if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement || role === "button") {
      close();
    }
  };

  return (
    <div className={`menu relative`} ref={menuRef}>
      <Button onClick={open} sm text>
        {link === "more" && <MdMoreVert className="text-xl" />}
        {link === "menu" && <MdMenu className="text-xl" />}
        {link !== "more" && link !== "menu" && link}
      </Button>

      {isOpen && (
        <ModalMenu open={isOpen} onClose={close} withRef={menuRef} width={minWidth} bgColor={withModal ? "bg-black/10" : ""}>
          <div onClick={handleClick} className={`flex flex-col rounded ${className} ${popCss}`}>
            {children}
          </div>
        </ModalMenu>
      )}
    </div>
  );
};
