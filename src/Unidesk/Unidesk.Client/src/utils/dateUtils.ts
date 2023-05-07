import { getMoment } from "@core/momentProvider";
import moment from "moment";

export type DateFormatTypes = "smart" | "short" | "long" | "full";
export type DateLike = string | Date | moment.Moment;
export const formatDate = (date: string | Date | moment.Moment, format: DateFormatTypes = "smart") => {
  const momentDate = getMoment(date);
  switch (format) {
    case "full":
      return momentDate.format();
    case "long":
      return momentDate.format("YYYY-MM-DD HH:mm:ss");
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

export const calculateDuration = (start: DateLike|undefined|null, end: DateLike|undefined|null) => {
  if (!start || !end) {
    return null;
  }
  const startMoment = getMoment(start);
  const endMoment = getMoment(end);

  if (!startMoment.isValid() || !endMoment.isValid()) {
    return null;
  }

  const duration = moment.duration(endMoment.diff(startMoment));
  return duration;
}

export const countWorkdays = (startDate: moment.Moment, endDate: moment.Moment): number => {
  let workdays = 0;
  const totalDays = endDate.diff(startDate, 'days');

  for (let i = 0; i <= totalDays; i++) {
    const currentDay = startDate.clone().add(i, 'days');
    const isoWeekday = currentDay.isoWeekday();
    if (isoWeekday >= 1 && isoWeekday <= 5) {
      workdays++;
    }
  }

  return workdays;
};

export const formatDateRelative = (date: DateLike, now: DateLike = new Date()) => {
  const momentDate = getMoment(date);
  const momentNow = getMoment(now);
  return momentDate.from(momentNow);
}