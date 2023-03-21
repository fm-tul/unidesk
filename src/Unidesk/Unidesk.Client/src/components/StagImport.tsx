import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR, Translate } from "@locales/R";
import { ThesisLookupDto } from "@models/ThesisLookupDto";
import { ThesisListRenderer } from "models/itemRenderers/ThesisListRenderer";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "ui/Button";
import { Select, SelectOption } from "ui/Select";
import { TextField } from "ui/TextField";

import { FilterBar } from "./FilterBar";

export const StagImport = () => {
  const { language } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();
  const years = [...new Set([2021, 2019, 2020, 2022, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, currentYear])]
    .sort((a, b) => b - a)
    .map(String)
    .map(i => ({ key: i, label: i, value: i })) as SelectOption<string>[];

  const departments = ["NTI", "MTI", "ITE"].map(i => ({ key: i, label: i, value: i })) as SelectOption<string>[];
  const [textData, setTextData] = useState<string>("");
  const [year, setYear] = useState(currentYear.toString());
  const [department, setDepartment] = useState(departments[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [resposeData, setResponseData] = useState<ThesisLookupDto[]>();
  const [error, setError] = useState<string>("");
  const [batchIndex, setBatchIndex] = useState(0);
  const totalBatches = years.length * departments.length;

  const importOneFromStag = async (year: number, department: string) => {
    setIsLoading(true);
    setError("");

    const response = await httpClient.import
      .importFromStag({
        year,
        department,
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
        return [];
      });

    setResponseData(response);
    setIsLoading(false);
    return response;
  };

  const importFromStag = async () => {
    await importOneFromStag(parseInt(year), department);
  };

  const importAllFromStag = async () => {
    setIsLoading(true);
    let index = 1;
    let items = [] as any[];
    for (const year of years) {
      for (const department of departments) {
        setBatchIndex(index);
        const batchItems = await importOneFromStag(parseInt(year.value), department.value);
        items = [...items, ...batchItems];
        index++;
      }
    }
    setIsLoading(false);
    setBatchIndex(0);
    setResponseData(items);
  };

  const importFromText = async () => {
    setIsLoading(true);
    httpClient.import
      .importOneFromStag({ requestBody: { data: textData } })
      .then(response => {
        setResponseData([response]);
        setIsLoading(false);
        toast.success(RR("import-successful", language));
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col">
      <FilterBar disabled={isLoading}>
        <Select options={years} value={year} onValue={(_, v) => setYear(v!)} sm />
        <Select options={departments} value={department} onValue={(_, v) => setDepartment(v!)} sm />

        {/* import one */}
        <Button className="ml-auto min-w-xxs" error={!!error} onClick={importFromStag} loading={isLoading}>
          Import
        </Button>

        {/* import all */}
        <FilterBar className="flex flex-col">
          <Button
            loading={isLoading}
            disableClass=""
            className="with-progress ml-auto h-full min-w-xs before:bg-gradient-to-l before:from-lime-600 before:to-lime-400"
            onClick={importAllFromStag}
            style={{ "--progress": batchIndex > 0 ? `${(batchIndex / totalBatches) * 100}%` : "0" } as any}
          >
            <div>Import all {batchIndex > 0 && `(${batchIndex} / ${totalBatches})`}</div>
          </Button>
        </FilterBar>
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

          {/* <div className="flex flex-col gap-1 text-sm">
            {resposeData
              .map(thesis => (
                <ThesisSimpleView thesis={thesis} key={thesis.id} withEdit />
              ))}
          </div> */}
          <ThesisListRenderer rows={resposeData} clientSort />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Import from text</h3>
        <TextField rows={20} value={textData} onValue={setTextData} className="font-mono" spellCheck={false} />
        <Button onClick={importFromText} loading={isLoading}>
          Import
        </Button>
      </div>
    </div>
  );
};

export default StagImport;
