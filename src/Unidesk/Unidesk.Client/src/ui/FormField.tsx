import { Collapse } from "components/mui/Collapse";
import { classnames, getHelperColor, HelperProps } from "./shared";

interface FormFieldProps<T> extends HelperProps {
  as: React.ComponentType<T>;
  forceTheme?: boolean;
  classNameField?: string;
}

export const FormField = <T,>(props: FormFieldProps<T> & T) => {
  const { as: Component, forceTheme = true, classNameField } = props;
  const { helperText, helperColor, helperClassName = "pl-2" } = getHelperColor(props);
  const theme = THEME[helperColor ?? "neutral"];

  const className = classnames((props as any).className, "h-full");
  const propsToPass = forceTheme ? { ...props, className, color: helperColor } : { ...props, className };

  return (
    <div className={classnames("inline-flex flex-col gap-1", classNameField)}>
      <div className="h-full min-h-[36px]">
        <Component {...propsToPass} />
      </div>

      <Collapse open={!!helperText} className={classnames("text-sm", theme, helperClassName)}>
        {helperText}
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
