import { useContext } from "react";
import { LanguageContext } from "../locales/LanguageContext";
import { MenuItem, Select } from "@mui/material";
import { languages } from "../locales/all";

export function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <Select size="small" value={language} onChange={(e) => setLanguage(e.target.value)}>
      {languages.map((lang) => (
        <MenuItem key={lang.id} value={lang.id}>
          {lang.flag}
        </MenuItem>
      ))}
    </Select>
  );
}
