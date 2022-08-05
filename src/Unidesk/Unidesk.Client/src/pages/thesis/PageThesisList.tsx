import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { ThesisStatus } from "../../api-client";
import { FilterBar } from "../../components/FilterBar";
import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { httpClient } from "../../core/init";
import { useFetch } from "../../hooks/useFetch";
import { R, Translate } from "../../locales/R";

export const PageThesisList = () => {
  const [status, setStatus] = useState<ThesisStatus>();
  const [hasKeywords, setHasKeywords] = useState<boolean>();
  const {
    error,
    isLoading,
    data: theses,
  } = useFetch(() => httpClient.thesis.getAll({ pageSize: 30 * 2, status, hasKeywords }), [status, hasKeywords]);

  if (error) {
    return (
      <>
        {error && (
          <span className="text-red-500">
            <Translate value="error-occurred" />: {error}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      {isLoading && <span className="spinner-colors big"></span>}

      {theses && (
        <div>
          <FilterBar>
            <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }} size="small">
              <InputLabel id="status-select-label">{R("status")}</InputLabel>
              <Select label={R("status")} value={status} onChange={(e) => setStatus(e.target.value as ThesisStatus)}>
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
                value={status}
                onChange={(e) => setHasKeywords(e.target.value == "" ? undefined : e.target.value == "yes")}
              >
                <MenuItem value="">
                  <em>{R("all")}</em>
                </MenuItem>
                <MenuItem value="yes">{R("yes")}</MenuItem>
                <MenuItem value="no">{R("no")}</MenuItem>
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
