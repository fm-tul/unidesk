import React from "react";
import { classnames } from "ui/shared";

export interface TimelineProps {
  items: React.ReactNode[];
  activeIndex?: number;

  className?: string;
  doneClassName?: string;
  activeClassName?: string;
  futureClassName?: string;
}
export const Timeline = (props: TimelineProps) => {
  const {
    items,
    activeIndex = -1,
    className,
    doneClassName = "bg-blue-500",
    activeClassName = "bg-blue-800",
    futureClassName = "bg-gray-200",
  } = props;
  const gridTemplateColumns = items.map(() => `1fr auto 1fr`).join(" ");

  return (
    <div>
      <div className={classnames("grid items-center", className)} style={{ gridTemplateColumns }}>
        {/* first row are the lines and dots */}
        {items.map((_, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const isFuture = index > activeIndex;
          const lineLClassName = classnames(
            "h-1 select-none rounded-r transition-all",
            index <= activeIndex && doneClassName,
            isFuture && futureClassName
          );
          const lineRClassName = classnames(
            "h-1 select-none rounded-l transition-all",
            isDone && doneClassName,
            index >= activeIndex && futureClassName
          );

          const dotClassName = classnames(
            "col-start-1 row-start-1 w-4 h-4 rounded-full select-none transition-all",
            isDone && doneClassName,
            isActive && activeClassName,
            isFuture && futureClassName
          );

          return (
            <React.Fragment key={index}>
              {isFirst ? <div /> : <div className={lineLClassName}>&nbsp;</div>}
              <div className="relative mx-2 grid">
                <div className={classnames(dotClassName)} />
                {isActive && <div className={classnames(dotClassName, "animate-ping opacity-50 duration-2000")} />}
              </div>
              {isLast ? <div /> : <div className={lineRClassName}>&nbsp;</div>}
            </React.Fragment>
          );
        })}

        {/* second row is the content */}
        {items.map((item, index) => {
          return (
            <div key={index} className="col-span-3 text-center">
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
