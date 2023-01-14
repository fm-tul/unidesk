import {
  DepartmentDto,
  FacultyDto,
  SchoolYearDto,
  Severity,
  SimpleJsonResponse,
  StudyProgrammeDto,
  TeamDto,
  TeamLookupDto,
  ThesisOutcomeDto,
  ThesisTypeDto,
  UserFunction,
  UserLookupDto,
} from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { guestHttpClient, httpClient } from "@core/init";
import { EnKeys, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { R, RR } from "@locales/R";
import { KeywordDto } from "@models/KeywordDto";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import { UserDto } from "@models/UserDto";
import { useContext, useEffect, useState } from "react";
import Latex from "react-latex";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "throttle-debounce";
import * as Yup from "yup";

import { Moment } from "components/HistoryInfo";
import { KeywordSelector } from "components/KeywordSelector";
import { ArrayField } from "components/mui/ArrayField";
import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { toPromiseArray, useFetch, useQuery, useSingleQuery } from "hooks/useFetch";
import { useOpenClose } from "hooks/useOpenClose";
import { useStepper } from "hooks/useStepper";
import { renderTeam } from "models/cellRenderers/TeamRenderer";
import { renderThesisStatus } from "models/cellRenderers/ThesisStatusRenderer";
import { renderUser, renderUserLookup } from "models/cellRenderers/UserRenderer";
import { link_pageThesisDetail, link_pageThesisEdit } from "routes/links";
import { Button } from "ui/Button";
import { CreateConfirmDialog as confirmWith } from "ui/Confirm";
import { FormField } from "ui/FormField";
import { Menu } from "ui/Menu";
import { Modal } from "ui/Modal";
import { generatePrimitive, Select, SelectOption, SelectProps, TId } from "ui/Select";
import { UiColors } from "ui/shared";
import { Step, Stepper } from "ui/Stepper";
import { TextField, TextFieldProps } from "ui/TextField";
import { getPersistedObject, persistObject } from "utils/persistentUtils";
import { toCamelCase } from "utils/stringUtils";

import { ClipboardFromBpDp } from "./plugins/ClipboardFromBpDp";
import { thesisValidationSchema as schema, thesisInitialValues } from "./thesisSchema";
import { Debug } from "components/Debug";
import { UnideskComponent } from "components/UnideskComponent";

type T = ThesisDto;
type errorObj = { message: string; severity?: Severity };
const PERSISTED_OBJECT_KEY = `thesis.new.${GUID_EMPTY}`;
type thesisProps = keyof ThesisDto;
type thesisErrorObject = { [k in thesisProps]?: errorObj };
type thesisTouchedObject = { [k in thesisProps]?: boolean };

interface PageThesisNewProps {
  initialValues?: ThesisDto;
}
export const ThesisEdit = (props: PageThesisNewProps) => {
  const { language } = useContext(LanguageContext);
  const { initialValues } = props;
  const persistentObject = getPersistedObject<ThesisDto>(PERSISTED_OBJECT_KEY);

  const [dto, _setDto] = useState<ThesisDto>((initialValues ?? thesisInitialValues) as ThesisDto);
  const isNew = dto.id === GUID_EMPTY;
  const [errors, setErrors] = useState<thesisErrorObject>({});
  const [touched, setTouched] = useState<thesisTouchedObject>({});
  const { step, nextStep, prevStep, hasNextStep, hasPrevStep, setStep } = useStepper(2);
  const { open, close, isOpen } = useOpenClose(false);
  const navigate = useNavigate();

  const { data: enums, isLoading: enumsLoading } = useFetch(() => guestHttpClient.enums.allEnums());
  const [loading, setLoading] = useState(false);
  const isLoading = enumsLoading || loading;
  const departments = generateOptions(enums?.departments, language);
  const schoolYears = (enums?.schoolYears ?? []).map(i => ({ key: i.id, value: i, label: i.name }));
  const studyProgrammes = generateOptions(enums?.studyProgrammes, language);
  const thesisOutcomes = generateOptions(enums?.thesisOutcomes, language);
  const thesisTypes = generateOptions(enums?.thesisTypes, language);
  const faculties = generateOptions(enums?.faculties, language);

  const allowedStatusesNewThesis = generatePrimitive([ThesisStatus.DRAFT, ThesisStatus.NEW] as ThesisStatus[], i =>
    renderThesisStatus(i, language)
  );
  const allowedStatusesEditThesis = generatePrimitive(Object.values(ThesisStatus) as ThesisStatus[], i => renderThesisStatus(i, language));

  const updateKeywords = (keywords: KeywordDto[]) => {
    setDto({ ...dto, keywords });
  };

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
          setErrors({});
          resolve(true);
        })
        .catch((e: Yup.ValidationError) => {
          let errors: thesisErrorObject = {};
          e.inner.forEach(({ path, message }) => {
            if (touched[path as thesisProps] === true || skipTouched) {
              errors[path as thesisProps] = { message };
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

    const canSubmit = isValid || (await confirmWith({ title: "Form is not valid", message: "Do you want to continue anyway?" }));
    if (canSubmit) {
      setLoading(true);
      httpClient.thesis
        .upsert({ requestBody: dto })
        .then(i => {
          if (isNew) {
            navigate(link_pageThesisEdit.navigate(i.id));
          } else {
            setDto(i);
            toast.success("Thesis saved");
          }
        })
        .catch((e: SimpleJsonResponse) => {
          if (e.errors) {
            let errorDict: thesisErrorObject = {};
            e.errors.forEach(error => {
              const propName = toCamelCase(error.propertyName!);
              errorDict[propName as thesisProps] = { message: error.errorMessage, severity: error.severity } as errorObj;
            });
            console.log(errorDict);
            setErrors(errorDict as thesisErrorObject);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <UnideskComponent name="ThesisEdit">
      <LoadingWrapper isLoading={isLoading} error="">
        {/* <Menu className="absolute top-0 right-0 bg-white" link="menu">
          <>
            {!!persistentObject && (
              <Button onClick={() => setDto(persistentObject.item)} sm text success justify="justify-end">
                <div className="flex flex-col">
                  {R("restore-work")}
                  <span className="text-xxs normal-case italic text-neutral-600">
                    <Moment date={persistentObject.date} />
                  </span>
                </div>
              </Button>
            )}
          </>
          <Button sm text onClick={open} justify="justify-end">
            Paste from clipboard
          </Button>

          <Button
            disabled={dto.id === GUID_EMPTY}
            sm
            text
            justify="justify-end"
            component={Link}
            to={link_pageThesisDetail.navigate(dto.id)}
          >
            Go to thesis detail
          </Button>
        </Menu> */}

        {!!dto.adipidno && (
          <div className="flex items-center gap-1">
            {RR("thesis-from-stag-id", language)}
            <Link className="code rounded bg-rose-50 text-sm text-rose-600" to={link_pageThesisDetail.navigate(dto.adipidno)}>
              {dto.adipidno}
            </Link>
          </div>
        )}
        {dto.id !== GUID_EMPTY && (
          <div className="flex items-center gap-1">
            <Button component={Link} text color="success" sm to={link_pageThesisDetail.navigate(dto.id)}>
              Go to thesis detail
            </Button>
          </div>
        )}
        <Stepper step={step} setStep={setStep}>
          <Step label={R("basic-information")} error={step0Invalid !== undefined}>
            <div className="grid grid-cols-2 gap-4">
              {/* row 1 - names */}
              <FormField as={TextField} required {...getProps(form, "nameCze")} />
              <FormField as={TextField} required {...getProps(form, "nameEng")} />

              {/* row 2 - abstracts */}
              <FormField as={TextField} multiline {...getProps(form, "abstractCze")} sm />
              <FormField as={TextField} multiline {...getProps(form, "abstractEng")} sm />

              {/* row 3 - school year, department, study programme */}
              <div className="col-span-2 grid grid-cols-3 items-start gap-4">
                <FormField
                  as={Select<SchoolYearDto>}
                  {...getPropsS(form, "schoolYearId", schoolYears)}
                  optionRender={(i: SchoolYearDto) => i.name}
                />
                <FormField
                  as={Select<DepartmentDto>}
                  {...getPropsS(form, "departmentId", departments)}
                  optionRender={getName}
                  textSize="sm"
                />
                <FormField
                  as={Select<StudyProgrammeDto>}
                  {...getPropsS(form, "studyProgrammeId", studyProgrammes)}
                  optionRender={getName}
                />
              </div>

              {/* row 4 - thesis type, outcome, status */}
              <div className="col-span-2 grid grid-cols-4 items-start gap-4">
                <FormField
                  as={Select<ThesisTypeDto>}
                  optionRender={getName}
                  classNameField="col-span-1"
                  {...(!!dto.thesisTypeId
                    ? getPropsS(form, "thesisTypeId", thesisTypes)
                    : { ...getPropsM(form, "thesisTypeCandidateIds", thesisTypes), clearable: true })}
                />

                <FormField
                  as={Select<FacultyDto>}
                  optionRender={getName}
                  classNameField="col-span-2"
                  {...getPropsS(form, "facultyId", faculties)}
                />

                <FormField
                  as={Select<ThesisStatus>}
                  {...getPropsS(form, "status", isNew ? allowedStatusesNewThesis : allowedStatusesEditThesis)}
                  classNameField="col-span-1"
                  optionRender={(i: ThesisStatus) => renderThesisStatus(i, language)}
                />

                <FormField
                  as={Select<ThesisOutcomeDto>}
                  {...getPropsM(form, "outcomeIds", thesisOutcomes)}
                  optionRender={getName}
                  clearable
                  classNameField="col-span-4"
                />
              </div>

              {/* row 5-6 - keywords */}
              <div className="col-span-2 flex items-baseline gap-2">
                <span className="font-medium">{RR("keywords", language)}:</span>
                <FormField
                  as={KeywordSelector}
                  onChange={updateKeywords}
                  max={20}
                  keywords={dto.keywords}
                  helperText={errors.keywords?.message}
                  classNameField="grow"
                  helperColor="error"
                />
              </div>
            </div>
          </Step>
          <Step label="Guidlines &amp; Literature">
            <div className="grid grid-cols-2 gap-4">
              <ArrayField label="Guidelines" value={form.dto.guidelines} setValue={v => form.setDto({ ...form.dto, guidelines: v })} />
              <ArrayField label="Literature" value={form.dto.literature} setValue={v => form.setDto({ ...form.dto, literature: v })} />
              <div className="prose">
                <ol>
                  {form.dto.guidelines.map((i, index) => (
                    <li key={index}>
                      <Latex throwOnError={false}>{i}</Latex>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="prose break-all">
                <ul>
                  {form.dto.literature.map((i, index) => (
                    <li key={index}>
                      <Latex throwOnError={false}>{i}</Latex>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Step>
          <Step label="Authors">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                as={Select<UserLookupDto>}
                searchable
                clearable
                multiple
                label={R("authors")}
                optionRender={renderUserLookup}
                options={(keyword: string) => toPromiseArray(httpClient.users.find({ requestBody: { keyword } }))}
                value={dto.authors.map(i => i.user)}
                onMultiValue={authors =>
                  form.setDto({ ...form.dto, authors: authors.map(user => ({ user, function: UserFunction.AUTHOR })) })
                }
              />
              <FormField
                as={Select<TeamLookupDto>}
                searchable
                clearable
                multiple
                label={R("teams")}
                optionRender={renderTeam}
                options={(keyword: string) => toPromiseArray(httpClient.team.findSimple({ requestBody: { keyword } }))}
                value={dto.teams}
                onMultiValue={teams => form.setDto({ ...form.dto, teams })}
              />
            </div>
          </Step>
        </Stepper>

        <div className="mt-auto flex justify-between">
          <div className="flex">
            <Button onClick={prevStep} disabled={!hasPrevStep} text>
              Prev
            </Button>

            <Button onClick={nextStep} disabled={!hasNextStep} text>
              Next
            </Button>
          </div>

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

          <Button onClick={handleSubmit}>{isNew ? RR("create", language) : RR("update", language)}</Button>
        </div>

        {isOpen && (
          <Modal open={isOpen} onClose={close} width="md" className="rounded-md bg-neutral-200 p-6">
            <ClipboardFromBpDp setThesis={setDto} thesis={dto} />
          </Modal>
        )}

        <div>
          <Debug value={dto} title="dto" noRoot />
          <Debug value={errors} title="errors" noRoot />
          <Debug value={touched} title="touched" noRoot />
        </div>
      </LoadingWrapper>
    </UnideskComponent>
  );
};

interface formData<T> {
  dto: T;
  setDto(dto: T): void;
  errors: { [k in keyof T]?: errorObj };
  touched: { [k in keyof T]?: boolean };
  setTouched(touched: { [k in keyof T]?: boolean }): void;
}

type INameDto = { id: string; nameCze: string; nameEng: string };

const getProps = <T,>(formData: formData<T>, prop: keyof T) => {
  const { dto, setDto, errors, touched, setTouched } = formData;
  const helperText = errors[prop]?.message;
  const helperColor = !helperText ? undefined : errors[prop]?.severity === 1 ? "warning" : "error";

  return {
    value: dto[prop] as any,
    label: R(prop as EnKeys),
    helperText,
    helperColor,
    onChange: (e: React.ChangeEvent<any>) => {
      setDto({ ...dto, [prop]: e.target.value });
    },
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as TextFieldProps;
};

const getPropsS = <TDto extends TId | string>(formData: formData<T>, prop: keyof T, options?: SelectOption<TDto>[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;
  const helperText = errors[prop]?.message;
  const helperColor = !helperText ? undefined : errors[prop]?.severity === 1 ? "warning" : "error";

  return {
    options: options ?? [],
    placeholder: R(prop as EnKeys),
    value: dto[prop] === null ? "" : dto[prop],
    helperText,
    helperColor,
    onSingleValue: k => setDto({ ...dto, [prop]: typeof k === "string" ? k : k?.id }),
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as SelectProps<TDto>;
};

const getPropsM = <TDto extends TId>(formData: formData<T>, prop: keyof T, options?: SelectOption<TDto>[] | null) => {
  const { dto, setDto, errors, touched, setTouched } = formData;
  const helperText = errors[prop]?.message;
  const helperColor = !helperText ? undefined : errors[prop]?.severity === 1 ? "warning" : "error";

  return {
    multiple: true,
    options: options ?? [],
    placeholder: R(prop as EnKeys),
    value: dto[prop] === null ? "" : dto[prop],
    helperText,
    helperColor,
    onMultiValue: k => setDto({ ...dto, [prop]: k.map(i => i.id) }),
    onBlur: () => {
      setTouched({ ...touched, [prop]: true });
    },
  } as SelectProps<TDto>;
};

const getName = <T extends INameDto>(item: T | null | undefined, language?: LanguagesId) => {
  if (!item) {
    return "";
  }
  return language === "cze" ? item.nameCze : item.nameEng;
};

const generateOptions = <T extends INameDto>(items: T[] | null | undefined, language?: LanguagesId): SelectOption<T>[] => {
  if (!items) {
    return [];
  }

  return items.map(i => ({
    key: i.id,
    value: i,
    label: language === "cze" ? i.nameCze : i.nameEng,
  }));
};

export interface PageThesisEditProps {
  id?: string;
}
export const PageThesisEdit = (props: PageThesisEditProps) => {
  const params = useParams<{ id: string }>();
  const id = params.id ?? props.id;
  const isNew = id === undefined;

  if (isNew) {
    return <ThesisEdit initialValues={thesisInitialValues as ThesisDto} />;
  }

  const { data: thesis, isLoading, error, loadData } = useSingleQuery<ThesisDto | undefined>(undefined);
  useEffect(() => {
    loadData(httpClient.thesis.getOne({ id }));
  }, [id]);

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      {!!thesis && <ThesisEdit initialValues={thesis} />}
    </LoadingWrapper>
  );
};

export default PageThesisEdit;
