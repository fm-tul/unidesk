import { DepartmentDto, FacultyDto, SchoolYearDto, ThesisOutcomeDto, ThesisTypeDto, StudyProgrammeDto } from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { EditorProperty } from "models/EditorProperty";
import { EditorPropertiesOf } from "models/typing";

export const propertiesDepartmentDto: EditorPropertiesOf<DepartmentDto> = {
  id: { value: GUID_EMPTY, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "lg", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesFacultyDto: EditorPropertiesOf<FacultyDto> = {
  id: { value: GUID_EMPTY, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "md", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesThesisOutcomeDto: EditorPropertiesOf<ThesisOutcomeDto> = {
  id: { value: GUID_EMPTY, required: true, hidden: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

type scProps = { id: EditorProperty, start: EditorProperty; end: EditorProperty; thesisDeadline: EditorProperty };
export const propertiesSchoolYearDto: scProps = {
  id: { value: GUID_EMPTY, required: true, hidden: true },

  start: { value: "", required: true, type: "date" },
  end: { value: "", required: true, type: "date" },
  thesisDeadline: { value: "", required: true, type: "date" },
};

export const propertiesThesisTypeDto: EditorPropertiesOf<ThesisTypeDto> = {
  id: { value: GUID_EMPTY, required: true, hidden: true },
  code: { value: "", colspan: 2, size: "md", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};

export const propertiesStudyProgrammeDto: EditorPropertiesOf<StudyProgrammeDto> = {
  id: { value: GUID_EMPTY, required: true, hidden: true },
  code: { value: "", required: true, colspan: 2, size: "md", breakAfter: true },

  nameCze: { value: "", required: true },
  nameEng: { value: "", required: true },

  descriptionCze: { value: "", required: false },
  descriptionEng: { value: "", required: false },
};
