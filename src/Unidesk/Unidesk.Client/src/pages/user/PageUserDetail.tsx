import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { API_URL } from "@core/config";
import { httpClient } from "@core/init";
import { useFetch } from "../../hooks/useFetch";
import { Translate } from "@locales/R";

export const PageUserDetail = () => {
  const { userId } = useParams();
  const {
    error: errorUser,
    isLoading: isLoadingUser,
    data: user,
  } = useFetch(() => httpClient.users.getApiUsersGet({ id: userId! }), [userId]);
  const {
    error: errorTheses,
    isLoading: isLoadingTheses,
    data: theses,
  } = useFetch(() => httpClient.thesis.getAll({ userId: userId! }), [userId]);

  const isLoading = isLoadingUser || isLoadingTheses;
  const error = errorUser || errorTheses;

  return (
    <div>
      {isLoading && <span className="spinner-colors big"></span>}
      {error && (
        <span className="text-red-500">
          <Translate value="error-occurred" />: {error}
        </span>
      )}
      {user && (
        <div>
          {user.titleBefore} {user.firstName} {user.lastName} {user.titleAfter}({user.stagId})
          <HistoryInfoIcon item={user} />
        </div>
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

export default PageUserDetail;
