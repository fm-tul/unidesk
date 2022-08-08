import { DepartmentDto } from "@api-client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getFormikProps as inputProps, getFormikPropsSelect as selectProps } from "hooks/getFormikProps";
import { Button, TextField } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useFetch } from "hooks/useFetch";
import { httpClient } from "@core/init";
import { RequestInfo } from "components/utils/RequestInfo";
import { SelectField } from "components/mui/SelectField";
import { LanguageContext } from "@locales/LanguageContext";
import { EMPTY_GUID } from "@core/config";
import { mergeModels } from "utils/mergeModels";

const initialValues: Partial<DepartmentDto> = {
  id: EMPTY_GUID,
  nameEng: "",
  nameCze: "",
  code: "",
  descriptionEng: "",
  descriptionCze: "",
};

export const DepartmentEditor = () => {
  const { language } = useContext(LanguageContext);
  const [showEditor, setShowEditor] = useState(false);
  const [itemId, setItemId] = useState<string>("");
  const { data, isLoading, error } = useFetch(() => httpClient.enums.departmentGetAll());
  const dataKV = useMemo(
    () => (data ?? []).map(i => ({ key: i.id, value: `${i.code} - ${language === "cze" ? i.nameCze : i.nameEng}` })),
    [data, language]
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      id: Yup.string().required(),
      nameEng: Yup.string().required("required"),
      nameCze: Yup.string().required("required"),
      code: Yup.string().required("required"),
      descriptionEng: Yup.string(),
      descriptionCze: Yup.string(),
    }),
    onSubmit: values => {
      console.log(values);
    },
  });

  const setItemToEdit = (id: string) => {
    // can fetch or use local data
    setItemId(id);
    if (!data || data.length === 0) {
      return;
    }

    const item = data.find(i => i.id === id);
    if (!item) {
      return;
    }
    formik.setValues(mergeModels(initialValues, item));
    setShowEditor(true);
  };

  const startCreateNew = () => {
    setShowEditor(true);
    setItemId(EMPTY_GUID);
    formik.setValues({ ...initialValues });
  };

  const handleSave = async () => {
    const item = formik.values as DepartmentDto;
    const ok = await httpClient.enums.departmentCreateOrUpdate({ requestBody: item });
  };

  return (
    <div className="flex flex-col gap-4">
      <RequestInfo isLoading={isLoading} error={error} />

      {!!data && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <span>Select Department: </span>
            <div className="flex flex-col gap-4">
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
          </div>

          <div className="flex gap-4">
            <span>or</span>
            <Button variant="contained" color="primary" size="small" onClick={startCreateNew}>
              Add new
            </Button>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="flex flex-col gap-4">
          <hr></hr>
          <div className="flex gap-4">
            <TextField label="Code" name="code" {...inputProps<DepartmentDto>(formik, "code", "medium", false)} />
          </div>
          <div className="flex gap-4">
            <TextField label="Name (Eng)" name="nameEng" {...inputProps<DepartmentDto>(formik, "nameEng")} />
            <TextField label="Name (Cze)" name="nameCze" {...inputProps<DepartmentDto>(formik, "nameCze")} />
          </div>
          <div className="flex gap-4">
            <TextField
              label="Description (Eng)"
              name="descriptionEng"
              {...inputProps<DepartmentDto>(formik, "descriptionEng")}
              multiline
              rows={3}
            />
            <TextField
              label="Description (Cze)"
              name="descriptionCze"
              {...inputProps<DepartmentDto>(formik, "descriptionCze")}
              multiline
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button type="submit" variant="text" color="secondary">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
