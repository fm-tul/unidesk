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
  const translate = (value: EnKeys) => RR(value, locale);
  return { translateName, translateVal, translate };
};
