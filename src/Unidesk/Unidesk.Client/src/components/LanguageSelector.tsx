import { useContext } from "react";
import { LanguageContext } from "@locales/LanguageContext";
import { languages, LanguagesId } from "@locales/all";
import { SimpleSelect } from "ui/SimpleSelect";
import moment from "moment";
import { setLocale } from "@core/momentProvider";

const languageLocaleMapping = {
  cze: "cs",
  eng: "en",
} as const;

export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleNewLanguage = (language: LanguagesId) => {
    const locale = languageLocaleMapping[language];
    setLocale(locale);
    setLanguage(language);
  };

  return (
    <SimpleSelect
      options={languages}
      sm
      fullWidth={false}
      value={language}
      keyProp="id"
      valueProp="flag"
      onValue={i => handleNewLanguage(i as any)}
    />
  );
}
