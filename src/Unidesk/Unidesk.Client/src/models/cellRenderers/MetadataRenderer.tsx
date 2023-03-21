import { LanguagesId } from "@locales/all";
import { TrackedEntityDto } from "@models/TrackedEntityDto";
import moment from "moment";
import { classnames } from "ui/shared";
import { DateFormatTypes, formatDate } from "utils/dateUtils";

export const MetadataRenderer = <T extends TrackedEntityDto>(params: T, language: LanguagesId) => {
  const { created, modified } = params;

  const { className: createdClassName, formatedDate: createdDate } = getDateProps(created);
  const { className: modifiedClassName, formatedDate: modifiedDate } = getDateProps(modified);

  return (
    <div className="flex items-end text-xxs">
      <span className={createdClassName}>{createdDate}</span>
      <span className="px-1">|</span>
      <span className={modifiedClassName}>{modifiedDate}</span>
    </div>
  );
};

export const CreatedRenderer = <T extends TrackedEntityDto>(params: T, language: LanguagesId) => {
  const { created } = params;
  const { className, formatedDate } = getDateProps(created, "short");

  return <span className={classnames("text-xs", className)}>{formatedDate}</span>;
};

export const ModifiedRenderer = <T extends TrackedEntityDto>(params: T, language: LanguagesId) => {
  const { modified } = params;
  const { className, formatedDate } = getDateProps(modified, "short");

  return <span className={classnames("text-xs", className)}>{formatedDate}</span>;
};

const getDateProps = (dateStr: string, format: DateFormatTypes = "smart") => {
  const date = moment(dateStr);
  const formatedDate = formatDate(date, format);
  const isNew = Math.abs(date.diff(moment(), "days")) <= 3;
  const className = isNew ? "text-green-500 font-semibold" : "text-gray-500";
  return { className, date, formatedDate };
};
