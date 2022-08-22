import { LanguagesId } from "@locales/all";
import { TrackedEntityDto } from "@models/TrackedEntityDto";
import moment from "moment";
import { formatDate } from "utils/dateUtils";

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

const getDateProps = (dateStr: string) => {
  const date = moment(dateStr);
  const formatedDate = formatDate(date);
  const isNew = Math.abs(date.diff(moment(), "days")) <= 3;
  const className = isNew ? "text-green-500 font-semibold" : "text-gray-500";
  return { className, date, formatedDate };
};
