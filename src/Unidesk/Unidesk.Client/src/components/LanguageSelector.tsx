import { useContext } from "react";
import { LanguageContext } from "@locales/LanguageContext";
import { languages } from "@locales/all";
import { Select } from "ui/Select";

export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <Select
      options={languages}
      sm
      fullWidth={false}
      value={language}
      keyGetter={i => i.id}
      valueGetter={i => i.flag}
      onChange={i => setLanguage((i as any).id)}
    />
  );
}
