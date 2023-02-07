import { CSSProperties, useEffect, useState } from "react";

const classNames = "max-h-0 overflow-hidden motion-safe:transition-all";
export const useCollape = (element: HTMLElement | null, open: boolean) => {
  const [canBeHidden, setCanBeHidden] = useState(true);

  useEffect(() => {
    if (!element) {
      return;
    }
    if (open) {
      setCanBeHidden(false);
      element.style.maxHeight = `${element.scrollHeight}px`;
    } else {
      element.style.maxHeight = "0px";
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setCanBeHidden(true);
      }
    }

    // listen for animation end
    const handleAnimationEnd = (e: any) => {
      if (!open && e.target === element && e.propertyName === "max-height") {
        setCanBeHidden(true);
      }
    };
    element.addEventListener("transitionend", handleAnimationEnd);
    return () => {
      element.removeEventListener("transitionend", handleAnimationEnd);
    };
  }, [element, open]);

  return [classNames, canBeHidden];
};
