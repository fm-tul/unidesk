import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { ThesisDto, ThesisStatus } from "@api-client";
import { FilterBar } from "../../components/FilterBar";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { httpClient } from "@core/init";
import { useFetch } from "../../hooks/useFetch";
import { R } from "@locales/R";
import { RequestInfo } from "../../components/utils/RequestInfo";
import { PageThesisNew } from "./PageThesisNew";

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
  const [hasKeywords, setHasKeywords] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [theses, setTheses] = useState<ThesisDto[]>([]);

  useEffect(() => {
    setIsLoading(true);
    httpClient.thesis
      .getAll({ pageSize: 30 * 2, status, hasKeywords })
      .then(setTheses)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [status, hasKeywords]);

  return (
    <>
      <RequestInfo error={error} isLoading={isLoading} />
      <PageThesisNew />

      {theses && (
        <div>
          <FilterBar>
            <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }} size="small">
              <InputLabel id="status-select-label">{R("status")}</InputLabel>
              <Select label={R("status")} value={status ?? ""} onChange={(e) => setStatus(e.target.value as ThesisStatus)}>
                <MenuItem value="">
                  <em>{R("all")}</em>
                </MenuItem>
                {Object.keys(ThesisStatus).map((key) => (
                  <MenuItem value={key} key={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ minWidth: 160 }} size="small">
              <InputLabel id="status-select-label">{R("has-keywords")}</InputLabel>
              <Select
                label={R("has-keywords")}
                value={hasKeywords ?? ""}
                onChange={(e) => setHasKeywords(e.target.value == "" ? undefined : e.target.value == "true")}
              >
                <MenuItem value="">
                  <em>{R("all")}</em>
                </MenuItem>
                <MenuItem value="true">{R("yes")}</MenuItem>
                <MenuItem value="false">{R("no")}</MenuItem>
              </Select>
            </FormControl>
          </FilterBar>

          <h1>{R("topics")}</h1>
          {theses.map((thesis) => (
            <ThesisSimpleView thesis={thesis} key={thesis.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default PageThesisList;
