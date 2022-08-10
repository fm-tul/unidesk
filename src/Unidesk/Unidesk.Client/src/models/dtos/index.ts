import { DepartmentDto, FacultyDto, SchoolYearDto, ThesisOutcomeDto, ThesisTypeDto, StudyProgrammeDto } from "@api-client";
import { EMPTY_GUID } from "@core/config";
import { EditorPropertiesOf } from "models/typing";

export const propertiesDepartmentDto: EditorPropertiesOf<DepartmentDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "medium", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesFacultyDto: EditorPropertiesOf<FacultyDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "medium", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesThesisOutcomeDto: EditorPropertiesOf<ThesisOutcomeDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesSchoolYearDto: EditorPropertiesOf<SchoolYearDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },

  start: { value: "", required: true },
  end: { value: "", required: true },
};

export const propertiesThesisTypeDto: EditorPropertiesOf<ThesisTypeDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "medium", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesStudyProgrammeDto: EditorPropertiesOf<StudyProgrammeDto> = {
  id: { value: EMPTY_GUID, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "medium", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};
