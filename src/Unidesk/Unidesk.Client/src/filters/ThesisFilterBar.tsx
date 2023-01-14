import { No as OptionNo, Yes as OptionYes } from "@api-client/constants/YesNo";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryFilter } from "@models/QueryFilter";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisFilter } from "@models/ThesisFilter";
import { ThesisLookupDto } from "@models/ThesisLookupDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { useContext, useEffect } from "react";
import { MdClear } from "react-icons/md";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { useDebounceLocalStorageState } from "hooks/useDebounceState";
import { useQuery } from "hooks/useFetch";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { TextField } from "ui/TextField";
import { EnumsContext } from "models/EnumsContext";

type ThesisFilterOnly = Omit<ThesisFilter, "filter">;
interface ThesisFilterBarProps {
  onChange?(data: ThesisLookupDto[]): void;
  initialFilter?: Partial<ThesisFilterOnly>;
}
export const ThesisFilterBar = (props: ThesisFilterBarProps) => {
  const { initialFilter = {} } = props;
  const { enums } = useContext(EnumsContext);
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { paging, isLoading, refreshIndex, refresh, loadData, setPaging } = useQuery<ThesisLookupDto>({ pageSize: 20 });
  const [filter, setFilter, debounceFilter, _, clearLS] = useDebounceLocalStorageState<ThesisFilterOnly>("main.user-filter-bar", {
    keyword: "",
    ...initialFilter,
  });

  const clearFilter = () => {
    setFilter({ keyword: "" });
    clearLS();
  };

  const updatePagination = (filter: QueryFilter) => {
    setPaging({ ...filter });
    refresh();
  };

  useEffect(() => {
    console.log(filter, initialFilter);
    loadData(httpClient.thesis.find({ requestBody: { ...filter, filter: paging } })).then(onChange);
  }, [debounceFilter, refreshIndex]);

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
        options={enums.schoolYears.sort((a, b) => a.name.localeCompare(b.name)).map(i => i.id)}
        value={filter.schoolYearId ?? undefined}
        onValue={(v: string[]) => setFilter({ ...filter, schoolYearId: v[0] })}
        getTitle={(i: string) => enums.schoolYears.find(i2 => i2.id === i)?.name ?? ""}
        width="w-full min-w-[200px]"
        clearable
        searchable
      />

      <Paging className="ml-auto" filter={paging} onValue={updatePagination} />

      <FilterBar type="btn-group">
        <Button onClick={refresh}>{translate("search")}</Button>

        <Button size="sm" color="warning" variant="contained" onClick={clearFilter}>
          <MdClear />
        </Button>
      </FilterBar>
    </FilterBar>
  );
};
