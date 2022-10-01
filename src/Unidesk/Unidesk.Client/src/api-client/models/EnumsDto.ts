/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentDto } from './DepartmentDto';
import type { FacultyDto } from './FacultyDto';
import type { SchoolYearDto } from './SchoolYearDto';
import type { StudyProgrammeDto } from './StudyProgrammeDto';
import type { ThesisOutcomeDto } from './ThesisOutcomeDto';
import type { ThesisTypeDto } from './ThesisTypeDto';

export type EnumsDto = {
    readonly _DtoType?: string | null;
    departments?: Array<DepartmentDto> | null;
    faculties?: Array<FacultyDto> | null;
    schoolYears?: Array<SchoolYearDto> | null;
    thesisOutcomes?: Array<ThesisOutcomeDto> | null;
    thesisTypes?: Array<ThesisTypeDto> | null;
    studyProgrammes?: Array<StudyProgrammeDto> | null;
};
