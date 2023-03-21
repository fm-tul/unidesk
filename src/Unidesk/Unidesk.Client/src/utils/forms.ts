import { Severity } from "@models/Severity";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { useState } from "react";
import { TId } from "ui/Select";
import { HelperProps, UiColors } from "ui/shared";
import { ZodError, ZodObject, ZodType } from "zod/lib";
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

export const extractErrorsFromZod = <T>(error: ZodError): FormErrors<T> => {
  const errors = error.issues ?? [];
  const errorDictionary: FormErrors<T> = {};
  errors.forEach(error => {
    const propertyName = toCamelCase(error.path[0].toString()) as keyof T;
    if (propertyName) {
      errorDictionary[propertyName] = {
        severity: Severity._0,
        errorMessage: error.message ?? "Unknown error",
      };
    }
  });
  return errorDictionary;
};

export const getPropsFactory = <T>(dto: T, setter: (value: T) => void, errors?: FormErrors<T>, validateKey?: ((key: keyof T, value: any) => void)) => {
  const getPropsText = <TValue extends keyof T>(key: keyof T) => {
    const errorValue = errors?.[key];
    const baseDict = {
      value: dto[key] as TValue,
      onChange: (e: any) => {
        const value = e?.target?.value ?? e;
        setter({ ...dto, [key]: value });
      },
      onBlur: (e: any) => {
        validateKey?.(key, dto[key]);
      }
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
  const getPropsSelect = <TValue extends keyof T>(key: keyof T, isArray = false) => {
    const errorValue = errors?.[key];
    const baseDict = {
      value: dto[key] as any,
      onValue: (value: any) => {
        setter({ ...dto, [key]: isArray ? value : value[0] });
      },
      onBlur: (e: any) => {
        validateKey?.(key, dto[key]);
      }
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
  return { getPropsText, getPropsSelect };
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


export const useDto = <T>(initialValues: Partial<T>, schema?: ZodObject<any>, autoValidate = false) => {
  const [dto, setDto] = useState<Partial<T>|undefined>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const validateSafe = (item: Partial<T>) => schema?.safeParse(item) ?? { success: true };

  const validateAndSetErrors = (item: Partial<T>) => {
    const result = validateSafe(item);
    if (result.success) {
      setErrors({});
    } else {
      setErrors(extractErrorsFromZod(result.error));
    }
  };

  const updateDto = (item: Partial<T>|undefined) => {
    if (autoValidate) {
      validateAndSetErrors(item ?? {});
    }
    setDto(item);
  }

  const validateKey = (key: keyof T, value: unknown) => {
    const validator = schema?.shape[key] as ZodType<any, any> | undefined;
    if (validator) {
      const result = validator.safeParse(value);
      if (result.success) {
        setErrors({ ...errors, [key]: undefined });
      } else {
        setErrors({ ...errors, [key]: { severity: Severity._0, errorMessage: result.error.issues[0]?.message } });
      }
    }
  }

  const { getPropsText, getPropsSelect } = getPropsFactory(dto!, updateDto, errors, validateKey);

  return {
    dto,
    setDto: updateDto,
    errors,
    setErrors,
    getPropsText,
    getPropsSelect,
    validateSafe,
    validateAndSetErrors,
  }
}