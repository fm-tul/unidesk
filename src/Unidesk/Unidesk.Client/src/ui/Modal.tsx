import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { modalStack } from "./ModalStack";
import { classnames } from "./shared";

export interface ModalProps {
  open: boolean;
  cannotBeClosed?: boolean;
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
  const { children, open, onClose, cannotBeClosed = false, width = "container", height = "auto", fullWidth } = props;
  const [ref, setRef] = useState<HTMLDialogElement | null>(null);

  const widthCss = WIDTH_CSS[width];
  const heightCss = HEIGHT_CSS[height];

  const fullWidthCss = fullWidth ? "w-full" : "";

  const close = useCallback(() => {
    if (ref) {
      ref.close();
    }
    onClose();
  }, [ref]);

  const onClosing = useCallback(() => {
    if (!cannotBeClosed) {
      close();
    }
  }, [onClose]);

  // Eventlistener: trigger onclose when click outside
  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!cannotBeClosed && e.target === ref) {
      close();
    }
  };

  useEffect(() => {
    if (ref && open) {
      try {
        ref.showModal();
      } catch (e) {
        console.log(e);
      }
    }
  }, [ref, open]);

  return (
    <dialog
      ref={setRef}
      onClose={onClosing}
      onCancel={onClosing}
      onClick={onClick}
      className={classnames("modal rounded p-0", !open && "modal--closing", widthCss, heightCss, fullWidthCss)}
    >
      <div onClick={e => e.stopPropagation()} className="rounded-sm bg-white p-4">
        {children}
      </div>
    </dialog>
  );
};

export const Modal2 = (props: PropsWithChildren<ModalProps>) => {
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

  useEffect(() => {
    const modalId = modalStack.createNew();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack.isOnTop(modalId)) {
        setCanClose(true);
        onClose();
      }
    };

    document.getElementById("root")!.classList.add("overflow-hidden", "h-screen");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      modalStack.destroy(modalId);
      document.removeEventListener("keydown", handleKeyDown);
      if (!modalStack.someModalIsOpen()) {
        document.getElementById("root")!.classList.remove("overflow-hidden", "h-screen");
      }
    };
  }, []);

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
    <div
      className={`modal-dismiss z-100 fixed inset-0 grid h-screen w-screen bg-black/30 ${yCss} ${xCss}`}
      onMouseUp={handleWrapperClick}
      onMouseDown={handleWrapperClick}
    >
      <div className={`modal-dismiss pretty-scrollbar p-8 ${widthCss} ${fullWidthCss}`}>
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
