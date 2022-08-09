import { LanguagesId } from "@locales/all";
import { KeyValue } from "./KeyValue";

interface MultilangItem {
  id: string;
  nameCze?: string | null;
  nameEng?: string | null;
  name?: string | null;
  code?: string | null;
}

export const toKV = (language?: LanguagesId, items?: MultilangItem[] | null, multilang = true) => {
  if (!items || items.length === 0) {
    return [] as KeyValue[];
  }

  if (multilang) {
    return items.map(i => ({ key: i.id, value: language === "cze" ? i.nameCze! : i.nameEng! })) as KeyValue[];
  }
  return items.map(i => ({ key: i.id, value: i.name! })) as KeyValue[];
};

export const toKVWithCode = (language?: LanguagesId, items?: MultilangItem[] | null) => {
  return (items ?? []).map(i => ({ key: i.id, value: `${i.code} - ${language === "cze" ? i.nameCze : i.nameEng}` })) as KeyValue[];
};
