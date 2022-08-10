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
import { SelectField } from "components/mui/SelectField";
import { LanguageContext } from "@locales/LanguageContext";
import { EMPTY_GUID } from "@core/config";
import { KeyValue } from "utils/KeyValue";
import { LanguagesId } from "@locales/all";
import { EditorPropertiesOf, extractInitialValues, extractYupSchema } from "models/typing";

type TItem = DepartmentDto | FacultyDto | ThesisOutcomeDto | SchoolYearDto | ThesisTypeDto | StudyProgrammeDto;

interface SimpleEntityEditor2Props<T> {
  schema: EditorPropertiesOf<T>;
  getAll: () => Promise<T[]>;
  upsertOne: (item: T) => Promise<T>;
  deleteOne: (id: string) => Promise<SimpleJsonResponse>;
  toKV: (language?: LanguagesId, items?: T[]) => KeyValue[];
}
export const SimpleEntityEditor2 = <T extends TItem>(props: SimpleEntityEditor2Props<T>) => {
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
    await saveItem();
    await loadData();
  };

  const handleDeleteClick = async () => {
    await deleteItem();
    await loadData();
  };

  const setItemToEdit = (id: string) => {
    setItemId(id);
    const item = (data ?? []).find(i => i.id === id) ?? (extractInitialValues(schema) as T);
    formik.setValues(item);
  };

  console.log(formik.values, formik.errors);
  return (
    <div className="flex flex-col gap-4">
      <RequestInfo isLoading={isLoading} error={error} />
      {dataKV.length > 0 && (
        <div className="flex gap-4">
          <div className="grow">
            <SelectField
              items={dataKV}
              props={{
                value: itemId,
                variant: "standard",
                className: "min-w-[220px]",
                onChange: (e: any) => setItemToEdit(e.target.value),
              }}
            />
          </div>
          or
          <Button variant="contained" color="primary" onClick={() => setItemToEdit(EMPTY_GUID)}>
            Add new
          </Button>
        </div>
      )}

      {itemId !== "" && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            {Object.entries(schema)
              .filter(([key, prop]) => prop.hidden !== true)
              .map(([key, prop]) => {
                const { colspan = 2, size = "small", breakAfter = false } = prop;
                // col-span-1 col-span-2 col-span-3 col-span-4
                const colSpanClass = `col-span-${colspan}`;
                return (
                  <>
                    <TextField className={colSpanClass} key={key} label={key} name={key} {...inputProps<T>(formik, key as keyof T, size)} />
                    {breakAfter && <span className="hidden md:block" />}
                  </>
                );
              })}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Button variant="contained" color="primary" onClick={handleSaveClick} disabled={isSaving} sx={{ minWidth: 120 }}>
                {isSaving ? (
                  <>
                    <span className="spinner"></span>Saving
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
              {savedData && <span className="text-sm text-green-600 animate-in fade-in">Saved</span>}
            </div>
            {itemId !== EMPTY_GUID && (
              <div>
                <Button variant="outlined" color="error" onClick={handleDeleteClick} disabled={isDeleting} sx={{ minWidth: 120 }}>
                  {isDeleting ? (
                    <>
                      <span className="spinner"></span>Deleting
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
