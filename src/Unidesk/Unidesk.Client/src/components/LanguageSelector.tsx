import { setLocale } from "@core/momentProvider";
import { languages, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext } from "react";

import { Select, SelectOption } from "ui/Select";
import { classnames } from "ui/shared";
import cz from "assets/images/czech-republic.png";
import uk from "assets/images/united-kingdom.png";
import { Button } from "ui/Button";
import { Tooltip } from "utils/Tooltip";

const languageLocaleMapping = {
  cze: "cs",
  eng: "en",
} as const;

export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  const languagesOptions = languages.map(i => ({
    key: i.id,
    label: i.flag,
    value: i.id,
  })) as SelectOption<LanguagesId>[];

  const handleNewLanguage = (language: LanguagesId) => {
    const locale = languageLocaleMapping[language];
    setLocale(locale);
    setLanguage(language);
  };

  return (
    <div>
      {/* switch language */}
      <Tooltip content={language === "cze" ? "English" : "Čeština"}>
        <Button
          text
          className={classnames("h-12 w-12 p-4 text-xs font-bold text-neutral-900 ")}
          onClick={() => setLanguage(language === "cze" ? "eng" : "cze")}
        >
          <img className="w-4" src={language === "cze" ? uk : cz} />
        </Button>
      </Tooltip>
    </div>
    // <Select
    //   sm
    //   width=""
    //   options={languagesOptions}
    //   value={language}
    //   optionRender={option => languages.find(i => i.id === option)?.flag}
    //   onValue={(_, v) => handleNewLanguage(v!)}
    // />
  );
}
