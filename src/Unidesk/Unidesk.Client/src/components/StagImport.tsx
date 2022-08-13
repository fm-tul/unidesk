import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { httpClient } from "@core/init";
import { Translate } from "@locales/R";
import { FilterBar } from "./FilterBar";
import { ThesisSimpleView } from "./ThesisSimpleView";
import { Button } from "ui/Button";
import { Select } from "ui/Select";

export const StagImport = () => {
  const years = [2021, 2019, 2020, 2022];
  const departments = ["NTI", "MTI", "ITE"];

  const [year, setYear] = useState(years[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [resposeData, setResponseData] = useState<any[]>();
  const [error, setError] = useState<string>("");
  const [batchIndex, setBatchIndex] = useState(0);
  const totalBatches = years.length * departments.length;

  const importOneFromStag = async (year: number, department: string) => {
    setIsLoading(true);
    setError("");

    const response = await httpClient.import
      .getApiImportStag({
        year,
        department,
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
        return { data: [] };
      });

    setResponseData(response);
    setIsLoading(false);
    return response;
  };

  const importFromStag = async () => {
    await importOneFromStag(year, department);
  };

  const importAllFromStag = async () => {
    setIsLoading(true);
    let index = 1;
    let items = [] as any[];
    for (const year of years) {
      for (const department of departments) {
        setBatchIndex(index);
        const batchItems = await importOneFromStag(year, department);
        items = [...items, ...batchItems];
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        index++;
      }
    }
    setIsLoading(false);
    setBatchIndex(0);
    setResponseData(items);
  };

  return (
    <div>
      <FilterBar disabled={isLoading}>
        <Select sm outlined options={years} value={year} onChange={e => setYear(e as any)} />
        <Select sm outlined options={departments} value={department} onChange={e => setDepartment(e)} />

        {/* import one */}
        <Button className="ml-auto" error={!!error} onClick={importFromStag}>
          Import
          {isLoading && <span className="spinner white"></span>}
        </Button>

        {/* import all */}
        <div className="flex flex-col">
          <Button
            className="ml-auto h-full"
            onClick={importAllFromStag}
            // sx={batchIndex > 0 ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}}
          >
            Import all {batchIndex > 0 && `(${batchIndex} / ${totalBatches})`}
            {isLoading && <span className="spinner white"></span>}
          </Button>
          {batchIndex > 0 && <LinearProgress variant="determinate" value={(batchIndex / totalBatches) * 100} />}
        </div>
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
              .map(thesis => (
                <ThesisSimpleView thesis={thesis} key={thesis.id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StagImport;
