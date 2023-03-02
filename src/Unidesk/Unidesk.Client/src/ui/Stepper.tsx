import { Collapse } from "components/mui/Collapse";
import React, { useEffect, useMemo } from "react";
import { PropsWithChildren } from "react";

import { Button } from "./Button";
import { classnames, SimpleComponentProps } from "./shared";

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
  setStep?: (step: number) => void;
}
export const Stepper = (props: PropsWithChildren<StepperProps>) => {
  const { children, step, setStep } = props;
  const items = React.Children.toArray(children);

  return (
    <div className="stepper">
      {items.map((component, index) => {
        const { label, error = false } = (component as any).props as StepProps;
        const className = error ? "bg-error-500" : "bg-info-500";

        return (
          <div className="flex flex-col items-start" key={index}>
            <div className="flex items-center gap-1">
              <div className={`my-1 grid h-8 w-8 place-content-center rounded-full text-white ${className}`}>{index + 1}</div>
              <Button text justify="justify-start" className="min-w-xs" onClick={() => setStep?.(index)}>
                {label}
              </Button>
            </div>

            <Collapse open={index === step}>
              <div className="flex gap-2">
                <div className="flex w-8  items-stretch justify-center rounded-full">
                  <div className="rounded-full w-2 my-2 from-blue-500/10 via-blue-500/40 to-blue-500/10 bg-gradient-to-b">&nbsp;</div>
                </div>
                <div className="py-4">
                  {component}
                </div>
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};
