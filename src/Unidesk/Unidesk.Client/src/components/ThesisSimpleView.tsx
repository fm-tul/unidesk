import { ThesisDto, UserDto } from "@api-client";
import { LanguageContext } from "@locales/LanguageContext";
import { Translate } from "@locales/R";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useOpenClose } from "hooks/useOpenClose";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { ThesisEdit } from "pages/thesis/PageThesisEdit";
import { Modal } from "ui/Modal";

import { DualLanguage } from "./DualLanguage";
import { HistoryInfoIcon } from "./HistoryInfo";
import { link_pageKeywordDetail, link_pageThesisDetail, link_pageUserDetail } from "routes/links";

interface IThesisSimpleViewProps {
  thesis: ThesisDto;
  onClick?: (thesis: ThesisDto) => void;
  withEdit?: boolean;
  withDetail?: boolean;
}
export const ThesisSimpleView = (props: IThesisSimpleViewProps) => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { thesis, onClick, withEdit, withDetail } = props;
  const { status, adipidno } = thesis;

  const { open, close, isOpen } = useOpenClose(false);
  const [selectedThesis, setSelectedThesis] = useState<ThesisDto>();

  const handleClick = () => {
    onClick?.(thesis);
    if (withEdit) {
      setSelectedThesis(thesis);
      open();
    }
  };

  return (
    <div key={thesis.id} className="flex flex-col rounded p-2 transition hover:bg-gray-100">
      <div key={thesis.id}>
        <div className="flex items-baseline justify-between gap-1">
          <span className="rounded-md border border-orange-400 bg-orange-200 px-1 text-xs">{renderThesisStatus(status, language)}</span>
          {!!adipidno && (
            <Link
              to={link_pageThesisDetail.navigate(thesis.id)}
              className="rounded-md border border-fuchsia-500 bg-fuchsia-400 px-1 font-mono text-xs font-semibold text-white"
            >
              {adipidno}
            </Link>
          )}
          {withDetail === true ? (
            <Link
              className="cursor-pointer px-2 py-1 font-bold transition hover:bg-black/10"
              to={link_pageThesisDetail.navigate(thesis.id)}
            >
              <DualLanguage eng={thesis.nameEng!} cze={thesis.nameCze!} language={language} />
            </Link>
          ) : (
            <span className="cursor-pointer px-2 py-1 font-bold transition hover:bg-black/10" onClick={handleClick}>
              <DualLanguage eng={thesis.nameEng!} cze={thesis.nameCze!} language={language} />
            </span>
          )}
          {thesis.authors.length > 0 && (
            <span className="italic">
              -
              {thesis.authors.map((user, index) => (
                <Link key={user.id} to={link_pageUserDetail.navigate(user.id)}>
                  {user.lastName} {user.firstName}
                  {index < thesis.authors.length - 1 && ", "}
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
        {thesis.keywords
          .filter(i => i.locale === language)
          .map((i, j) => (
            <Link key={i.id} to={link_pageKeywordDetail.navigate(i.id)}>
              <span
                key={j}
                className="rounded-lg bg-blue-500/10 px-1 text-sm text-gray-700 transition hover:bg-blue-500/80 hover:text-white"
              >
                {i.value}
              </span>
            </Link>
          ))}
      </div>

      {withEdit === true && isOpen && (
        <Modal open={isOpen} onClose={close} y="top" height="lg" className="bg-slate-100 p-6">
          <div className="flex h-full flex-col content-between">
            <ThesisEdit initialValues={selectedThesis} />
          </div>
        </Modal>
      )}
    </div>
  );
};
