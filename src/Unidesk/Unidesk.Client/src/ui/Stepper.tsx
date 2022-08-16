import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";
import { Button } from "./Button";
import { SimpleComponentProps } from "./shared";

export interface StepProps {
  label: string | React.ReactNode;
  error?: boolean;
}
export const Step = (props: PropsWithChildren<any>) => {
  const { children } = props;
  return <div className="step">{children}</div>;
};

export interface StepperProps extends SimpleComponentProps {
  step: number;
}
export const Stepper = (props: PropsWithChildren<StepperProps>) => {
  const { children, step } = props;
  const items = React.Children.toArray(children);

  return (
    <div className="stepper">
      {items.map((i, j) => {
        const { label, error = false } = (i as any).props as StepProps;
        const className = error ? "bg-error-500" : "bg-info-500";
        return (
          <div className="flex flex-col items-start" key={j}>
            <div className="flex items-center gap-4">
              <div className={`my-1 grid h-8 w-8 place-content-center rounded-full text-white ${className}`}>{j + 1}</div>
              {label}
            </div>

            <div className="ml-4 w-full border-l border-solid border-black pl-5">{j === step && i}</div>
          </div>
        );
      })}
    </div>
  );
};
