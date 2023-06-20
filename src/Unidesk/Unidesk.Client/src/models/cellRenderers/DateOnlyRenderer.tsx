import { LanguagesId } from "@locales/all";
import { formatDate } from "utils/dateUtils";

export const DateOnlyRenderer = (params: any, key: string, language: LanguagesId) => {
  const value = params[key];
  const dt = value != undefined ? formatDate(value, "short") : "";
  return <span>{dt}</span>;
};
