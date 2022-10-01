import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { renderUserFull } from "models/cellRenderers/UserRenderer";
import { link_pageUserProfile } from "routes/links";
import { groupBy } from "utils/arrays";

import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { useFetch } from "../../hooks/useFetch";

export const PageUserDetail = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);

  const { error: errorUser, isLoading: isLoadingUser, data: user } = useFetch(() => httpClient.users.get({ id: id! }), [id]);

  const {
    error: errorTheses,
    isLoading: isLoadingTheses,
    data: response,
  } = useFetch(() => httpClient.thesis.find({ requestBody: { userId: id! } }), [id]);

  const isLoading = isLoadingUser || isLoadingTheses;
  const error = errorUser || errorTheses;

  const byStatus = groupBy(response?.items ?? [], i => i.status);

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      {user && (
        <h1 className="text-2xl">
          <Link to={link_pageUserProfile.path.replace(":id", user.id)}>
            {renderUserFull(user)}
          </Link>
          {user.supervisionsTotal != null && user.supervisionsTotal > 0 && (
            <span className="pill text-xs">{(user.supervisionsRatio! * 100).toFixed(0)}%</span>
          )}
          <HistoryInfoIcon item={user} />
        </h1>
      )}

      <h2 className="text-xl">Stats</h2>
      <div className="flex flex-col gap-1">
        {[...byStatus.entries()]
          .sort((a, b) => b[1].length - a[1].length)
          .map(([status, thesis]) => (
            <div key={status} className="grid max-w-xs grid-cols-1">
              <div
                className="col-start-1 row-start-1 rounded-md bg-blue-300"
                style={{ width: `${(thesis.length / (response?.items.length ?? 1)) * 100}%` }}
              />
              <div className="col-start-1 row-start-1 bg-blue-200/50 px-1">
                {renderThesisStatus(status, language)} ({thesis.length})
              </div>
            </div>
          ))}
      </div>

      {response && (
        <div>
          {response.items.map(thesis => (
            <ThesisSimpleView key={thesis.id} thesis={thesis} withEdit />
          ))}
        </div>
      )}
    </LoadingWrapper>
  );
};

export default PageUserDetail;
