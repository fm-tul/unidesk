import { DepartmentDto, FacultyDto, SchoolYearDto, SimpleJsonResponse, StudyProgrammeDto, ThesisOutcomeDto, ThesisTypeDto } from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useFormik } from "formik";
import React, { useContext, useMemo, useState } from "react";
import { MdAdd, MdDelete, MdSave } from "react-icons/md";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { RequestInfo } from "components/utils/RequestInfo";
import { getFormikProps as inputProps } from "hooks/getFormikProps";
import { useGetSetDeleteFetch } from "hooks/useFetch";
import { EditorPropertiesOf, extractColDefinition, extractInitialValues, extractYupSchema } from "models/typing";
import { Button } from "ui/Button";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { KeyValue } from "utils/KeyValue";

type TItem = DepartmentDto | FacultyDto | ThesisOutcomeDto | SchoolYearDto | ThesisTypeDto | StudyProgrammeDto;

interface SimpleEntityEditor2Props<T extends TItem> {
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
    () => deleteOne(formik.values.id),
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
    <LoadingWrapper className="flex flex-col gap-4" isLoading={isLoading || isSaving || isDeleting} error={error}>
      {dataKV.length > 0 && (
        <div className="flex flex-col gap-4 ">
          <Table
            clientSort
            className="no-pagination data-grid"
            selected={itemId}
            rows={data}
            columns={extractColDefinition(schema, language)}
            onRowClick={i => setItemToEdit(i.id)}
            autoHeight
          />
          <div className="flex justify-end">
            <Button sm onClick={() => setItemToEdit(GUID_EMPTY)}>
              {RR("add-new", language)} <MdAdd className="text-base" />
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
                const { colspan = 2, size = "sm", breakAfter = false, type = "string" } = prop;
                // col-span-1 col-span-2 col-span-3 col-span-4
                const colSpanClass = `col-span-${colspan}`;
                if (type === "string") {
                  return (
                    <React.Fragment key={key}>
                      <TextField className={colSpanClass} label={key} name={key} {...inputProps<T>(formik, key as keyof T, size)} />
                      {breakAfter && <span className="hidden md:block" />}
                    </React.Fragment>
                  );
                }

                if (type === "date") {
                  return (
                    <React.Fragment key={key}>
                      <TextField
                        type="datetime-local"
                        className={colSpanClass}
                        label={key}
                        name={key}
                        {...inputProps<T>(formik, key as keyof T, size)}
                      />
                      {breakAfter && <span className="hidden md:block" />}
                    </React.Fragment>
                  );
                }

                // not implemented yet
                return null;
              })}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Button className="peer" onClick={handleSaveClick} loading={isSaving}>
                Save <MdSave className="text-base peer-loading:hidden" />
              </Button>
              {savedData && <span className="text-sm text-green-600 animate-in fade-in">Saved</span>}
            </div>
            {itemId !== GUID_EMPTY && (
              <div>
                <Button outlined error className="peer" onClick={handleDeleteClick} loading={isDeleting}>
                  Delete <MdDelete className="text-base peer-loading:hidden" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      {/* <pre>
        <code>{JSON.stringify(formik.values, null, 2)}</code>
      </pre> */}
    </LoadingWrapper>
  );
};
