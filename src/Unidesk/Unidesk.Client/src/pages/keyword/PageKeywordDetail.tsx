import { useParams } from "react-router-dom";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { httpClient } from "../../core/init";
import { Translate } from "../../locales/R";
import { useFetch } from "../../hooks/useFetch";

export const PageKeywordDetail = () => {
  const { keywordId } = useParams();
  const { isLoading, error, data: theses } = useFetch(() => httpClient.thesis.getAll({ keywords: [keywordId!] }), [keywordId]);

  return (
    <div>
      <h1>Keyword Detail</h1>
      {isLoading && <span className="spinner-colors big"></span>}
      {error && (
        <span className="text-red-500">
          <Translate value="error-occurred" />: {error}
        </span>
      )}
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
