import { useEffect, useState } from "react";
import { classnames } from "ui/shared";

const visibleClassName = "opacity-100";
const hiddenClassName = "opacity-0";

export interface FadeProps {
  visible: boolean;
}

export const Fade = (props: React.PropsWithChildren<FadeProps>) => {
  const { visible, children } = props;
  const className = visible ? visibleClassName : hiddenClassName;
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [canBeHidden, setCanBeHidden] = useState(!visible);

  useEffect(() => {
    if (ref) {
      const element = ref;

      if (visible) {
        setCanBeHidden(false);
      }

      // listen for animation end
      const handleAnimationEnd = (e: any) => {
        if (e.propertyName === "opacity" && !visible) {
          setCanBeHidden(true);
        }
      };
      element.addEventListener("transitionend", handleAnimationEnd);
      return () => {
        element.removeEventListener("transitionend", handleAnimationEnd);
      };
    }
  }, [visible]);

  return (
    <div ref={setRef} className={classnames("transition-all", className)}>
      {canBeHidden && !visible ? null : children}
    </div>
  );
};
