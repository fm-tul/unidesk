import { Collapse } from "components/mui/Collapse";
import React from "react";
import { PropsWithChildren } from "react";

import { Button } from "./Button";
import { SimpleComponentProps } from "./shared";

export interface StepProps {
  label: string | React.ReactNode;
  error?: boolean;
}
export const Step = (props: PropsWithChildren<any>) => {
  const { children } = props;
  return <div className="step w-full">{children}</div>;
};

export interface StepperProps extends SimpleComponentProps {
  step: number;
  setStep?: (step: number) => void;
}
export const Stepper = (props: PropsWithChildren<StepperProps>) => {
  const { children, step, setStep } = props;
  const items = React.Children.toArray(children);

  const handleSetStep = (index: number) => {
    if (step === index) {
      // collapse
      setStep?.(-1);
    } else {
      setStep?.(index);
    }
  };

  return (
    <div className="stepper">
      {items.map((component, index) => {
        const { label, error = false } = (component as any).props as StepProps;
        const className = error ? "bg-error-500" : "bg-info-500";

        return (
          <div className="flex flex-col items-start" key={index}>
            <div className="flex items-center gap-1">
              <div className={`my-1 grid h-8 w-8 place-content-center rounded-full text-white ${className}`}>{index + 1}</div>
              <Button text justify="justify-start" className="min-w-xs" onClick={() => handleSetStep(index)}>
                {label}
              </Button>
            </div>

            <Collapse open={index === step}>
              <div className="flex gap-2 w-full">
                <div className="flex w-8  items-stretch justify-center rounded-full">
                  <div className="my-2 w-2 rounded-full bg-gradient-to-b from-blue-500/10 via-blue-500/40 to-blue-500/10">&nbsp;</div>
                </div>
                <div className="py-4 w-full">{component}</div>
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};
