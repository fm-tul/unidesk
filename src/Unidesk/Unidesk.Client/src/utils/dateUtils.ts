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

export const addToDT = (date: string | Date | moment.Moment | undefined | null, amount: number, unit: moment.unitOfTime.DurationConstructor) => {
  if (!date) {
    return null;
  }
  return getMoment(date).add(amount, unit);
};


export const toDTLocalString = (date: string | Date | moment.Moment | undefined | null) => {
  if (!date) {
    return null;
  }
  // something like "2023-03-05T18:17"
  return getMoment(date).format("YYYY-MM-DDTHH:mm");
}

export const toDateLocalString = (date: string | Date | moment.Moment | undefined | null) => {
  if (!date) {
    return null;
  }
  // something like "2023-03-05"
  return getMoment(date).format("YYYY-MM-DD");
}