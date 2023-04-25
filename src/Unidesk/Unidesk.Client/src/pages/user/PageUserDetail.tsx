import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { renderUserFull } from "models/cellRenderers/UserRenderer";
import { link_pageThesisDetail, link_pageUserList, link_pageUserProfile } from "routes/links";
import { groupBy } from "utils/arrays";

import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { UnideskComponent } from "components/UnideskComponent";
import { ThesisListRenderer } from "models/itemRenderers/ThesisListRenderer";
import { UserContext } from "user/UserContext";
import { EnKeys } from "@locales/all";
import { RR } from "@locales/R";
import { Grants } from "@api-client/constants/Grants";
import { Button } from "ui/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocalStorage } from "hooks/useLocalStorage";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { EnumsContext } from "models/EnumsContext";
import { ThesisTypeDto } from "@models/ThesisTypeDto";
import { Section } from "components/mui/Section";

type ViewMode = "all" | "by-status" | "by-function" | "by-year" | "by-thesis-type";

export const PageUserDetail = () => {
  const { id } = useParams();
  const { user: me } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const { enums } = useContext(EnumsContext);
  const translate = (value: EnKeys) => RR(value, language);
  const translateType = (value: ThesisTypeDto | undefined) => (language === "cze" ? value?.nameCze : value?.nameEng);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("user-detail-view-mode", "all");

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => httpClient.users.get({ id: id! }),
  });

  const deleteUser = async () => {
    await httpClient.users.deleteOne({ id: id! });
    navigate(link_pageUserList.path);
  };

  const allUserThesis = data?.allThesis ?? [];
  const allThesis = allUserThesis.map(i => i.thesis);
  const byStatus = [...groupBy(allThesis, i => i.status).entries()];
  const hasThesis = allThesis.length > 0;

  return (
    <UnideskComponent name="PageUserDetail">
      <LoadingWrapper isLoading={isLoading} error={error}>
        <>
          {!!data && (
            <Button text>
              <h1 className="flex items-center gap-2 text-2xl">
                <Link to={link_pageUserProfile.navigate(data.id)}>{renderUserFull(data)}</Link>
                <HistoryInfoIcon item={data} />
              </h1>
            </Button>
          )}

          {hasThesis && (
            <div className="p-2">
              <h2 className="text-xl">Stats</h2>
              <div className="flex flex-col gap-px">
                {byStatus
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([status, thesis]) => (
                    <div key={status} className="grid max-w-xs grid-cols-1">
                      <div
                        className="col-start-1 row-start-1 rounded-sm bg-blue-200"
                        style={{ width: `${(thesis.length / allThesis.length) * 100}%` }}
                      />
                      <div className="col-start-1 row-start-1 bg-blue-200/50 px-1">
                        {renderThesisStatus(status, language)} ({thesis.length})
                      </div>
                    </div>
                  ))}
              </div>

              <h3 className="text-xl">{translate("link.thesis")}</h3>
              <FormField
                as={SelectField<ViewMode>}
                size="sm"
                value={viewMode}
                options={["all", "by-status", "by-function", "by-year", "by-thesis-type"]}
                onValue={items => setViewMode(items[0])}
                width="min-w-xs"
              />

              {!hasThesis && <div className="text-gray-500">{translate("no-thesis-found")}</div>}
              {viewMode === "all" && (
                <ThesisListRenderer rows={allThesis} onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))} />
              )}
              {viewMode === "by-status" && (
                <>
                  {byStatus
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([status, theses]) => (
                      <div key={status}>
                        <Section title={() => renderThesisStatus(status, language)} />
                        <ThesisListRenderer
                          rows={theses}
                          onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))}
                          className="ml-8"
                        />
                      </div>
                    ))}
                </>
              )}
              {viewMode === "by-function" && (
                <>
                  {[...groupBy(allUserThesis, i => i.function).entries()]
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([functionName, theses]) => (
                      <div key={functionName}>
                        <Section title={`user-function.${functionName.toLowerCase()}` as EnKeys} />
                        <ThesisListRenderer
                          rows={theses.map(i => i.thesis)}
                          onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))}
                          className="ml-8"
                        />
                      </div>
                    ))}
                </>
              )}
              {viewMode === "by-year" && (
                <>
                  {[...groupBy(allUserThesis, i => i.thesis.schoolYearId).entries()]
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([yearId, theses]) => (
                      <div key={yearId}>
                        <Section title={() => enums.schoolYears.find(i => i.id === yearId)?.name ?? "Year"} />
                        <ThesisListRenderer
                          rows={theses.map(i => i.thesis)}
                          onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))}
                          className="ml-8"
                        />
                      </div>
                    ))}
                </>
              )}
              {viewMode === "by-thesis-type" && (
                <>
                  {[...groupBy(allUserThesis, i => i.thesis.thesisTypeId).entries()]
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([thesisTypeId, theses]) => (
                      <div key={thesisTypeId}>
                        <Section title={() => translateType(enums.thesisTypes.find(i => i.id === thesisTypeId)) ?? ""} />
                        <ThesisListRenderer
                          rows={theses.map(i => i.thesis)}
                          onRowClick={i => navigate(link_pageThesisDetail.navigate(i.id))}
                          className="ml-8"
                        />
                      </div>
                    ))}
                </>
              )}
            </div>
          )}

          {!hasThesis && (
            <div className="text-center italic text-black/20 p-8 text-xl font-extrabold select-none">{translate("thesis.no-thesis")}</div>
          )}

          {!hasThesis && me.grantIds.includes(Grants.User_Admin.id) && (
            <div className="flex justify-end">
              <Button onConfirmedClick={deleteUser} error text sm>
                {translate("delete-user")}
              </Button>
            </div>
          )}
        </>
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageUserDetail;
