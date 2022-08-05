import { useContext } from "react";
import { EnKeys, languages } from "./all";
import { LanguageContext } from "./LanguageContext";

export const R = (key: EnKeys, ...args: any) => {
  const context = useContext(LanguageContext);
  const dict = languages.find((i) => i.id === context.language) ?? languages[0];
  const result = dict[key] ?? languages[0][key] ?? key;
  if (typeof result === "string") {
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
