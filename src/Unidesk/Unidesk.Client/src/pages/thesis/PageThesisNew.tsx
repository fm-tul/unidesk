import { EMPTY_GUID } from "@core/config";
import { guestHttpClient } from "@core/init";
import { EnKeys, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { Moment } from "components/HistoryInfo";
import { ArrayField } from "components/mui/ArrayField";
import { useFormik } from "formik";
import { getFormikProps as inputProps, getFormikPropsSelect as selectProps, getFormikPropsSelect2 } from "hooks/getFormikProps";
import { useFetch } from "hooks/useFetch";
import { useStepper } from "hooks/useStepper";
import { extractInitialValues } from "models/typing";
import { Key, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "ui/Button";
import { Select, Select2MultipleProps, Select2SingleProps } from "ui/Select";
import { Step, Stepper } from "ui/Stepper";
import { TextField } from "ui/TextField";
import { KeyValue } from "utils/KeyValue";
import { getPersistedObject, persistObject } from "utils/persistentUtils";
import { sortBy } from "utils/sorting";
import { toKV } from "utils/transformUtils";
import * as Yup from "yup";
import { thesisInitialValues, thesisValidationSchema as schema } from "./thesisSchema";
import { debounce } from "throttle-debounce";

type T = ThesisDto;
const PERSISTED_OBJECT_KEY = `thesis.new.${EMPTY_GUID}`;
// export const PageThesisNew2 = () => {
//   const { language } = useContext(LanguageContext);
//   const { step, nextStep, prevStep, hasNextStep, hasPrevStep } = useStepper(2);

//   const formik = useFormik<Partial<ThesisDto>>({
//     initialValues: thesisInitialValues,
//     validationSchema: thesisValidationSchema,
//     onSubmit: values => console.log(values),
//   });

//   const persistentObject = getPersistedObject<Partial<ThesisDto>>(PERSISTED_OBJECT_KEY);
//   const { data: enums } = useFetch(() => guestHttpClient.enums.allEnums());
//   const { departments, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes } = enums ?? {};

//   const thesisTypesKV = useMemo(() => toKV(language, thesisTypes), [thesisTypes, language]);
//   const schoolYearsKV = useMemo(() => sortBy(toKV(language, schoolYears, false), i => i.value), [schoolYears, language]);
//   const departmentsKV = useMemo(
//     () => (departments ?? []).map(i => ({ key: i.id, value: `${i.code} - ${language === "cze" ? i.nameCze : i.nameEng}` })),
//     [departments, language]
//   );
//   const outcomesKV = useMemo(() => toKV(language, thesisOutcomes), [thesisOutcomes, language]);
//   const studyProgrammesKV = useMemo(() => toKV(language, studyProgrammes), [studyProgrammes, language]);
//   const statuses = [ThesisStatus.DRAFT, ThesisStatus.NEW].map(i => ({ key: i, value: i }));

//   const schoolYearProps = getFormikPropsSelect2<T>(formik, "schoolYearId") as any;
//   const departmentProps = getFormikPropsSelect2<T>(formik, "departmentId") as any;
//   const studyProgrammeProps = getFormikPropsSelect2<T>(formik, "studyProgrammeId") as any;

//   const thesisTypeCandidatesProps = getFormikPropsSelect2<T>(formik, "thesisTypeCandidateIds") as any;
//   const outcomeIdsProps = getFormikPropsSelect2<T>(formik, "outcomeIds") as any;
//   const statusProps = getFormikPropsSelect2<T>(formik, "status") as any;

//   useEffect(() => {
//     // NOTE: this causes an weird behavior when editing only ArrayFields as they are note marked as touched
//     if (Object.keys(formik.touched).length) {
//       persistObject(PERSISTED_OBJECT_KEY, formik.values);
//     }
//   }, [formik.values]);

//   try {
//     a.validate({}, { abortEarly: false }).catch((e: Yup.ValidationError) => {
//       debugger;
//       console.log(e);
//     });
//   } catch (error) {
//     console.log(error);
//   }
//   const BasicInfo = (
//     <div className="mt-4 flex flex-col gap-4">
//       {/* row 1 - names */}
//       <div className="flex w-full gap-4">
//         <TextField label={R("name-lang", "CZE")} {...inputProps<T>(formik, "nameCze", "md")} />
//         <TextField label={R("name-lang", "ENG")} {...inputProps<T>(formik, "nameEng", "md")} />
//       </div>

//       {/* row 2 - abstracts */}
//       <div className="flex w-full gap-4">
//         <TextField rows={3} label={R("abstract-lang", "CZE")} {...inputProps<T>(formik, "abstractCze", "md")} />
//         <TextField rows={3} label={R("abstract-lang", "ENG")} {...inputProps<T>(formik, "abstractEng", "md")} />
//       </div>

//       {/* row 3 - school year, department, status */}
//       <div className="flex w-full gap-4">
//         <Select
//           label={R("school-year")}
//           options={schoolYearsKV.map(i => i.key)}
//           {...schoolYearProps}
//           valueGetter={i => schoolYearsKV.find(j => j.key === i)?.value}
//         />
//         <Select
//           label={R("department")}
//           {...departmentProps}
//           options={departmentsKV.map(i => i.key)}
//           valueGetter={i => departmentsKV.find(j => j.key === i)?.value}
//         />
//         <Select
//           label={R("study-programme")}
//           {...studyProgrammeProps}
//           options={studyProgrammesKV.map(i => i.key)}
//           valueGetter={i => studyProgrammesKV.find(j => j.key === i)?.value}
//         />
//       </div>

//       {/* row 4 - thesis type, outcome, study programme */}
//       <div className="flex w-full gap-4">
//         <Select<string>
//           multiple
//           label={R("thesis-type")}
//           {...thesisTypeCandidatesProps}
//           options={thesisTypesKV.map(i => i.key)}
//           valueGetter={i => thesisTypesKV.find(j => j.key === i)?.value}
//         />
//         <Select<string>
//           options={outcomesKV.map(i => i.key)}
//           label={R("outcomes")}
//           {...outcomeIdsProps}
//           multiple
//           valueGetter={i => outcomesKV.find(j => j.key === i)?.value}
//         />
//         <Select
//           label={R("status")}
//           {...statusProps}
//           options={statuses.map(i => i.key)}
//           valueGetter={i => statuses.find(j => j.key === i)?.value}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="my-5 bg-black/5 p-4">
//       <div className="flex justify-between">
//         <h1>New Thesis</h1>
//         {!!persistentObject && (
//           <div className="flex flex-col items-end">
//             <Button onClick={() => formik.setValues(persistentObject.item)} sm text success>
//               {R("restore-work")}
//             </Button>
//             <span className="text-xs italic">
//               <Moment date={persistentObject.date} />
//             </span>
//           </div>
//         )}
//       </div>
//       <Stepper step={step}>
//         <Step label="Basic Information">{BasicInfo}</Step>
//         <Step label="Guidlines &amp; Literature">
//           <div className="mt-4 flex gap-4">
//             <ArrayField label="Guidlines" value={formik.values.guidelines ?? []} setValue={v => formik.setFieldValue("guidelines", v)} />
//             <ArrayField label="Literature" value={formik.values.literature ?? []} setValue={v => formik.setFieldValue("literature", v)} />
//           </div>
//         </Step>
//       </Stepper>

//       <Button onClick={prevStep} disabled={!hasPrevStep} text>
//         Prev
//       </Button>

//       <Button onClick={nextStep} disabled={!hasNextStep} text>
//         Next
//       </Button>

//       {step === 2 && <Button onClick={formik.submitForm}>Create</Button>}

//       <pre>
//         <code>{JSON.stringify(formik.values, null, 2)}</code>
//       </pre>
//       <pre>
//         <code>{JSON.stringify(formik.errors, null, 2)}</code>
//       </pre>
//     </div>
//   );
// };
type thesisProps = keyof ThesisDto;
type thesisErrorObject = { [k in thesisProps]?: string };
type thesisTouchedObject = { [k in thesisProps]?: boolean };

const allowedStatuses = [ThesisStatus.DRAFT, ThesisStatus.NEW].map(i => ({ id: i, value: i }));
export const PageThesisNew = () => {
  const { language } = useContext(LanguageContext);
  const [dto, _setDto] = useState<ThesisDto>(thesisInitialValues as ThesisDto);
  const [errors, setErrors] = useState<thesisErrorObject>({});
  const [touched, setTouched] = useState<thesisTouchedObject>({});
  const { step, nextStep, prevStep, hasNextStep, hasPrevStep } = useStepper(2);

  const persistentObject = getPersistedObject<ThesisDto>(PERSISTED_OBJECT_KEY);

  const { data: enums } = useFetch(() => guestHttpClient.enums.allEnums());
  const departments = generateName(enums?.departments, language);
  const schoolYears = enums?.schoolYears ?? [];
  const studyProgrammes = generateName(enums?.studyProgrammes, language);
  const thesisOutcomes = generateName(enums?.thesisOutcomes, language);
  const thesisTypes = generateName(enums?.thesisTypes, language);

  const step0Invalid =
    errors.nameCze ||
    errors.nameEng ||
    errors.abstractCze ||
    errors.abstractEng ||
    errors.schoolYearId ||
    errors.departmentId ||
    errors.studyProgrammeId ||
    errors.thesisTypeCandidateIds ||
    errors.outcomeIds;

  const validate = (skipTouched = false) => {
    return new Promise<boolean>((resolve, reject) => {
      schema
        .validate(dto, { abortEarly: false })
        .then(() => {
          console.log("valid");
          setErrors({});
          resolve(true);
        })
        .catch((e: Yup.ValidationError) => {
          let errors: thesisErrorObject = {};
          e.inner.forEach(({ path, message }) => {
            if (touched[path as thesisProps] === true || skipTouched) {
              errors[path as thesisProps] = message;
            }
          });
          setErrors(errors);
          resolve(false);
        });
    });
  };

  const validateDebounced = debounce(50, validate, { atBegin: false });

  useEffect(() => {
    if (JSON.stringify(dto) !== JSON.stringify(thesisInitialValues)) {
      persistObject(PERSISTED_OBJECT_KEY, dto);
    }

    validateDebounced();
  }, [dto, touched]);

  const setDto = (newDto: ThesisDto) => {
    _setDto(newDto);
  };

  const form: formData<T> = { dto, errors, setDto, touched, setTouched };

  const handleSubmit = async () => {
    const isValid = await validate(true);
    if (!isValid) {
      // // touch all fields
      const newTouched = { ...touched };
      Object.keys(thesisInitialValues).forEach(k => (newTouched[k as thesisProps] = true));
      setTouched(newTouched);
    }
  };

  return (
    <div>
      <div>
        {!!persistentObject && (
          <div className="flex flex-col items-end">
            <Button onClick={() => setDto(persistentObject.item)} sm text success>
              {R("restore-work")}
            </Button>
            <span className="text-xs italic">
              <Moment date={persistentObject.date} />
            </span>
          </div>
        )}
      </div>

      <Stepper step={step}>
        <Step label={R("basic-information")} error={step0Invalid !== undefined}>
          <div className="grid grid-cols-2 gap-4">
            {/* row 1 - names */}
            <TextField required {...getProps(form, "nameCze")} />
            <TextField required {...getProps(form, "nameEng")} />

            {/* row 2 - abstracts */}
            <TextField maxRows={5} rows={3} {...getProps(form, "abstractCze")} />
            <TextField maxRows={5} rows={3} {...getProps(form, "abstractEng")} />

            {/* row 3 - school year, department, study programme */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <Select {...getPropsS(form, "schoolYearId", schoolYears)} />
              <Select {...getPropsS(form, "departmentId", departments)} />
              <Select {...getPropsS(form, "studyProgrammeId", studyProgrammes)} />
            </div>

            {/* row 4 - thesis type, outcome, status */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <Select {...getPropsM(form, "thesisTypeCandidateIds", thesisTypes)} />
              <Select {...getPropsM(form, "outcomeIds", thesisOutcomes)} />
              <Select {...getPropsS(form, "status", allowedStatuses)} />
            </div>
          </div>
        </Step>
        <Step label="Guidlines &amp; Literature">
          <div className="grid grid-cols-2 gap-4">
            <ArrayField label="Guidelines" value={form.dto.guidelines ?? []} setValue={v => form.setDto({ ...form.dto, guidelines: v })} />
            <ArrayField label="Literature" value={form.dto.literature ?? []} setValue={v => form.setDto({ ...form.dto, literature: v })} />
          </div>
        </Step>
      </Stepper>
      <div className="flex ">
        <Button onClick={prevStep} disabled={!hasPrevStep} text>
          Prev
        </Button>

        <Button onClick={nextStep} disabled={!hasNextStep} text>
          Next
        </Button>

        {step > -1 && <Button onClick={handleSubmit}>Create</Button>}
      </div>

      {/* <div>
        <pre>
          <code>{JSON.stringify(dto, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(errors, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(touched, null, 2)}</code>
        </pre>
      </div> */}
    </div>
  );
};

interface formData<T> {
  dto: T;
  setDto(dto: T): void;
  errors: { [k in keyof T]?: string };
  touched: { [k in keyof T]?: boolean };
  setTouched(touched: { [k in keyof T]?: boolean }): void;
}

type IDto = { id: string };
type INameDto = { id: string; nameCze: string; nameEng: string };
const pluckIds = (items?: IDto[] | null) => {
  return (!items || items.length === 0 ? [] : items.map(i => i.id)) as string[];
};

const getProps = <T,>(formData: formData<T>, prop: keyof T) => {
  const { dto, setDto, errors, touched, setTouched } = formData;

  return {
    value: dto[prop] as any,
    label: R(prop as EnKeys),
    helperText: errors[prop],
    helperColor: !!errors[prop],
    onChange: (e: React.ChangeEvent<any>) => {
      setDto({ ...dto, [prop]: e.target.value });
    },
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  };
};

const valueGetterById = <T extends IDto>(items: T[], id: Key) => {
  const item = items.find(i => i.id === id);
  if (!item) {
    return "";
  }

  if ("value" in item) {
    return (item as any).value;
  }

  if ("name" in item) {
    return (item as any).name;
  }

  return id;
};

const getPropsS = <T, K extends IDto>(formData: formData<T>, prop: keyof T, options?: K[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;
  const optionsByKey = pluckIds(options);

  return {
    options: optionsByKey,
    label: R(prop as EnKeys),
    value: dto[prop] as unknown as Key,
    helperText: errors[prop],
    helperColor: !!errors[prop],
    valueGetter: (k: Key) => valueGetterById(options ?? [], k),
    onChange: (value: Key) => {
      setDto({ ...dto, [prop]: value });
    },
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as Select2SingleProps<Key>;
};

const getPropsM = <T, K extends IDto>(formData: formData<T>, prop: keyof T, options?: K[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;
  const optionsByKey = pluckIds(options);

  return {
    multiple: true,
    options: optionsByKey,
    label: R(prop as EnKeys),
    value: (dto[prop] as unknown as Key[]) ?? [],
    helperText: errors[prop],
    helperColor: !!errors[prop],
    valueGetter: (k: Key) => valueGetterById(options ?? [], k),
    onChange: (value: Key[]) => {
      setDto({ ...dto, [prop]: value });
    },
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as Select2MultipleProps<Key>;
};

const generateName = <T extends INameDto>(items: T[] | null | undefined, language?: LanguagesId) => {
  if (!items) {
    return [];
  }
  return items.map(i => ({
    id: i.id,
    name: language === "cze" ? i.nameCze : i.nameEng,
  }));
};
