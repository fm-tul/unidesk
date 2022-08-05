import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThesisDto } from "../api-client";
import { LanguageContext } from "../locales/LanguageContext";
import { Translate } from "../locales/R";
import { DualLanguage } from "./DualLanguage";
import { HistoryInfoIcon } from "./HistoryInfo";

interface IThesisSimpleViewProps {
  thesis: ThesisDto;
}
export const ThesisSimpleView = (props: IThesisSimpleViewProps) => {
  const { language } = useContext(LanguageContext);
  const { thesis } = props;
  const { status } = thesis;

  return (
    <div key={thesis.id} className="flex flex-col rounded p-2 transition hover:bg-gray-100">
      <div key={thesis.id}>
        <div className="flex items-baseline justify-between gap-1">
          {thesis.isNew === true && (
            <Translate
              value="imported-thesis-new"
              className="rounded-md border border-blue-500 bg-blue-400 px-1 font-mono text-xs font-semibold text-white"
            />
          )}
          <span className="rounded-md border border-orange-400 bg-orange-200 px-1 text-xs">{status}</span>
          <span className="font-bold">
            <DualLanguage eng={thesis.nameEng!} cze={thesis.nameCze!} />
          </span>
          {thesis.users.length > 0 && (
            <span className="italic">
              -
              {thesis.users.map((user: any) => (
                <Link key={user.id} to={`/users/${user.id}`}>
                  {user.lastName} {user.firstName}
                </Link>
              ))}
            </span>
          )}
          <span className="ml-auto">
            <HistoryInfoIcon item={thesis} />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2">
        {thesis.keywordThesis
          .filter((i: any) => i.locale == language)
          .map((i: any, j: number) => (
            <Link key={i.keywordId} to={`/keywords/${i.keywordId}`}>
              <span
                key={j}
                className="rounded-lg bg-blue-500/10 px-1 text-sm text-gray-700 transition hover:bg-blue-500/80 hover:text-white"
              >
                {i.keyword}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};
