import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { Collapse } from "components/mui/Collapse";
import { useContext, useState } from "react";
import { classnames, getHelperColor, HelperProps } from "./shared";

interface FormFieldProps<T> extends HelperProps {
  as: React.ComponentType<T>;
  forceTheme?: boolean;
  classNameField?: string;
}

export const FormField = <T,>(props: FormFieldProps<T> & T) => {
  const {language} = useContext(LanguageContext);
  const { as: Component, forceTheme = true, classNameField } = props;
  const { helperText, helperColor, helperClassName = "pl-2" } = getHelperColor(props);
  let theme = THEME[helperColor ?? "neutral"];
  let helperTextToDisplay = helperText;
  let helperColorToDisplay = helperColor;
  

  const className = classnames((props as any).className, "h-full");
  const propsToPass = forceTheme ? { ...props, className, color: helperColorToDisplay } : { ...props, className };

  return (
    <div className={classnames("inline-flex flex-col gap-1", classNameField)}>
      <div className="h-full min-h-[36px]">
        <Component {...propsToPass} />
      </div>

      <Collapse open={!!helperTextToDisplay} className={classnames("text-sm", theme, helperClassName)}>
        {helperTextToDisplay}
      </Collapse>
    </div>
  );
};

const THEME = {
  info: "text-info-500",
  success: "text-success-500",
  warning: "text-warning-500",
  error: "text-error-500",
  neutral: "text-neutral-500",
};
