import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { UnideskComponent } from "components/UnideskComponent";
import { ThesisListRenderer } from "models/itemRenderers/ThesisRenderer";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { link_pageKeywordDetail, link_pageThesisDetail } from "routes/links";

import { RequestInfo } from "../../components/utils/RequestInfo";

export const PageKeywordDetail = () => {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, data: response } = useQuery({
    queryKey: ["keyword", id],
    queryFn: () => httpClient.thesis.find({ requestBody: { keywords: [id!] } }),
  })
  const { data: related } = useQuery({
    queryKey: ["keyword", id, "related"],
    queryFn: () => httpClient.keywords.findRelated({ keywordId: id }),
  })

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
