import { setLocale } from "@core/momentProvider";
import { languages, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext } from "react";

import { Select, SelectOption } from "ui/Select";

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
    <Select
      sm
      options={languagesOptions}
      value={language}
      optionRender={option => languages.find(i => i.id === option)?.flag}
      onValue={(_, v) => handleNewLanguage(v!)}
    />
  );
}
