import { EMPTY_GUID } from "@core/config";
import { guestHttpClient } from "@core/init";
import { EnKeys, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { useContext, useEffect, useState } from "react";
import { MdChecklist } from "react-icons/md";
import { debounce } from "throttle-debounce";
import * as Yup from "yup";

import { Moment } from "components/HistoryInfo";
import { ArrayField } from "components/mui/ArrayField";
import { useFetch } from "hooks/useFetch";
import { useOpenClose } from "hooks/useOpenClose";
import { useStepper } from "hooks/useStepper";
import { Button } from "ui/Button";
import { Menu } from "ui/Menu";
import { Modal } from "ui/Modal";
import { SimpleSelect, SimpleSelectProps } from "ui/SimpleSelect";
import { Step, Stepper } from "ui/Stepper";
import { TextField } from "ui/TextField";
import { getPersistedObject, persistObject } from "utils/persistentUtils";

import { ClipboardFromBpDp } from "./plugins/ClipboardFromBpDp";
import { thesisValidationSchema as schema, thesisInitialValues } from "./thesisSchema";
import { KeywordSelector } from "components/KeywordSelector";
import { KeywordDto } from "@models/KeywordDto";

type T = ThesisDto;
const PERSISTED_OBJECT_KEY = `thesis.new.${EMPTY_GUID}`;
type thesisProps = keyof ThesisDto;
type thesisErrorObject = { [k in thesisProps]?: string };
type thesisTouchedObject = { [k in thesisProps]?: boolean };

const allowedStatuses = [ThesisStatus.DRAFT, ThesisStatus.NEW].map(i => ({ id: i, value: i }));
export const PageThesisNew = () => {
  const { language } = useContext(LanguageContext);
  const persistentObject = getPersistedObject<ThesisDto>(PERSISTED_OBJECT_KEY);

  const [dto, _setDto] = useState<ThesisDto>(thesisInitialValues as ThesisDto);
  const [errors, setErrors] = useState<thesisErrorObject>({});
  const [touched, setTouched] = useState<thesisTouchedObject>({});
  const { step, nextStep, prevStep, hasNextStep, hasPrevStep } = useStepper(2);
  const { open, close, isOpen } = useOpenClose(false);

  const { data: enums } = useFetch(() => guestHttpClient.enums.allEnums());
  const departments = generateName(enums?.departments, language);
  const schoolYears = enums?.schoolYears ?? [];
  const studyProgrammes = generateName(enums?.studyProgrammes, language);
  const thesisOutcomes = generateName(enums?.thesisOutcomes, language);
  const thesisTypes = generateName(enums?.thesisTypes, language);

  const updateKeywords = (keywords: KeywordDto[]) => {
    setDto({ ...dto, keywords });
  }

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
    <>
      <Menu className="absolute top-0 right-0" icon="menu">
        <>
          {!!persistentObject && (
            <Button onClick={() => setDto(persistentObject.item)} sm text success justify="justify-start">
              <div className="flex flex-col">
                {R("restore-work")}
                <span className="text-xxs normal-case italic text-neutral-600">
                  <Moment date={persistentObject.date} />
                </span>
              </div>
            </Button>
          )}
        </>
        <Button sm text onClick={open} justify="justify-start">
          Paste from clipboard
        </Button>
      </Menu>
      <Stepper step={step}>
        <Step label={R("basic-information")} error={step0Invalid !== undefined}>
          <div className="grid grid-cols-2 gap-4">
            {/* row 1 - names */}
            <TextField required {...getProps(form, "nameCze")} />
            <TextField required {...getProps(form, "nameEng")} />

            {/* row 2 - abstracts */}
            <TextField maxRows={7} rows={7} {...getProps(form, "abstractCze")} />
            <TextField maxRows={7} rows={7} {...getProps(form, "abstractEng")} />

            {/* row 3 - school year, department, study programme */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <SimpleSelect {...getPropsS(form, "schoolYearId", schoolYears)} />
              <SimpleSelect {...getPropsS(form, "departmentId", departments)} />
              <SimpleSelect {...getPropsS(form, "studyProgrammeId", studyProgrammes)} />
            </div>

            {/* row 4 - thesis type, outcome, status */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <SimpleSelect {...getPropsM(form, "thesisTypeCandidateIds", thesisTypes)} />
              <SimpleSelect {...getPropsM(form, "outcomeIds", thesisOutcomes)} />
              <SimpleSelect {...getPropsS(form, "status", allowedStatuses)} />
            </div>

            {/* row 5-6 - keywords */}
            <div className="col-span-2 flex flex-col gap-2">
              <KeywordSelector onChange={updateKeywords} max={20} keywords={dto?.keywords ?? []} />
            </div>
          </div>
        </Step>
        <Step label="Guidlines &amp; Literature">
          <div className="grid grid-cols-2 gap-4">
            <ArrayField label="Guidelines" value={form.dto.guidelines ?? []} setValue={v => form.setDto({ ...form.dto, guidelines: v })} />
            <ArrayField label="Literature" value={form.dto.literature ?? []} setValue={v => form.setDto({ ...form.dto, literature: v })} />
          </div>
        </Step>
        <Step label="Authors">
          <div className="grid grid-cols-2 gap-4">
            {/* <SimpleSelect {...getPropsM(form, "", thesisOutcomes)} /> */}
            {/* <ArrayField label="Authors" value={form.dto.authors ?? []} setValue={v => form.setDto({ ...form.dto, authors: v })} /> */}
          </div>
        </Step>
      </Stepper>

      <div className="mt-auto flex">
        <Button onClick={prevStep} disabled={!hasPrevStep} text>
          Prev
        </Button>

        <Button onClick={nextStep} disabled={!hasNextStep} text>
          Next
        </Button>

        {step == 2 && <Button onClick={handleSubmit}>Create</Button>}
      </div>

      <Modal open={isOpen} onClose={close} width="md" className="rounded-md bg-neutral-200 p-6">
        <ClipboardFromBpDp setThesis={setDto} thesis={dto} />
      </Modal>

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
    </>
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

const getPropsS = <TDto extends IDto>(formData: formData<T>, prop: keyof T, options?: TDto[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;

  return {
    options: options ?? [],
    label: R(prop as EnKeys),
    value: dto[prop],
    helperText: errors[prop],
    helperColor: !!errors[prop],
    onValue: k => setDto({ ...dto, [prop]: k }),
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as SimpleSelectProps<TDto>;
};

const getPropsM = <TDto extends IDto>(formData: formData<T>, prop: keyof T, options?: TDto[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;

  return {
    multiple: true,
    options: options ?? [],
    label: R(prop as EnKeys),
    value: dto[prop] ?? [],
    helperText: errors[prop],
    helperColor: !!errors[prop],
    onValue: k => setDto({ ...dto, [prop]: k }),
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as SimpleSelectProps<TDto>;
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
