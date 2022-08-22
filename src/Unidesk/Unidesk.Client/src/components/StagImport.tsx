import { useState } from "react";
import { httpClient } from "@core/init";
import { Translate } from "@locales/R";
import { FilterBar } from "./FilterBar";
import { ThesisSimpleView } from "./ThesisSimpleView";
import { Button } from "ui/Button";
import { LinearProgress } from "ui/LinearProgress";
import { SimpleSelect } from "ui/SimpleSelect";
import { toast } from "react-toastify";

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
        <SimpleSelect sm outlined options={years} value={year} onValue={e => setYear(e as number)} fullWidth={false} />
        <SimpleSelect sm outlined options={departments} value={department} onValue={e => setDepartment(e as string)} fullWidth={false} />

        {/* import one */}
        <Button className="ml-auto" error={!!error} onClick={importFromStag}>
          Import
          {isLoading && <span className="spinner white"></span>}
        </Button>

        {/* import all */}
        <div className="flex flex-col">
          <Button
            loading={isLoading}
            disableClass=""
            className="ml-auto h-full with-progress before:bg-gradient-to-l before:from-lime-600 before:to-lime-400"
            onClick={importAllFromStag}
            style={{'--progress': batchIndex > 0 ? `${(batchIndex / totalBatches) * 100}%` : "0"} as any}
          >
            <div>
              Import all {batchIndex > 0 && `(${batchIndex} / ${totalBatches})`}
            </div>
          </Button>
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
