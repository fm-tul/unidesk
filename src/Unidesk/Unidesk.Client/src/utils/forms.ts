import { Severity } from "@models/Severity";
import { UiColors } from "ui/shared";

export type ErrorObj = { message: string; severity?: Severity };
export type ErrorValues<T> = {
  propertyName: keyof T;
  severity: Severity;
  errorMessage: string;
}[]

export const severityToColor = (severity?: Severity): UiColors|undefined => {
  switch (severity) {
    case Severity._0:
      return "error";
    case Severity._1:
      return "warning";
    case Severity._2:
      return "info";
    default:
      return undefined;
  }
};

export const getErrorValue = <T>(errors: ErrorValues<T>, key: keyof T) => {
  const errorItem = errors.find((i) => i.propertyName === key || i.propertyName.toString().toLowerCase() === key.toString().toLowerCase());
  const errorText = errorItem?.errorMessage;
  const errorSeverity = errorItem?.severity;
  const errorColor = severityToColor(errorSeverity);

  return {
    hasError: !!errorText,
    errorText,
    errorColor,
    errorSeverity,
  };
};
