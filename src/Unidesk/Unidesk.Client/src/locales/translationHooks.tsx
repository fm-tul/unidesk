import ReactMarkdown from "react-markdown";
import { EnKeys } from "./all";
import { LanguagesId } from "./common";
import { RR } from "./R";

type EntityWithName = { nameCze: string; nameEng: string };
export const translateNameFor = (entity: EntityWithName | undefined, locale: LanguagesId) => {
  return locale === "eng" ? entity?.nameEng : entity?.nameCze;
};

type EntityWithVal = { cze: string; eng: string };
export const translateValFor = (value: EntityWithVal | undefined, locale: LanguagesId) => {
  return locale === "cze" ? value?.cze : value?.eng;
};

export const useTranslation = (locale: LanguagesId) => {
  const translateName = (value: EntityWithName | undefined) => translateNameFor(value, locale);
  const translateVal = (value: EntityWithVal | undefined) => translateValFor(value, locale);
  const translate: TranslateFunc = (value: EnKeys, ...args: any) => RR(value, locale, ...args);
  const translateMD: TranslateFunc = (value: EnKeys, ...args: any) => <ReactMarkdown children={RR(value, locale, ...args) as string} />;
  return { translateName, translateVal, translate, translateMD };
};


export type TranslateFunc = (value: EnKeys, ...args: any) => string | JSX.Element;