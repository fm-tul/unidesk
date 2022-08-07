import { useState } from "react";

export const useStepper = (maxSteps: number) => {
  const [step, setStepRaw] = useState(0);
  const hasNextStep = step < maxSteps;
  const hasPrevStep = step > 0;

  const setStep = (step: number) => {
    setStepRaw(Math.min(Math.max(0, step), maxSteps));
  };

  const nextStep = () => {
    if (hasNextStep) {
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    if (hasPrevStep) {
      setStep(step - 1);
    }
  };
  return {
    step,
    hasNextStep,
    hasPrevStep,
    nextStep,
    prevStep,
    setStep,
  };
};
