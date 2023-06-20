import { GUID_EMPTY } from "@core/config";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import * as Yup from "yup";

const REQUIRED = "required";
const MIN_3 = "min-3";

export const thesisInitialValues: Partial<ThesisDto> = {
  id: GUID_EMPTY,
  nameCze: "",
  nameEng: "",

  abstractCze: null,
  abstractEng: null,

  status: ThesisStatus.DRAFT,

  thesisTypeCandidateIds: [],
  outcomeIds: [],

  facultyId: "",
  schoolYearId: "",
  departmentId: "",
  studyProgrammeId: "",

  // advanced section
  guidelines: ["", "", ""],
  literature: ["", "", ""],

  authors: [],
  supervisors: [],
  opponents: [],
  teams: [],
  keywords: [],
  thesisUsers: [],
};

export const thesisValidationSchema = Yup.object({
  nameCze: Yup.string().required(REQUIRED),
  nameEng: Yup.string().required(REQUIRED),

  abstractCze: Yup.string().nullable(),
  abstractEng: Yup.string().nullable(),

  status: Yup.string().required(REQUIRED),

  thesisTypeCandidates: Yup.array(),
  thesisTypeId: Yup.string().nullable(),

  facultyId: Yup.string().required(REQUIRED),
  schoolYearId: Yup.string().required(REQUIRED),
  departmentId: Yup.string().required(REQUIRED),
  studyProgrammeId: Yup.string().nullable(),

  outcomeIds: Yup.array().required(REQUIRED).min(3, MIN_3),

  // advanced section
  guidelines: Yup.array(),
  literature: Yup.array(),

  authors: Yup.array().required(REQUIRED),
  teams: Yup.array().required(REQUIRED),
});
