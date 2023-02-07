import { getMoment } from "@core/momentProvider";

export type DateFormatTypes = "smart" | "short" | "long" | "full";
export const formatDate = (date: string | Date | moment.Moment, format: DateFormatTypes = "smart") => {
  const momentDate = getMoment(date);
  switch (format) {
    case "full":
      return momentDate.format();
    case "long":
      return momentDate.format("LLLL");
    case "short":
      return momentDate.format("L");
    case "smart":
      const sameYear = momentDate.year() === getMoment().year();
      if (sameYear) {
        return momentDate.format("DD/MM");
      }
      return momentDate.format("L");
  }
};
