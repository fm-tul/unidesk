import { KeywordDto, KeywordUsedCount, QueryFilter } from "@api-client";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { useDebounceState } from "hooks/useDebounceState";
import { useOpenClose } from "hooks/useOpenClose";
import { Button } from "ui/Button";
import { Modal } from "ui/Modal";
import { Select } from "ui/Select";
import { TextField } from "ui/TextField";

import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { useQuery } from "../../hooks/useFetch";
import { KeywordMerger } from "./KeywordMerger";
import { link_pageKeywordDetail } from "routes/links";

const usedCountOptions = [
  { label: ">1", key: "moreThan1", value: KeywordUsedCount.MORE_THAN1 },
  { label: ">5", key: "moreThan5", value: KeywordUsedCount.MORE_THAN5 },
  { label: ">10", key: "moreThan10", value: KeywordUsedCount.MORE_THAN10 },
];
export const PageKeywordList = () => {
  const { language } = useContext(LanguageContext);

  const [searchText, setSearchText, debouceSearch] = useDebounceState<string>("");
  const [usedCount, setUsedCount] = useState<KeywordUsedCount>();
  const { open, close, isOpen } = useOpenClose();

  const { filter, data, error, isLoading, refreshIndex, refresh, loadData, setFilter } = useQuery<KeywordDto>({ pageSize: 80 });

  const barWidth = 100;
  const theMostFrequent = Math.max(1, Math.max(...data.map(k => k.used ?? 0)));
  const theMostFrequentWidth = (value: number) => (value / theMostFrequent) * barWidth;

  const doSearch = async () => {
    const requestBody = {
      filter,
      keyword: searchText,
      usedCount: !!usedCount ? usedCount : undefined,
    };
    await loadData(httpClient.keywords.getAll({ requestBody }));
  };


  const updateFilter = (filter: QueryFilter) => {
    setFilter({ ...filter });
    refresh();
  };

  useEffect(() => {
    if (!isLoading) {
      doSearch();
    }
  }, [refreshIndex, usedCount, debouceSearch]);


  return (
    <LoadingWrapper error={error} isLoading={isLoading}>
      <h1>Keywords</h1>
      <Button onClick={open}>Merge Keywords...</Button>

      {isOpen && <Modal open={isOpen} onClose={close} height="xl" className="rounded bg-white p-6">
        <KeywordMerger />
      </Modal>}

      <FilterBar>
        <TextField loading={isLoading} sm value={searchText} onValue={setSearchText} label={RR("search", language)} onEnter={doSearch} />
        <Select
          sm
          width="w-xs"
          clearable
          optionRender={i => usedCountOptions.find(o => o.value === i)?.label}
          options={usedCountOptions}
          value={usedCount}
          onValue={(_, v) => setUsedCount(v)}
          label={RR("keyword-used-count", language)}
        />
        <Paging className="ml-auto" filter={filter} onValue={updateFilter} />
      </FilterBar>

      {data && (
        <div className="flex flex-col gap-1">
          {data
            .filter(i => i.locale === language)
            .map(keyword => (
              <div key={keyword.id} className="flex items-center gap-1">
                <div className="flex h-[14px] justify-end overflow-hidden rounded-xl bg-blue-200" style={{ width: barWidth }}>
                  <div className="bg-blue-500/40" style={{ width: theMostFrequentWidth(keyword.used ?? 0) }}></div>
                </div>
                <Button component={Link} to={link_pageKeywordDetail.navigate(keyword.id)} text sm>
                  {keyword.value} ({keyword.used}×)
                </Button>
                <HistoryInfoIcon item={keyword as any} />
              </div>
            ))}
        </div>
      )}
      {data.length > 20 && (
        <FilterBar>
          <Paging className="ml-auto" filter={filter} onValue={updateFilter} />
        </FilterBar>
      )}
    </LoadingWrapper>
  );
};

export default PageKeywordList;
