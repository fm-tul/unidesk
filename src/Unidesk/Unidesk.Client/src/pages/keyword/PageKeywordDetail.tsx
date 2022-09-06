import { httpClient } from "@core/init";
import { Translate } from "@locales/R";
import { useParams } from "react-router-dom";

import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { RequestInfo } from "../../components/utils/RequestInfo";
import { useFetch } from "../../hooks/useFetch";

export const PageKeywordDetail = () => {
  const { keywordId } = useParams();
  const { isLoading, error, data: response } = useFetch(() => httpClient.thesis.find({ requestBody: { keywords: [keywordId!] } }), [keywordId]);

  return (
    <div>
      <h1>Keyword Detail</h1>
      <RequestInfo error={error} isLoading={isLoading} />
      {response && (
        <div>
          {response.items.map((thesis) => (
            <ThesisSimpleView key={thesis.id} thesis={thesis} withEdit />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageKeywordDetail;
