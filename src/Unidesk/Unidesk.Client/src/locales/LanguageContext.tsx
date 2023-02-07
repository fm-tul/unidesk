import { createContext } from "react";
import { languages } from "./all";
import { LanguagesId } from "./common";

export interface ILanguageContext {
  language: LanguagesId;
  setLanguage: (language: LanguagesId) => void;
}
const defaultContext = {
  language: languages[0].id,
  setLanguage: (language: LanguagesId) => {},
} as ILanguageContext;

export const LanguageContext = createContext(defaultContext);
