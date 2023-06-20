import { classnames } from "ui/shared";
import { useCollapse } from "react-collapsed";

interface CollapeProps {
  children: any[] | any;
  open: boolean;
  className?: string;
  width?: string;
}
export const Collapse = (props: CollapeProps) => {
  const { children, open, className, width = "w-full" } = props;
  const { getCollapseProps } = useCollapse({
    isExpanded: open,
    hasDisabledAnimation: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });

  return (
    <section {...getCollapseProps()}>
      <div className={classnames(className, width)}>{children}</div>
    </section>
  );
};
