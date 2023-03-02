import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { KeywordDto } from "@models/KeywordDto";
import { KeywordFilter } from "@models/KeywordFilter";
import { KeywordUsedCount } from "@models/KeywordUsedCount";
import { QueryPaging } from "@models/QueryPaging";
import { useContext } from "react";
import { MdClear } from "react-icons/md";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { useDebounceLocalStorageState } from "hooks/useDebounceState";
import { usePagedQuery } from "hooks/useFetch";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { Select } from "ui/Select";
import { TextField } from "ui/TextField";
import { usePaging } from "hooks/usePaging";

const usedCountOptions = [
  { label: ">1", key: "moreThan1", value: KeywordUsedCount.MORE_THAN1 },
  { label: ">5", key: "moreThan5", value: KeywordUsedCount.MORE_THAN5 },
  { label: ">10", key: "moreThan10", value: KeywordUsedCount.MORE_THAN10 },
];

interface KeywordsFilterBarProps {
  onChange?(data: KeywordDto[]): void;
}
export const KeywordsFilterBar = (props: KeywordsFilterBarProps) => {
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const pageModel = usePaging({ pageSize: 80 });
  const { paging, setPaging } = pageModel;
  const [filter, setFilter, debounceFilter] = useDebounceLocalStorageState<KeywordFilter>("main.keyword-filter-bar", { keyword: "" });
  const { isLoading, refresh } = usePagedQuery({
    queryFn: (i) => httpClient.keywords.getAll(i),
    queryKey: ["keyword", "find", debounceFilter],
    filter,
    pageModel,
    onChange,
  });

  const updatePagination = (filter: QueryPaging) => {
    setPaging({ ...filter });
    refresh();
  };

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

      <Paging className="ml-auto" paging={paging} onValue={updatePagination} />

      <FilterBar type="btn-group">
        <Button onClick={refresh}>{translate("search")}</Button>

        <Button size="sm" color="warning" variant="contained" onClick={() => setFilter({ keyword: "" })}>
          <MdClear />
        </Button>
      </FilterBar>
    </FilterBar>
  );
};
