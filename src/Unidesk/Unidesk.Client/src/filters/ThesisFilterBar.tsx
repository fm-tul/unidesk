import { No as OptionNo, Yes as OptionYes } from "@api-client/constants/YesNo";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryFilter } from "@models/QueryFilter";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisFilter } from "@models/ThesisFilter";
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
import { generatePrimitive, Select } from "ui/Select";
import { TextField } from "ui/TextField";

type ThesisFilterOnly = Omit<ThesisFilter, "filter">;
interface ThesisFilterBarProps {
  onChange?(data: ThesisDto[]): void;
}
export const ThesisFilterBar = (props: ThesisFilterBarProps) => {
  const { onChange } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const { paging, isLoading, refreshIndex, refresh, loadData, setPaging } = useQuery<ThesisDto>({ pageSize: 80 });
  const [filter, setFilter, debounceFilter] = useDebounceLocalStorageState<ThesisFilterOnly>("main.user-filter-bar", {
    keyword: "",
  });

  const thesisOptions = generatePrimitive(Object.values(ThesisStatus) as ThesisStatus[], i => renderThesisStatus(i, language));

  const yesNoOptions = [
    { label: OptionYes[language], key: "yes", value: true },
    { label: OptionNo[language], key: "no", value: false },
  ];

  const updatePagination = (filter: QueryFilter) => {
    setPaging({ ...filter });
    refresh();
  };

  useEffect(() => {
    loadData(httpClient.thesis.find({ requestBody: { ...filter, filter: paging } })).then(onChange);
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

      <Select
        placeholder={translate("status")}
        options={thesisOptions}
        value={filter.status}
        onSingleValue={(v: ThesisStatus | undefined) => setFilter({ ...filter, status: v })}
        optionRender={i => renderThesisStatus(i, language)}
        width="min-w-xs"
        clearable
        searchable
      />
      <Select
        placeholder={translate("has-keywords")}
        options={yesNoOptions}
        value={filter.hasKeywords as boolean | undefined}
        onSingleValue={(v: boolean | undefined) => setFilter({ ...filter, hasKeywords: v })}
        optionRender={(i: boolean | undefined) => yesNoOptions.find(o => o.value === i)?.label}
        width="min-w-xs"
        clearable
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
