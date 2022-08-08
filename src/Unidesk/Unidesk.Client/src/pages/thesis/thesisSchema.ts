import { EMPTY_GUID } from "@core/config";
import { ThesisDto } from "@models/ThesisDto";
import { ThesisStatus } from "@models/ThesisStatus";
import * as Yup from "yup";

const REQUIRED = "required";
const MIN_3 = "min-3";

export const thesisInitialValues: Partial<ThesisDto> = {
  id: EMPTY_GUID,
  nameCze: "",
  nameEng: "",

  abstractCze: "",
  abstractEng: "",

  status: ThesisStatus.DRAFT,

  thesisTypeCandidateIds: [],
  outcomeIds: [],

  schoolYearId: "",
  departmentId: "",
  studyProgrammeId: "",

  // advanced section
  guidelines: ["", "", ""],
  literature: ["", "", ""],

  // users: [],
  // teams: [],
};

export const thesisValidationSchema = Yup.object({
  nameCze: Yup.string().required(REQUIRED),
  nameEng: Yup.string().required(REQUIRED),

  abstractCze: Yup.string(),
  abstractEng: Yup.string(),

  status: Yup.string().required(REQUIRED),

  thesisTypeCandidates: Yup.array(),

  schoolYearId: Yup.string().required(REQUIRED),
  departmentId: Yup.string().required(REQUIRED),
  studyProgrammeId: Yup.string().required(REQUIRED),
  outcomeIds: Yup.array().required(REQUIRED).min(3, MIN_3),

  // advanced section
  guidelines: Yup.array(),
  literature: Yup.array(),

  // users: Yup.array().required("Required"),
});
