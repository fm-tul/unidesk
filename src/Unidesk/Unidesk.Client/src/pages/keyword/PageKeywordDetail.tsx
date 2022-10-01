import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { link_pageKeywordDetail } from "routes/links";

import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { RequestInfo } from "../../components/utils/RequestInfo";
import { useFetch } from "../../hooks/useFetch";

export const PageKeywordDetail = () => {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: response,
  } = useFetch(() => httpClient.thesis.find({ requestBody: { keywords: [id!] } }), [id]);
  const { data: related } = useFetch(() => httpClient.keywords.findRelated({ keywordId: id }), [id]);

  return (
    <div>
      <h1>Keyword Detail</h1>
      {!!related && (
        <div>
          <h2>Related</h2>
          <div className="flex gap-1">
            {related
              .filter(i => i.locale === language)
              .map(i => (
                <div className="pill" key={i.id}>
                  <Link to={link_pageKeywordDetail.navigate(i.id)}>
                    {i.value}
                    <span className="text-xs"> ({i.used}×)</span>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      <RequestInfo error={error} isLoading={isLoading} />
      {response && (
        <div>
          {response.items.map(thesis => (
            <ThesisSimpleView key={thesis.id} thesis={thesis} withEdit />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageKeywordDetail;
