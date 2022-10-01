import { PropsWithChildren, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { modalStack } from "./ModalStack";

const getPosition = (rect: DOMRect, shiftX = 0) => {
  return {
    top: `${rect.top + rect.height}px`,
    left: `${rect.left + rect.width - shiftX}px`,
    minWidth: shiftX === 0 ? "auto" : `${shiftX}px`,
  };
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  bgColor?: string;
  withRef: React.RefObject<HTMLDivElement>;
  width?: number;
}
export const ModalMenu = (props: PropsWithChildren<ModalProps>) => {
  const { open, onClose, children, bgColor = "bg-black/30", withRef, width = 200 } = props;
  const [canClose, setCanClose] = useState(false);
  const modalRoot = document.getElementById("modal-root")!;
  const root = document.getElementById("root")!;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalId = modalStack.createNew();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack.isOnTop(modalId)) {
        setCanClose(true);
        onClose();
      }
    };

    const onScroll = (e: Event) => {
      if (menuRef.current && withRef.current) {
        const clientRect = withRef.current.getBoundingClientRect();
        const position = getPosition(clientRect, width);
        menuRef.current.style.top = position.top;
        menuRef.current.style.left = position.left;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", onScroll);

    return () => {
      modalStack.destroy(modalId);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", onScroll);
      if (!modalStack.someModalIsOpen()) {
        root.classList.remove("overflow-hidden", "h-screen");
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

  const clientRect = withRef.current?.getBoundingClientRect();

  if (!open || !clientRect) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={`modal-dismiss fixed inset-0 grid h-screen w-screen ${bgColor}`}
      onMouseUp={handleWrapperClick}
      onMouseDown={handleWrapperClick}
    >
      <div ref={menuRef} style={getPosition(clientRect, width)} className={`absolute`}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
