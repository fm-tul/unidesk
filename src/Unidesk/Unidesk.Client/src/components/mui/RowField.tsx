import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { useContext, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Button } from "ui/Button";
import { Collapse } from "./Collapse";
import { Tooltip } from "utils/Tooltip";
import { BsAsterisk } from "react-icons/bs";

interface RowFieldProps {
  title: EnKeys;
  description?: EnKeys;
  Field: JSX.Element;
  required?: boolean;
}

export const RowField = (props: RowFieldProps) => {
  const { title, description, Field, required = false } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [showDescription, setShowDescription] = useState(false);
  const hasDescription = !!description;

  return (
    <div className="grid grid-cols-[1fr_2fr] items-start rounded-lg p-4 transition-colors focus-within:bg-blue-400/10 hocus:bg-black/5">
      <div>
        <div className="flow font-bold">
          {hasDescription && (
            <Button sm text success>
              <MdInfoOutline className="text-base" onClick={() => setShowDescription(!showDescription)} />
            </Button>
          )}
          {required ? (
            <Tooltip content={translate("form.required")}>
              <div className="group flex items-baseline">
                {translate(title)}
                <BsAsterisk className="w-2 text-red-500 transition-all duration-500 group-hover:w-3 group-hover:rotate-[60deg]" />
              </div>
            </Tooltip>
          ) : (
            translate(title)
          )}
        </div>

        {hasDescription && (
          <Collapse open={showDescription} className="help-text max-w-xs">
            {translate(description)}
          </Collapse>
        )}
      </div>
      {Field}
    </div>
  );
};
