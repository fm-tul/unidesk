import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { UnideskComponent } from "components/UnideskComponent";
import { ThesisListRenderer } from "models/itemRenderers/ThesisRenderer";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { link_pageKeywordDetail, link_pageThesisDetail } from "routes/links";

import { RequestInfo } from "../../components/utils/RequestInfo";
import { useFetch } from "../../hooks/useFetch";

export const PageKeywordDetail = () => {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const { isLoading, error, data: response } = useFetch(() => httpClient.thesis.find({ requestBody: { keywords: [id!] } }), [id]);
  const { data: related } = useFetch(() => httpClient.keywords.findRelated({ keywordId: id }), [id]);
  const navigate = useNavigate();

  return (
    <UnideskComponent name="PageKeywordDetail">
      {!!related && (
        <div>
          <h2>Related</h2>
          <div className="flex gap-1">
            {related
              .filter(i => i.locale === language)
              .map(i => (
                <div className="pill info clickable" key={i.id}>
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
      <ThesisListRenderer rows={response?.items ?? []} onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))} />
    </UnideskComponent>
  );
};

export default PageKeywordDetail;
