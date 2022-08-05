import { createContext } from "react";
import { languages } from "./all";

const defaultContext = {
  language: languages[0].id,
  setLanguage: (language: string) => {},
};

export const LanguageContext = createContext(defaultContext);
