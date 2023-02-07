import { Severity } from "@models/Severity";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { HelperProps, UiColors } from "ui/shared";
import { toCamelCase } from "./stringUtils";

export type ErrorObj = { message: string; severity?: Severity };
export type ErrorValues<T> = {
  propertyName: keyof T;
  severity: Severity;
  errorMessage: string;
}[];

export const severityToColor = (severity?: Severity): UiColors | undefined => {
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
  const errorItem = errors.find(i => i.propertyName === key || i.propertyName.toString().toLowerCase() === key.toString().toLowerCase());
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

export interface FormError {
  severity: Severity;
  errorMessage: string;
}
export type FormErrors<T> = {
  [key in keyof T]?: FormError;
};

export const extractErrors = <T>(response: SimpleJsonResponse): FormErrors<T> => {
  const errors = response.errors ?? [];
  const errorDictionary: FormErrors<T> = {};
  errors.forEach(error => {
    const propertyName = toCamelCase(error.propertyName ?? "") as keyof T;
    if (propertyName) {
      errorDictionary[propertyName] = {
        severity: error.severity ?? Severity._0,
        errorMessage: error.errorMessage ?? "Unknown error",
      };
    }
  });
  return errorDictionary;
};

export const getPropsFactory = <T>(dto: T, setter: (value: T) => void, errors?: FormErrors<T>) => {
  const getProps = <TValue extends keyof T>(key: keyof T) => {
    const errorValue = errors?.[key];
    const baseDict = {
      value: dto[key] as TValue,
      onChange: (e: any) => {
        const value = e?.target?.value ?? e;
        setter({ ...dto, [key]: value });
      },
    };
    if (!errorValue) {
      return baseDict;
    }
    return {
      ...baseDict,
      helperText: errorValue.errorMessage,
      helperColor: severityToColor(errorValue.severity),
    };
  };
  return getProps;
};

/* usage:
const [dto, setDto] = useState<Dto>(...);
const [errors, setErrors] = useState<FormErrors<Dto>>();


const updateTeamMutation = useMutation((dto: TeamDto) => httpClient.team.upsert({ requestBody: dto }), {
  onSuccess: () => {
    toast.success("Team saved");
  },
  onError: (e: any) => {
    setErrors(extractErrors(e));
  }
});
*/
