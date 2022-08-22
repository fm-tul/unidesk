import { useEffect, useState } from "react";
import { ThesisDto, ThesisStatus } from "@api-client";
import { FilterBar } from "../../components/FilterBar";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { httpClient } from "@core/init";
import { R } from "@locales/R";
import { RequestInfo } from "../../components/utils/RequestInfo";
import { PageThesisNew } from "./PageThesisNew";
import { KeyValue } from "utils/KeyValue";
import { SimpleSelect } from "ui/SimpleSelect";
import { Button } from "ui/Button";
import { Menu } from "ui/Menu";
import { Modal } from "ui/Modal";
import { useOpenClose } from "hooks/useOpenClose";

const yesNoOptions = [
  { key: "yes", value: "yes" },
  { key: "no", value: "no" },
] as KeyValue[];

export const PageThesisList = () => {
  /* causes following warning:
  react_devtools_backend.js:4026 Warning: React has detected a change in the order of Hooks called by PageThesisList. 
  This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

    Previous render            Next render
    ------------------------------------------------------
  1. useState                   useState
  2. useState                   useState
  3. useState                   useState
  4. useState                   useState
  5. useState                   useState
  6. useEffect                  useEffect
  7. undefined                  useContext
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  */
  // const { error, isLoading, data: theses } = useFetch(() => httpClient.thesis.getAll({ pageSize: 30 * 2, status, hasKeywords }), [status, hasKeywords]);

  const [status, setStatus] = useState<ThesisStatus>();
  const [hasKeywords, setHasKeywords] = useState<KeyValue>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [theses, setTheses] = useState<ThesisDto[]>([]);
  const { open, close, isOpen } = useOpenClose(false);

  useEffect(() => {
    setIsLoading(true);
    httpClient.thesis
      .getAll({
        pageSize: 30 * 2,
        status,
        hasKeywords: !hasKeywords ? undefined : hasKeywords.value === "yes" ? true : hasKeywords.value === "no" ? false : undefined,
      })
      .then(setTheses)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [status, hasKeywords]);

  return (
    <>
      <RequestInfo error={error} isLoading={isLoading} />
      <div className="flex justify-end">
        <Menu icon="menu" pop="right">
          <Button text justify="justify-start" onClick={open}>
            Create new thesis
          </Button>
        </Menu>
      </div>

      <Modal open={isOpen} onClose={close} y="top" height="lg" className="bg-slate-100 p-6">
        <div className="flex flex-col content-between h-full">
          <PageThesisNew />
        </div>
      </Modal>

      {theses && true && (
        <div>
          <FilterBar>
            <SimpleSelect
              label={R("status")}
              options={Object.keys(ThesisStatus).map(i => i as ThesisStatus)}
              value={status}
              onValue={(_, v) => setStatus(v)}
              required={false}
              deselectLabel={R("all")}
              fullWidth={false}
            />
            <SimpleSelect
              label={R("has-keywords")}
              options={yesNoOptions}
              value={hasKeywords?.key}
              onValue={(_, v) => setHasKeywords(v)}
              required={false}
              deselectLabel={R("all")}
              fullWidth={false}
            />
          </FilterBar>

          <h1>{R("topics")}</h1>
          {theses.map(thesis => (
            <ThesisSimpleView thesis={thesis} key={thesis.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default PageThesisList;
