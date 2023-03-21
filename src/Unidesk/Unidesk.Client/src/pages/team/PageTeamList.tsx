import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { QueryPaging } from "@models/QueryPaging";
import { TeamDto } from "@models/TeamDto";
import { TrackedEntityDto } from "@models/TrackedEntityDto";
import { FilterBar } from "components/FilterBar";
import { HistoryInfo } from "components/HistoryInfo";
import { FloatingAction } from "components/mui/FloatingAction";
import { UnideskComponent } from "components/UnideskComponent";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { useDebounceState } from "hooks/useDebounceState";
import { MetadataRenderer } from "models/cellRenderers/MetadataRenderer";
import { useContext, useEffect } from "react";
import { MdCalendarToday } from "react-icons/md";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { link_pageTeamEdit } from "routes/links";
import { Table } from "ui/Table";
import { previewText } from "utils/stringUtils";

export const PageTeamList = () => {
  const navigate = useNavigate();
  const {language} = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);

  const { data, error, isLoading } = useQuery({
    queryKey: "teams",
    queryFn: () =>
      httpClient.team.find({
        requestBody: {},
      }),
  });

  return (
    <UnideskComponent name="PageTeamList">
      <FilterBar></FilterBar>
      <LoadingWrapper isLoading={isLoading}>
        <FloatingAction component={Link} to={link_pageTeamEdit.navigate("new")} />
        {!!data && (
          <Table
            onRowClick={i => navigate(link_pageTeamEdit.navigate(i.id))}
            rows={data.items}
            columns={[
              { id: "name", headerName: "Name", field: "name" },
              { id: "description", headerName: "Description", field: i => previewText(i.description, 100) },
              { id: "history", headerName: <MdCalendarToday />,field: i => MetadataRenderer(i, language), style: { width: 90 }, },
            ]}
          />
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageTeamList;
