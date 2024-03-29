import {
  DepartmentDto,
  FacultyDto,
  SchoolYearDto,
  SimpleJsonResponse,
  StudyProgrammeDto,
  ThesisOutcomeDto,
  ThesisTypeDto,
} from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useFormik } from "formik";
import React, { useContext, useMemo, useState } from "react";
import { MdAdd, MdDelete, MdSave } from "react-icons/md";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { getFormikProps as inputProps } from "hooks/getFormikProps";
import { useListModel } from "hooks/useFetch";
import { EditorPropertiesOf, extractColDefinition, extractInitialValues, extractYupSchema } from "models/typing";
import { Button } from "ui/Button";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { KeyValue } from "utils/KeyValue";
import { UnideskComponent } from "components/UnideskComponent";
import { addToDT, toDateLocalString } from "utils/dateUtils";
import { classnames } from "ui/shared";
import { toast } from "react-toastify";

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

  const model = useListModel<T>(
    () => getAll(),
    () => createOrUpdate(formik.values),
    () => deleteOne(formik.values.id),
    []
  );
  const data = model.data ?? ([] as T[]);

  const dataKV = useMemo(() => toKV(language, data), [data, language]);
  const [itemId, setItemId] = useState<string>("");

  const handleSaveClick = async () => {
    const item = await model.setQuery.mutateAsync(formik.values);
    setItemId(item.id);
    formik.setFieldValue("id", item.id);
    toast.success(RR("saved", language));
  };

  const handleDeleteClick = async () => {
    await model.deleteQuery.mutateAsync(formik.values.id);
    setItemId("");
  };

  const setItemToEdit = (id: string) => {
    setItemId(id);
    const item = (data ?? []).find(i => i.id === id) ?? (extractInitialValues(schema) as T);
    formik.setValues(item);
  };

  return (
    <UnideskComponent name="SimpleEntityEditor">
      <LoadingWrapper className="flex flex-col gap-4" isLoading={model.isLoading} error={model.error}>
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
                    const addToDate = (amount: number, unit: moment.unitOfTime.DurationConstructor) => {
                      const date = formik.values[key as keyof TItem];
                      formik.setFieldValue(key as keyof TItem, toDateLocalString(addToDT(date, amount, unit)));
                    };
                    return (
                      <div className={classnames(colSpanClass, "flex  items-center gap-2")} key={key}>
                        <TextField
                          type="date"
                          fullWidth
                          label={key}
                          name={key}
                          {...inputProps<T>(formik, key as keyof T, size)}
                        />
                        <div className="flex flex-col gap-1">
                          <Button variant="text" size="sm" onClick={() => addToDate(1, "day")}>
                            +&nbsp;day
                          </Button>
                          <Button variant="text" size="sm" color="error" onClick={() => addToDate(-1, "day")}>
                            -&nbsp;day
                          </Button>
                        </div>
                        {breakAfter && <span className="hidden md:block" />}
                      </div>
                    );
                  }

                  // not implemented yet
                  return null;
                })}
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <Button className="peer" onClick={handleSaveClick} loading={model.setQuery.isLoading}>
                  Save <MdSave className="text-base peer-loading:hidden" />
                </Button>
                {model.setQuery.isSuccess && <span className="text-sm text-green-600 animate-in fade-in">Saved</span>}
              </div>
              {itemId !== GUID_EMPTY && (
                <div>
                  <Button outlined error className="peer" onConfirmedClick={handleDeleteClick} loading={model.deleteQuery.isLoading}>
                    Delete <MdDelete className="text-base peer-loading:hidden" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};
