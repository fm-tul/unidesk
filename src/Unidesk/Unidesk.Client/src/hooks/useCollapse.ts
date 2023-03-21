import { CSSProperties, useEffect, useState } from "react";

const classNamesCollapsing = "max-h-0 w-full overflow-hidden motion-safe:transition-all";
const classNamesOpen = "max-h-0 w-full motion-safe:transition-all";
export const useCollape = (element: HTMLElement | null, open: boolean) => {
  const [canBeHidden, setCanBeHidden] = useState(true);
  const [fullyOpen, setFullyOpen] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      setCanBeHidden(false);
      setFullyOpen(false);
      element.style.maxHeight = `${element.scrollHeight}px`;

      if (prefersReducedMotion) {
        setFullyOpen(true);
      }
    } else {
      setFullyOpen(false);
      element.style.maxHeight = "0px";

      if (prefersReducedMotion) {
        setCanBeHidden(true);
      }
    }

    // listen for animation end
    const handleAnimationEnd = (e: any) => {
      if (!open && e.target === element && e.propertyName === "max-height") {
        setCanBeHidden(true);
      }
      if (open && e.target === element && e.propertyName === "max-height") {
        setFullyOpen(true);
      }
    };
    element.addEventListener("transitionend", handleAnimationEnd);
    return () => {
      element.removeEventListener("transitionend", handleAnimationEnd);
    };
  }, [element, open]);

  return [fullyOpen ? classNamesOpen : classNamesCollapsing, canBeHidden, fullyOpen && open];
};
