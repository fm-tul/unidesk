import { PropsWithChildren, useState } from "react";
import ReactDOM from "react-dom";
import { getSize, SizeProps } from "./shared";

export interface ModalProps {
  open: boolean;
  onClose: () => void;

  x?: "left" | "center" | "right";
  y?: "top" | "center" | "bottom";
  fullWidth?: boolean;
  fullHeight?: boolean;
  width?: "sm" | "md" | "lg" | "xl" | "container";
  height?: "sm" | "md" | "lg" | "xl" | "auto";
  className?: string;
}

export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const {
    open,
    onClose,
    width = "container",
    height = "auto",
    children,
    fullWidth = true,
    x = "center",
    y = "center",
    className = "bg-white rounded-sm",
  } = props;
  const xCss = X_CSS[x];
  const yCss = Y_CSS[y];

  const widthCss = WIDTH_CSS[width];
  const heightCss = HEIGHT_CSS[height];

  const fullWidthCss = fullWidth ? "w-full" : "";
  const modalRoot = document.getElementById("modal-root")!;

  const [canClose, setCanClose] = useState(false);

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("modal-dismiss")) {
      if (e.type === "mousedown") {
        setCanClose(true);
      } else if (e.type === "mouseup" && canClose) {
        e.stopPropagation();
        onClose();
      }
    } else {
      setCanClose(false);
    }
  };

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={`modal-dismiss z-100 fixed inset-0 grid h-screen w-screen bg-black/30 ${yCss} ${xCss}`} onMouseUp={handleWrapperClick} onMouseDown={handleWrapperClick}>
      <div className={`modal-dismiss p-8 pretty-scrollbar ${widthCss} ${fullWidthCss}`}>
        <div className={`relative max-h-[calc(100vh-64px)] overflow-auto shadow-md ${className} ${heightCss} ${widthCss}`}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};

const Y_CSS = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

const X_CSS = {
  left: "justify-items-start",
  center: "justify-items-center",
  right: "justify-items-end",
};

const WIDTH_CSS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  container: "container",
};

const HEIGHT_CSS = {
  sm: "h-sm",
  md: "h-md",
  lg: "h-lg",
  xl: "h-xl",
  auto: "",
};
