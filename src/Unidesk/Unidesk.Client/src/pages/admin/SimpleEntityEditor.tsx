import {
  DepartmentDto,
  FacultyDto,
  SchoolYearDto,
  SimpleJsonResponse,
  StudyProgrammeDto,
  ThesisOutcomeDto,
  ThesisTypeDto,
} from "@api-client";
import { useFormik } from "formik";
import { getFormikProps as inputProps } from "hooks/getFormikProps";
import { Button, TextField } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useGetSetDeleteFetch } from "hooks/useFetch";
import { RequestInfo } from "components/utils/RequestInfo";
import { LanguageContext } from "@locales/LanguageContext";
import { EMPTY_GUID } from "@core/config";
import { KeyValue } from "utils/KeyValue";
import { LanguagesId } from "@locales/all";
import { EditorPropertiesOf, extractInitialValues, extractYupSchema, extractColDefinition } from "models/typing";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { UButton } from "components/mui/UButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

type TItem = DepartmentDto | FacultyDto | ThesisOutcomeDto | SchoolYearDto | ThesisTypeDto | StudyProgrammeDto;

interface SimpleEntityEditor2Props<T> {
  schema: EditorPropertiesOf<T>;
  getAll: () => Promise<T[]>;
  upsertOne: (item: T) => Promise<T>;
  deleteOne: (id: string) => Promise<SimpleJsonResponse>;
  toKV: (language?: LanguagesId, items?: T[]) => KeyValue[];
}
export const SimpleEntityEditor = <T extends TItem>(props: SimpleEntityEditor2Props<T>) => {
  const { schema, getAll, upsertOne: createOrUpdate, toKV, deleteOne } = props;
  const { language } = useContext(LanguageContext);

  const formik = useFormik({
    initialValues: extractInitialValues(schema) as T,
    validationSchema: extractYupSchema(schema),
    onSubmit: values => {
      console.log(values);
    },
  });

  const { data, savedData, isLoading, isSaving, isDeleting, error, saveItem, deleteItem, loadData } = useGetSetDeleteFetch(
    () => getAll(),
    () => createOrUpdate(formik.values),
    () => deleteOne(formik.values.id)
  );
  const dataKV = useMemo(() => toKV(language, data), [data, language]);
  const [itemId, setItemId] = useState<string>("");

  const handleSaveClick = async () => {
    const item = await saveItem();
    await loadData();
    setItemId(item.id);
    formik.setFieldValue("id", item.id);
  };

  const handleDeleteClick = async () => {
    await deleteItem();
    await loadData();
    setItemId("");
  };

  const setItemToEdit = (id: string) => {
    setItemId(id);
    const item = (data ?? []).find(i => i.id === id) ?? (extractInitialValues(schema) as T);
    formik.setValues(item);
  };

  return (
    <div className="flex flex-col gap-4">
      <RequestInfo isLoading={isLoading} error={error} />
      {dataKV.length > 0 && (
        <div className="flex flex-col gap-4 ">
          <DataGrid
            className="no-pagination data-grid"
            selectionModel={itemId}
            rows={data!}
            columns={extractColDefinition(schema)}
            onRowClick={i => setItemToEdit(i.row.id)}
            autoHeight
          />
          <div className="flex justify-end">
            <Button variant="contained" startIcon={<AddIcon />} color="primary" size="small" onClick={() => setItemToEdit(EMPTY_GUID)}>
              Add new
            </Button>
          </div>
        </div>
      )}

      {itemId !== "" && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            {Object.entries(schema)
              .filter(([key, prop]) => prop.hidden !== true)
              .map(([key, prop]) => {
                const { colspan = 2, size = "small", breakAfter = false, type = "string" } = prop;
                // col-span-1 col-span-2 col-span-3 col-span-4
                const colSpanClass = `col-span-${colspan}`;
                if (type === "string") {
                  return (
                    <>
                      <TextField
                        className={colSpanClass}
                        key={key}
                        label={key}
                        name={key}
                        {...inputProps<T>(formik, key as keyof T, size)}
                      />
                      {breakAfter && <span className="hidden md:block" />}
                    </>
                  );
                }

                if (type === "date") {
                  return (
                    <LocalizationProvider key={key} dateAdapter={AdapterMoment}>
                      <DatePicker
                        key={key}
                        label="Basic example"
                        value={(formik.values as any)[key] as string}
                        onChange={v => {
                          formik.setFieldValue(key, v);
                        }}
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  );
                }
                return null;
              })}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <UButton position="end" label="Save" icon={<SaveIcon />} onClick={handleSaveClick} loading={isSaving} />
              {savedData && <span className="text-sm text-green-600 animate-in fade-in">Saved</span>}
            </div>
            {itemId !== EMPTY_GUID && (
              <div>
                <UButton
                  outlined
                  error
                  icon={<DeleteIcon />}
                  position="end"
                  onClick={handleDeleteClick}
                  loading={isDeleting}
                  label="Delete"
                />
              </div>
            )}
          </div>
        </>
      )}
      {/* <pre>
        <code>{JSON.stringify(formik.values, null, 2)}</code>
      </pre> */}
    </div>
  );
};
