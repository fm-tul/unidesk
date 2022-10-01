import { httpClient } from "@core/init";
import { QueryFilter } from "@models/QueryFilter";
import { TeamDto } from "@models/TeamDto";
import { FilterBar } from "components/FilterBar";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { useDebounceState } from "hooks/useDebounceState";
import { useQuery } from "hooks/useFetch";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { link_pageTeamEdit } from "routes/links";

export const PageTeamList = () => {
  const { filter, data, error, isLoading, loadData, setFilter, refresh, refreshIndex } = useQuery<TeamDto>({ pageSize: 100 });
  const [searchText, setSearchText, debouceSearch] = useDebounceState<string>("");

  const doSearch = async () => {
    const requestBody = {
      filter,
      keyword: searchText,
    };
    await loadData(httpClient.team.find({ requestBody }));
  };

  const updateFilter = (filter: QueryFilter) => {
    setFilter({ ...filter });
    refresh();
  };

  useEffect(() => {
    if (!isLoading) {
      doSearch();
    }
  }, [refreshIndex, debouceSearch]);

  return (
    <div>
      <FilterBar></FilterBar>
      <LoadingWrapper isLoading={isLoading} error={error}>
        {data.length > 0 && (
          <div>
            {data.map(i => (
              <Link key={i.id} to={link_pageTeamEdit.navigate(i.id)}>
                <span className="bold">{i.name}</span>
                {!!i.description && <span className="italic"> - {i.description}</span>}
              </Link>
            ))}
          </div>
        )}
      </LoadingWrapper>
    </div>
  );
};

export default PageTeamList;
