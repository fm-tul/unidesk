import { LanguagesId } from "@locales/all";

interface MultilangItem {
  id: string;
  nameCze?: string | null;
  nameEng?: string | null;
  name?: string | null;
}

export const toKV = (language?: LanguagesId, items?: MultilangItem[] | null, multilang = true) => {
  if (!items || items.length === 0) {
    return [];
  }

  if (multilang) {
    return items.map(i => ({ key: i.id, value: language === "cze" ? i.nameCze! : i.nameEng! }));
  }
  return items.map(i => ({ key: i.id, value: i.name! }));
};
