import { EMPTY_GUID } from "@core/config";
import { guestHttpClient, httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { Button, FormControl, InputLabel, Step, StepContent, StepLabel, Stepper, TextField } from "@mui/material";
import { Moment } from "components/HistoryInfo";
import { ArrayField } from "components/mui/ArrayField";
import { ChipDualLangRenderer, SelectField } from "components/mui/SelectField";
import { useFormik } from "formik";
import { getFormikProps as inputProps, getFormikPropsSelect as selectProps } from "hooks/getFormikProps";
import { useFetch } from "hooks/useFetch";
import { useStepper } from "hooks/useStepper";
import { useContext, useEffect, useMemo } from "react";
import { getPersistedObject, persistObject } from "utils/persistentUtils";
import { sortBy } from "utils/sorting";
import { toKV } from "utils/transformUtils";

import { thesisInitialValues, thesisValidationSchema } from "./thesisSchema";

type T = ThesisDto;
const PERSISTED_OBJECT_KEY = `thesis.new.${EMPTY_GUID}`;
export const PageThesisNew = () => {
  const { language } = useContext(LanguageContext);
  const { step, nextStep, prevStep, hasNextStep, hasPrevStep } = useStepper(2);

  const formik = useFormik<Partial<ThesisDto>>({
    initialValues: thesisInitialValues,
    validationSchema: thesisValidationSchema,
    onSubmit: values => console.log(values),
  });

  const persistentObject = getPersistedObject<Partial<ThesisDto>>(PERSISTED_OBJECT_KEY);
  const { data: enums } = useFetch(() => guestHttpClient.enums.allEnums());
  const { departments, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes } = enums ?? {};

  const thesisTypesKV = useMemo(() => toKV(language, thesisTypes), [thesisTypes, language]);
  const schoolYearsKV = useMemo(() => sortBy(toKV(language, schoolYears, false), i => i.value), [schoolYears, language]);
  const departmentsKV = useMemo(
    () => (departments ?? []).map(i => ({ key: i.id, value: `${i.code} - ${language === "cze" ? i.nameCze : i.nameEng}` })),
    [departments, language]
  );
  const outcomesKV = useMemo(() => toKV(language, thesisOutcomes), [thesisOutcomes, language]);
  const studyProgrammesKV = useMemo(() => toKV(language, studyProgrammes), [studyProgrammes, language]);
  const statuses = [ThesisStatus.DRAFT, ThesisStatus.NEW].map(i => ({ key: i, value: i }));

  useEffect(() => {
    // NOTE: this causes an weird behavior when editing only ArrayFields as they are note marked as touched
    if (Object.keys(formik.touched).length) {
      persistObject(PERSISTED_OBJECT_KEY, formik.values);
    }
  }, [formik.values]);

  const BasicInfo = (
    <div className="mt-4 flex flex-col gap-4">
      {/* row 1 - names */}
      <div className="flex w-full gap-4">
        <TextField label={R("name-lang", "CZE")} {...inputProps<T>(formik, "nameCze")} />
        <TextField label={R("name-lang", "ENG")} {...inputProps<T>(formik, "nameEng")} />
      </div>

      {/* row 2 - abstracts */}
      <div className="flex w-full gap-4">
        <TextField multiline rows={3} label={R("abstract-lang", "CZE")} {...inputProps<T>(formik, "abstractCze")} />
        <TextField multiline rows={3} label={R("abstract-lang", "ENG")} {...inputProps<T>(formik, "abstractEng")} />
      </div>

      {/* row 3 - school year, department, status */}
      <div className="flex w-full gap-4">
        <SelectField label={R("school-year")} props={selectProps<T>(formik, "schoolYearId")} items={schoolYearsKV} />
        <SelectField label={R("department")} props={selectProps<T>(formik, "departmentId")} items={departmentsKV} />
        <SelectField label={R("study-programme")} props={{ ...inputProps<T>(formik, "studyProgrammeId") }} items={studyProgrammesKV} />
      </div>

      {/* row 4 - thesis type, outcome, study programme */}
      <div className="flex w-full gap-4">
        <SelectField
          label={R("thesis-type")}
          props={{ ...selectProps<T>(formik, "thesisTypeCandidateIds"), multiple: true }}
          items={thesisTypesKV}
          renderValue={ChipDualLangRenderer(thesisTypesKV)}
        />
        <SelectField
          label={R("outcomes")}
          props={{ ...inputProps<T>(formik, "outcomeIds"), multiple: true }}
          items={outcomesKV}
          renderValue={ChipDualLangRenderer(outcomesKV)}
        />
        <SelectField label={R("status")} props={selectProps<T>(formik, "status")} items={statuses} />
      </div>
    </div>
  );

  return (
    <div className="my-5 bg-black/5 p-4">
      <div className="flex justify-between">
        <h1>New Thesis</h1>
        {!!persistentObject && (
          <div className="flex flex-col items-end">
            <Button onClick={() => formik.setValues(persistentObject.item)} size="small" color="secondary">
              {R("restore-work")}
            </Button>
            <span className="text-xs italic">
              <Moment date={persistentObject.date} />
            </span>
          </div>
        )}
      </div>
      <Stepper activeStep={step} orientation="vertical">
        <Step>
          <StepLabel>Basic Information</StepLabel>
          <StepContent>{BasicInfo}</StepContent>
        </Step>
        <Step>
          <StepLabel>Guidlines &amp; Literature</StepLabel>
          <StepContent>
            <div className="mt-4 flex gap-4">
              <ArrayField label="Guidlines" value={formik.values.guidelines ?? []} setValue={v => formik.setFieldValue("guidelines", v)} />
              <ArrayField label="Literature" value={formik.values.literature ?? []} setValue={v => formik.setFieldValue("literature", v)} />
            </div>
          </StepContent>
        </Step>
      </Stepper>

      <Button onClick={prevStep} disabled={!hasPrevStep}>
        Prev
      </Button>

      <Button onClick={nextStep} disabled={!hasNextStep}>
        Next
      </Button>

      {step === 2 && (
        <Button onClick={formik.submitForm} variant="contained" color="primary">
          Create
        </Button>
      )}

      <pre>
        <code>{JSON.stringify(formik.values, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(formik.errors, null, 2)}</code>
      </pre>
    </div>
  );
};
