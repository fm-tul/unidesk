import { useContext } from "react";
import { EnKeys, languages } from "./all";
import { LanguagesId } from "./common";
import { ILanguageContext, LanguageContext } from "./LanguageContext";

export const R = (key: EnKeys, ...args: any) => {
  const context = useContext(LanguageContext);
  const dict = languages.find(i => i.id === context.language) ?? languages[0];
  const result = (dict[key] ?? languages[0][key] ?? key) as string|((...args: any) => string);
  if (typeof result === "string" || typeof result === "object") {
    return result;
  }
  return result.apply(null, args);
};

interface TranslateProps {
  value: EnKeys;
  args?: any[];
  className?: string;
}
export const Translate = (props: TranslateProps) => {
  const { value, args = [], className = "" } = props;
  const result = R(value, args);
  return <span className={className}>{result}</span>;
};

export const RR = (key: EnKeys, context: ILanguageContext | LanguagesId, ...args: any) => {
  const lang = typeof context === "string" ? context : context.language;
  const dict = languages.find(i => i.id === lang) ?? languages[0];
  const result = (dict[key] ?? languages[0][key] ?? key) as string|((...args: any) => string);
  if (typeof result === "string" || typeof result === "object") {
    return result;
  }
  return result.apply(null, args);
};
