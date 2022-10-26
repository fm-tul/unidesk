import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { KeywordDto } from "@models/KeywordDto";
import { KeywordFilter } from "@models/KeywordFilter";
import { KeywordUsedCount } from "@models/KeywordUsedCount";
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

const usedCountOptions = [
  { label: ">1", key: "moreThan1", value: KeywordUsedCount.MORE_THAN1 },
  { label: ">5", key: "moreThan5", value: KeywordUsedCount.MORE_THAN5 },
  { label: ">10", key: "moreThan10", value: KeywordUsedCount.MORE_THAN10 },
];

type KeywordsFilterOnly = Omit<KeywordFilter, "filter">;
interface KeywordsFilterBarProps {
  onChange?(data: KeywordDto[]): void;
}
export const KeywordsFilterBar = (props: KeywordsFilterBarProps) => {
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { paging, isLoading, refreshIndex, refresh, loadData, setPaging } = useQuery<KeywordDto>({ pageSize: 80 });
  const [filter, setFilter, debounceFilter] = useDebounceLocalStorageState<KeywordsFilterOnly>("main.keyword-filter-bar", {
    keyword: "",
  });

  const updatePagination = (filter: QueryFilter) => {
    setPaging({ ...filter });
    refresh();
  };

  useEffect(() => {
    loadData(httpClient.keywords.getAll({ requestBody: { ...filter, filter: paging } })).then(onChange);
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
        as={Select<KeywordUsedCount>}
        sm
        width="w-xs"
        clearable
        optionRender={(i: KeywordUsedCount) => usedCountOptions.find(o => o.value === i)?.label}
        options={usedCountOptions}
        value={filter.usedCount}
        onSingleValue={(v: KeywordUsedCount | undefined) => setFilter({ ...filter, usedCount: v })}
        placeholder={RR("keyword-used-count", language)}
      />

      <Paging className="ml-auto" filter={paging} onValue={updatePagination} />

      <FilterBar type="btn-group">
        <Button onClick={refresh}>{translate("search")}</Button>

        <Button size="sm" color="warning" variant="contained" onClick={() => setFilter({ keyword: "" })}>
          <MdClear />
        </Button>
      </FilterBar>
    </FilterBar>
  );
};
