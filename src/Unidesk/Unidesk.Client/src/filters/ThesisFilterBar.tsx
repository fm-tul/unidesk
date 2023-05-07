import { No as OptionNo, Yes as OptionYes } from "@api-client/constants/YesNo";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { QueryPaging } from "@models/QueryPaging";
import { ThesisFilter } from "@models/ThesisFilter";
import { ThesisLookupDto } from "@models/ThesisLookupDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { useContext, useState } from "react";
import { MdClear } from "react-icons/md";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { useDebounceLocalStorageState } from "hooks/useDebounceState";
import { extractPagedResponse, usePagedQuery } from "hooks/useFetch";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField, SelectFieldLive } from "ui/SelectField";
import { TextField } from "ui/TextField";
import { EnumsContext } from "models/EnumsContext";
import { usePaging } from "hooks/usePaging";
import { KeywordDto } from "@models/KeywordDto";
import { OperatorAll } from "@api-client/constants/Operator";
import { Operator } from "@models/Operator";
import { useTranslation } from "@locales/translationHooks";

interface ThesisFilterBarProps {
  onChange?(data: ThesisLookupDto[]): void;
  initialFilter?: Partial<ThesisFilter>;
}
export const ThesisFilterBar = (props: ThesisFilterBarProps) => {
  const { initialFilter = {} } = props;
  const { myThesis = false } = initialFilter;
  const { enums } = useContext(EnumsContext);
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);
  const [keywordCache, setKeywordCache] = useState<Map<string, KeywordDto>>(new Map());

  const [filter, setFilter, debounceFilter, _, clearLS] = useDebounceLocalStorageState<ThesisFilter>(
    `main.user-filter-bar.${myThesis ? "my" : "all"}`,
    {
      keyword: "",
      schoolYearId: enums.schoolYears.find(i => new Date(i.start).getFullYear() === new Date().getFullYear() - 1)?.id,
      ...initialFilter,
    },
    300
  );
  const pageModel = usePaging({ pageSize: 80 });
  const { paging, setPaging } = pageModel;
  const { isLoading, refresh } = usePagedQuery({
    queryFn: i => httpClient.thesis.find(i),
    queryKey: ["thesis", "find", debounceFilter],
    filter,
    pageModel,
    onChange,
  });

  const clearFilter = () => {
    setFilter({ keyword: "", ...initialFilter });
    clearLS();
  };

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
        value={filter.keyword}
        onValue={(v: string) => setFilter({ ...filter, keyword: v })}
        label={translate("search")}
        onEnter={refresh}
        width="w-full min-w-[200px]"
      />

      <FormField
        as={SelectField<ThesisStatus>}
        label={translate("status")}
        options={Object.values(ThesisStatus)}
        value={filter.status}
        onValue={(v: ThesisStatus[]) => setFilter({ ...filter, status: v[0] })}
        getTitle={(i: ThesisStatus) => renderThesisStatus(i, language)}
        width="w-full min-w-[200px]"
        clearable
        searchable
      />
      <FormField
        as={SelectField<boolean>}
        label={translate("has-keywords")}
        options={[true, false]}
        value={filter.hasKeywords as boolean | undefined}
        onValue={(v: boolean[]) => setFilter({ ...filter, hasKeywords: v[0] })}
        getTitle={(i: boolean) => (i ? OptionYes[language] : OptionNo[language])}
        width="w-full min-w-[200px]"
        clearable
      />
      <FormField
        as={SelectField<string>}
        label={translate("school-year")}
        options={enums.schoolYears.sort((b, a) => a.name.localeCompare(b.name)).map(i => i.id)}
        value={filter.schoolYearId ?? undefined}
        onValue={(v: string[]) => setFilter({ ...filter, schoolYearId: v[0] })}
        getTitle={(i: string) => enums.schoolYears.find(i2 => i2.id === i)?.name ?? ""}
        width="w-full min-w-[200px]"
        clearable
        searchable
      />

      <Paging className="ml-auto" paging={paging} onValue={updatePagination} />

      <FilterBar type="btn-group">
        <Button onClick={() => refresh()} loading={isLoading}>
          {translate("search")}
        </Button>

        <Button size="sm" color="warning" variant="contained" onClick={clearFilter}>
          <MdClear />
        </Button>
      </FilterBar>

      <FormField
        as={SelectFieldLive<string>}
        label={translate("keywords")}
        options={async function (kw) {
          const kws = await extractPagedResponse(
            httpClient.keywords.getAll({ requestBody: { keyword: kw, paging: { page: 1, pageSize: 10 } } })
          );
          kws?.forEach(i => keywordCache.set(i.id, i));
          setKeywordCache(new Map(keywordCache));
          return kws?.map(i => i.id) ?? [];
        }}
        value={filter.keywords ?? []}
        onValue={v => setFilter({ ...filter, keywords: v })}
        getTitle={i => keywordCache.get(i)?.value ?? ""}
        clearable
        searchable
        multiple
      />
      {(filter.keywords?.length ?? 0) > 1 && (
        <FormField
          as={SelectField<Operator>}
          label={translate("operator.and-or")}
          options={Object.values(Operator)}
          value={filter.operator ?? Operator.OR}
          onValue={v => setFilter({ ...filter, operator: v[0] })}
          getTitle={i => translateVal(OperatorAll.find(j => j.value === i))}
        />
      )}
    </FilterBar>
  );
};
