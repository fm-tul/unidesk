import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryFilter } from "@models/QueryFilter";
import { UserDto } from "@models/UserDto";
import { UserFilter } from "@models/UserFilter";
import { UserFunction } from "@models/UserFunction";
import { useContext, useEffect } from "react";
import { MdClear, MdClearAll } from "react-icons/md";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { useDebounceLocalStorageState } from "hooks/useDebounceState";
import { useQuery } from "hooks/useFetch";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { generatePrimitive, Select } from "ui/Select";
import { TextField } from "ui/TextField";

const userFunctionOptions = generatePrimitive(Object.values(UserFunction));
type UserFilterOnly = Omit<UserFilter, "filter">;
interface UserFilterBarProps {
  onChange?(data: UserDto[]): void;
}
export const UserFilterBar = (props: UserFilterBarProps) => {
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { paging, isLoading, refreshIndex, refresh, loadData, setPaging } = useQuery<UserDto>({ pageSize: 80 });
  const [filter, setFilter, debounceFilter] = useDebounceLocalStorageState<UserFilterOnly>("main.user-filter-bar", {
    keyword: "",
    userFunctions: [],
  });

  const updatePagination = (filter: QueryFilter) => {
    setPaging({ ...filter });
    refresh();
  };

  useEffect(() => {
    loadData(httpClient.users.find({ requestBody: { ...filter, filter: paging } })).then(onChange);
  }, [debounceFilter, refreshIndex]);

  return (
    <FilterBar disabled={isLoading}>
      <FormField
        as={TextField}
        loading={isLoading}
        fullWidth={false}
        classNameField="grow"
        value={filter.keyword}
        onValue={(v: string) => setFilter({ ...filter, keyword: v })}
        label={translate("search")}
        onEnter={refresh}
      />
      <FormField
        as={Select<UserFunction>}
        options={userFunctionOptions}
        value={filter.userFunctions!}
        classNameField="min-w-xs max-w-md"
        onMultiValue={(uf: UserFunction[]) => setFilter({ ...filter, userFunctions: uf })}
        placeholder={translate("user-function")}
        clearable
        multiple
      />

      <Paging className="ml-auto" filter={paging} onValue={updatePagination} />

      <FilterBar type="btn-group">
        <Button onClick={refresh}>
          {translate("search")}
        </Button>

        <Button size="sm" color="warning" variant="contained" onClick={() => setFilter({ keyword: "", userFunctions: [] })}>
          <MdClear />
        </Button>
      </FilterBar>
    </FilterBar>
  );
};
