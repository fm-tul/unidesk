import { QueryFilter, ThesisDto, ThesisStatus } from "@api-client";
import { All as YesNoAll } from "@api-client/constants/YesNo";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { useContext, useEffect, useState } from "react";

import { PagedResponse, Paging } from "components/Paging";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { useDebounceState } from "hooks/useDebounceState";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useOpenClose } from "hooks/useOpenClose";
import { usePaging } from "hooks/usePaging";
import { useRefresh } from "hooks/useRefresh";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { Button } from "ui/Button";
import { Menu } from "ui/Menu";
import { Modal } from "ui/Modal";
import { generatePrimitive, Select } from "ui/Select";
import { TextField } from "ui/TextField";

import { FilterBar } from "../../components/FilterBar";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { ThesisEdit } from "./PageThesisEdit";

export const PageThesisList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [selectedThesis, setSelectedThesis] = useState<ThesisDto>();
  const { open, close, isOpen } = useOpenClose(false);
  const { refresh, refreshIndex } = useRefresh();
  const { language } = useContext(LanguageContext);
  const thesisOptions = generatePrimitive(Object.values(ThesisStatus) as ThesisStatus[], i => renderThesisStatus(i, language));
  const yesNo = generatePrimitive(YesNoAll.map(i => i.value), i => YesNoAll.find(j => j.value === i)?.[language] ?? i);

  const [theses, setTheses] = useState<ThesisDto[]>([]);

  // persisted
  const { filter, setFilter } = usePaging({}, "thesis-list.paging");
  const [status, setStatus] = useLocalStorage<ThesisStatus | undefined>("thesis-list.status", undefined);
  const [hasKeywords, setHasKeywords] = useLocalStorage<string | undefined>("thesis-list.hasKeywords", undefined);
  const [keyword, setKeyword, debounceKeyword] = useDebounceState<string>("");

  const editThesis = (thesis: ThesisDto) => {
    setSelectedThesis(thesis);
    open();
  };

  const newThesis = () => {
    setSelectedThesis(undefined);
    open();
  };

  const applyNewFilter = (newFilter: QueryFilter) => {
    setFilter(newFilter);
    refresh();
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient.thesis
      .find({
        requestBody: {
          filter,
          status,
          keyword,
          hasKeywords: !hasKeywords ? undefined : hasKeywords === "yes" ? true : hasKeywords === "no" ? false : undefined,
        },
      })
      .then(i => {
        setTheses(i.items);
        setFilter(i.filter);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [status, hasKeywords, refreshIndex, debounceKeyword]);

  return (
    <LoadingWrapper error={error} isLoading={isLoading}>
      {isOpen && (
        <Modal open={isOpen} onClose={close} y="top" height="xl" className="bg-slate-100 p-6">
          <div className="flex h-full flex-col content-between">
            <ThesisEdit initialValues={selectedThesis} />
          </div>
        </Modal>
      )}

      {theses && (
        <div>
          <FilterBar>
            <Select
              label={R("status")}
              options={thesisOptions}
              value={status}
              onValue={(_, v) => setStatus(v)}
              optionRender={i => renderThesisStatus(i, language)}
              width="min-w-xs"
              clearable
              searchable
            />
            <Select
              label={R("has-keywords")}
              options={yesNo}
              value={hasKeywords}
              onValue={(_, v) => setHasKeywords(v)}
              optionRender={i => YesNoAll.find(j => j.value === i)?.[language] ?? i}
              width="min-w-xs"
              clearable
            />
            <TextField label={R("search")} value={keyword} onValue={setKeyword} className="grow" />
            <Paging filter={filter} onValue={applyNewFilter} className="ml-auto" />
          </FilterBar>

          <div className="flex justify-end">
            <Menu link="menu" pop="right">
              <Button text justify="justify-start" onClick={newThesis}>
                Create new thesis
              </Button>
            </Menu>
          </div>

          <h1>{R("topics")}</h1>
          {theses.map(thesis => (
            <ThesisSimpleView thesis={thesis} key={thesis.id} onClick={editThesis} />
          ))}
        </div>
      )}
    </LoadingWrapper>
  );
};

export default PageThesisList;
