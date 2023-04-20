import { useCollape } from "hooks/useCollapse";
import { useState } from "react";
import { classnames } from "ui/shared";

interface CollapeProps {
  children: any[] | any;
  open: boolean;
  className?: string;
  mountIfClosed?: boolean;
  width?: string;
}
export const Collapse = (props: CollapeProps) => {
  const { children, open, className, mountIfClosed = false, width="w-full" } = props;
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [extraClassNames, canBeHidden, fullyOpen] = useCollape(ref, open);

  if (!mountIfClosed && canBeHidden && !open) {
    return null;
  }

  // console.log("Collapse", open, extraClassNames, canBeHidden, fullyOpen);
  // const extraClassNames = open ? "" : "hidden";
  return (
    <div ref={setRef} className={classnames(extraClassNames, className, width)}>
      {children}
    </div>
  );
};
