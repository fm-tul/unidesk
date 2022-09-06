import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryFilter } from "@models/QueryFilter";
import { UserDto } from "@models/UserDto";
import { UserFunction } from "@models/UserFunction";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { Button } from "ui/Button";
import { generatePrimitive, Select } from "ui/Select";
import { TextField } from "ui/TextField";

import { useQuery } from "../../hooks/useFetch";

const userFunctionOptions = generatePrimitive(Object.values(UserFunction));
export const PageUserList = () => {
  const { filter, data, error, isLoading, refreshIndex, refresh, loadData, setFilter } = useQuery<UserDto>({ pageSize: 80 });
  const { language } = useContext(LanguageContext);
  const [searchText, setSearchText] = useState<string>("");
  const [userFunctions, setUserFunction] = useState<string[]>([]);

  const doSearch = async (keyword: string) => {
    const requestBody = {
      filter,
      keyword,
      userFunctions: userFunctions as any,
    };
    loadData(httpClient.users.find({ requestBody }));
  };

  const updateFilter = (filter: QueryFilter) => {
    setFilter({ ...filter });
    refresh();
  };

  useEffect(() => {
    doSearch(searchText);
  }, [refreshIndex]);

  return (
    <>
      <LoadingWrapper isLoading={isLoading} error={error} className="flex flex-col gap-4">
        <FilterBar className="items-stretch" sm>
          <TextField
            loading={isLoading}
            fullWidth={false}
            className="w-xs"
            value={searchText}
            onValue={setSearchText}
            label={RR("search", language)}
            onEnter={() => doSearch(searchText)}
          />
          <Select
            options={userFunctionOptions}
            value={userFunctions}
            onMultiValue={setUserFunction}
            label={RR("user-function", language)}
            clearable
            multiple
          />
          <Paging className="ml-auto" filter={filter} onValue={updateFilter} />
          <Button loading={isLoading} onClick={() => doSearch(searchText)}>
            {RR("search", language)}
          </Button>
        </FilterBar>

        <div className="grid grid-cols-2 content-start gap-1 md:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.map(user => (
              <div key={user.id} className="flex items-center gap-1">
                {/* <Tooltip title={user.stagId ?? ""} placement="left"> */}
                <Button component={Link} to={`/users/${user.id}`} sm text title={user.stagId ?? ""}>
                  <span className="flex items-center gap-1">
                    <span className="min-w-[26px] text-right text-xs text-gray-500">{user.titleBefore}</span>
                    {user.lastName} {user.firstName}
                    {user.titleAfter && <span className="text-xs text-gray-500">{user.titleAfter}</span>}
                    {user.thesisCount != null && user.thesisCount > 1 && <span className="text-xs text-gray-500">({user.thesisCount}×)</span>}
                  </span>
                </Button>
                {/* </Tooltip> */}
              </div>
            ))}
        </div>
      </LoadingWrapper>
    </>
  );
};

export default PageUserList;
