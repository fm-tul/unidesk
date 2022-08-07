import { useParams } from "react-router-dom";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { httpClient } from "@core/init";
import { Translate } from "@locales/R";
import { useFetch } from "../../hooks/useFetch";
import { RequestInfo } from "../../components/utils/RequestInfo";

export const PageKeywordDetail = () => {
  const { keywordId } = useParams();
  const { isLoading, error, data: theses } = useFetch(() => httpClient.thesis.getAll({ keywords: [keywordId!] }), [keywordId]);

  return (
    <div>
      <h1>Keyword Detail</h1>
      <RequestInfo error={error} isLoading={isLoading} />
      {theses && (
        <div>
          {theses.map((thesis) => (
            <ThesisSimpleView key={thesis.id} thesis={thesis} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageKeywordDetail;
