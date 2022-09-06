import { en } from "./languages/english";
import { cs } from "./languages/czech";

export type EnKeys = keyof typeof en;
type TranslationOrFunction = string | ((args: any) => string);
export type ILocale = {
  [key in EnKeys]?: TranslationOrFunction;
} & { id: string; flag: string; language: string };

export const languages = [en, cs];
export type LanguagesId = "eng" | "cze";
export const locales = ["eng", "cze"];