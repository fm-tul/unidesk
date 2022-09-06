import { extractErrorMessage } from "@core/errors";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { HTMLAttributes, PropsWithChildren, useContext } from "react";

import { classnames } from "ui/shared";

interface LoadingWrapperProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  message?: EnKeys;
  error: unknown;
  size?: string | number;
}
export const LoadingWrapper = (props: PropsWithChildren<LoadingWrapperProps>) => {
  const language = useContext(LanguageContext);
  const { className, size = "60px", isLoading, message = "loading", error, ...rest } = props;

  // try to extract error message from error object
  const errorDto = extractErrorMessage(error);
  const errorMessage = errorDto?.message;

  if (errorDto) {
    console.debug(errorDto);
  }

  return (
    <div {...rest} className={classnames(className, "relative fade min-h-xs", isLoading && "pointer-events-none")}>
        {errorMessage && (
            <span className="text-red-500">
                <code className="text-md break-words">
                    {RR("error-occurred", language)}: {errorMessage}
                </code>
            </span>
        )}
      {props.children}

      {/* overlay */}
      {isLoading && (
        <div className="transiton absolute inset-0 grid animate-delay-fade-in place-items-center bg-white/40 duration-500">
          <div className="grid place-items-center">
            <span style={{ "--size": size } as any} className="spinner-colors"></span>
            {RR(message, language)}
          </div>
        </div>
      )}
    </div>
  );
};
