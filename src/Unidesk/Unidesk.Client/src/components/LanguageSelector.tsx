import { LanguageContext } from "@locales/LanguageContext";
import { useContext } from "react";

import { classnames } from "ui/shared";
import cz from "assets/images/czech-republic.png";
import uk from "assets/images/united-kingdom.png";
import { Button } from "ui/Button";
import { Tooltip } from "utils/Tooltip";


export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div>
      <Tooltip content={language === "cze" ? "Switch to English" : "Přepnout do Češtiny"}>
        <Button
          text
          className={classnames("h-12 w-12 p-4 text-xs font-bold text-neutral-900 ")}
          onClick={() => setLanguage(language === "cze" ? "eng" : "cze")}
        >
          <img className="w-4" src={language === "cze" ? cz : uk} />
        </Button>
      </Tooltip>
    </div>
  );
}
