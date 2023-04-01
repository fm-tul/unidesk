import moment from "moment";
import "moment/dist/locale/en-gb";
import "moment/dist/locale/cs";

export const getMoment = (inp?: any, format?: string) => {
  return moment(inp, format);
};

export const setLocale = (locale: string) => {
  // all future instances of moment should use this locale
  moment.locale(locale);
};
