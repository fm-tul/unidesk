import { createContext } from "react";
import { languages, LanguagesId } from "./all";

export interface ILanguageContext {
  language: LanguagesId;
  setLanguage: (language: LanguagesId) => void;
}
const defaultContext = {
  language: languages[0].id,
  setLanguage: (language: LanguagesId) => {},
} as ILanguageContext;

export const LanguageContext = createContext(defaultContext);
