import {} from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { useContext, useState } from "react";
import { API_URL } from "../core/config";
import { httpClient } from "../core/init";
import { LanguageContext } from "../locales/LanguageContext";
import { Translate } from "../locales/R";
import { FilterBar } from "./FilterBar";
import { ThesisSimpleView } from "./ThesisSimpleView";

export const StagImport = () => {
  const years = [2021, 2019, 2020, 2022];
  const departments = ["NTI", "MTI", "ITE"];

  const [year, setYear] = useState(years[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [resposeData, setResponseData] = useState<any[]>();
  const [error, setError] = useState<string>("");
  const { language } = useContext(LanguageContext);

  const importFromStag = async () => {
    setIsLoading(true);
    setError("");

    const response = await httpClient.import
      .getApiImportStag({
        year,
        department,
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
        return { data: [] };
      });

    setResponseData(response);
    setIsLoading(false);
  };

  return (
    <div>
      <FilterBar disabled={isLoading}>
        <Select size="small" value={year} onChange={(e) => setYear(e.target.value as any)}>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>

        <Select size="small" value={department} onChange={(e) => setDepartment(e.target.value as any)}>
          {departments.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>

        <Button className="ml-auto" color={error ? "error" : "primary"} variant="contained" onClick={importFromStag}>
          Import
          {isLoading && <span className="spinner white"></span>}
        </Button>
      </FilterBar>

      {error && (
        <div className="text-red-500">
          <Translate value="error-occurred" />: {error}
        </div>
      )}

      {resposeData?.length === 0 && !error && (
        <div className="text-gray-500">
          <Translate value="imported-thesis-none" />
        </div>
      )}

      {resposeData && resposeData.length > 0 && (
        <div className="my-4 rounded-md border p-4 shadow-xl shadow-black/10">
          <div className="text-gray-500">
            <Translate value="imported-thesis" />: {resposeData.length}
          </div>

          <div className="flex flex-col gap-1 text-sm">
            {resposeData
              .sort((a, b) => Number(b.isNew) - Number(a.isNew))
              .map((thesis) => (
                <ThesisSimpleView thesis={thesis} key={thesis.id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StagImport;
