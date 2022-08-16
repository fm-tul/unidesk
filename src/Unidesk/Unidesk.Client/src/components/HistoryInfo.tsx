import { R, Translate } from "@locales/R";
import { FaCalendar } from "react-icons/fa";
import { useContext } from "react";
import { LanguageContext } from "@locales/LanguageContext";
import { TrackedEntityDto } from "@api-client";
import moment from "moment";
import "moment/dist/locale/en-gb";
import "moment/dist/locale/cs";

interface IHistoryInfoProps {
  item: TrackedEntityDto;
}

const languageLocaleMapping = {
  cze: "cs",
  eng: "en",
} as const;

export const Moment = (props: { date: string | number; fromNow?: boolean }) => {
  const { language } = useContext(LanguageContext);
  const locale = languageLocaleMapping[language];
  const { date, fromNow = true } = props;
  const dateMoment = moment(date).locale(locale);
  const dateString = dateMoment.format("YYYY-MM-DD HH:mm:ss");

  if (fromNow) {
    return <time title={dateString}>{dateMoment.fromNow()}</time>;
  }

  return <span title={dateString}>{}</span>;
};

const momentFromNow = (date: string) => {
  const { language } = useContext(LanguageContext);
  const locale = languageLocaleMapping[language];
  const dateMoment = moment(date).locale(locale);
  return dateMoment.fromNow();
};

export const HistoryInfo = (props: IHistoryInfoProps) => {
  const { item } = props;
  const { created, createdBy, modified, modifiedBy } = item;

  return (
    <div className="flex flex-col items-center">
      <div className="text-gray-500">
        <Translate value="created" />: <Moment date={created} fromNow />
      </div>
      <div className="text-gray-500">
        <Translate value="created-by" />: {createdBy}
      </div>
      <div className="text-gray-500">
        <Translate value="modified" />: <Moment date={modified} fromNow />
      </div>
      <div className="text-gray-500">
        <Translate value="modified-by" />: {modifiedBy}
      </div>
    </div>
  );
};

export const HistoryInfoIcon = (props: IHistoryInfoProps) => {
  const { item } = props;
  const { created, createdBy, modified, modifiedBy } = item;
  const createdFromNow = momentFromNow(created);
  const modifiedFromNow = momentFromNow(modified);
  const titleCreated = R("created-by-user-at-time", createdBy, createdFromNow);
  const titleModified = R("modified-by-user-at-time", modifiedBy, modifiedFromNow);

  return (
    <div className="inline-flex items-center gap-1 text-gray-300">
      <time className="flex items-center gap-1" title={`${titleCreated}, ${titleModified}`}>
        <FaCalendar />
      </time>
    </div>
  );
};
