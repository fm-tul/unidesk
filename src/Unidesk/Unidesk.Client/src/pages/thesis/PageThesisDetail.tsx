import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { useContext, useEffect, useState } from "react";
import { MdDoubleArrow } from "react-icons/md";
import Latex from "react-latex";
import { Link, useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { link_pageThesisEdit } from "routes/links";
import React from "react";
import { UnideskComponent } from "components/UnideskComponent";
import { EnumsContext } from "models/EnumsContext";

interface PageThesisDetailProps {}
export const PageThesisDetail = (props: PageThesisDetailProps) => {
  const { language } = useContext(LanguageContext);

  const { id } = useParams();
  const [dto, setDto] = useState<ThesisDto>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { enums } = useContext(EnumsContext);

  const loadItem = async (id: string) => {
    setIsLoading(true);
    const item = await httpClient.thesis.getOne({ id }).catch(setError);
    if (item) {
      setDto(item);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!!id) {
      loadItem(id);
    }
  }, [id]);

  const keywords = dto?.keywords.filter(i => i.locale === language) ?? [];

  return (
    <UnideskComponent name="PageThesisDetail">
      <LoadingWrapper isLoading={isLoading} error={error}>
        {!!dto && !!enums && (
          <article className="prose prose-lg prose-slate mx-auto max-w-full bg-white print:prose-sm">
            {/* header */}
            <header className="flex flex-col gap-1">
              <Link to={link_pageThesisEdit.navigate(dto.id)} className="no-underline">
                <h1>{language === "cze" ? dto.nameCze : dto.nameEng}</h1>
              </Link>

              <h3 className="ml-4 -mt-8 inline-flex items-center gap-1 text-lg text-neutral-500 print:hidden">
                <MdDoubleArrow />
                {language === "cze" ? dto.nameEng : dto.nameCze}
              </h3>
            </header>

            {/* abstract */}
            <div>
              <p className="whitespace-pre-line">{language === "cze" ? dto.abstractCze : dto.abstractEng}</p>
            </div>

            <div className="grid grid-cols-[max-content,1fr] justify-start gap-x-6 gap-y-2">
              {/* keywords */}
              <span>{RR("keywords", language)}:</span>
              <div className="inline-flex flex-wrap items-center gap-2">
                {keywords.map((keyword, index) => (
                  <span key={index}>
                    {keyword.value}
                    {index < keywords.length - 1 && <>, </>}
                  </span>
                ))}
              </div>

              {/* authors */}
              <span>{RR("authors", language)}:</span>
              <div className="inline-flex flex-wrap items-center gap-2">
                {dto.authors.map((userDto, i) => (
                  <React.Fragment key={userDto.user.id}>
                    <span>{renderUserLookup(userDto.user, false)}</span>
                    {i < dto.authors.length - 1 && <>, </>}
                  </React.Fragment>
                ))}
              </div>

              {/* School Year */}
              <span>{RR("school-year", language)}:</span>
              <span>{enums.schoolYears?.find(i => i.id === dto.schoolYearId)?.name}</span>

              {/* Guidelines & literature */}
              <div className="col-span-2 grid grid-cols-2 break-all">
                <div>
                  <span>Guidelines:</span>
                  {dto.guidelines.length === 1 ? (
                    <p>
                      <Latex>{dto.guidelines[0]}</Latex>
                    </p>
                  ) : (
                    <ol>
                      {dto.guidelines.map((item, i) => (
                        <small key={i}>
                          <li>
                            <Latex throwOnError={false}>{item}</Latex>
                          </li>
                        </small>
                      ))}
                    </ol>
                  )}
                </div>

                <div>
                  <span>Literature:</span>
                  <ul>
                    {dto.literature.map((item, i) => (
                      <small key={i}>
                        <li>
                          <Latex throwOnError={false}>{item}</Latex>
                        </li>
                      </small>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageThesisDetail;
