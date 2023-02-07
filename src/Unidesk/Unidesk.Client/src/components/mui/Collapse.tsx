import { useCollape } from "hooks/useCollapse";
import { useState } from "react";
import { classnames } from "ui/shared";

interface CollapeProps {
  children: any[] | any;
  open: boolean;
  className?: string;
  mountIfClosed?: boolean;
}
export const Collapse = (props: CollapeProps) => {
  const { children, open, className, mountIfClosed = false } = props;
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [extraClassNames, canBeHidden] = useCollape(ref, open);

  if (!mountIfClosed && canBeHidden && !open) {
    return null;
  }

  return (
    <div ref={setRef} className={classnames(extraClassNames, className)}>
      {children}
    </div>
  );
};
