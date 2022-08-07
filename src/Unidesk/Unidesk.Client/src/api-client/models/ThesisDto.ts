/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentDto } from './DepartmentDto';
import type { Faculty } from './Faculty';
import type { KeywordThesisDto } from './KeywordThesisDto';
import type { SchoolYearDto } from './SchoolYearDto';
import type { StudyProgrammeDto } from './StudyProgrammeDto';
import type { ThesisOutcome } from './ThesisOutcome';
import type { ThesisStatus } from './ThesisStatus';
import type { ThesisType } from './ThesisType';
import type { TrackedEntityDto } from './TrackedEntityDto';
import type { UserDto } from './UserDto';

export type ThesisDto = (TrackedEntityDto & {
adipidno?: number;
needsReview?: boolean;
reviewed?: boolean;
nameEng?: string | null;
nameCze?: string | null;
abstractEng?: string | null;
abstractCze?: string | null;
keywordThesis: Array<KeywordThesisDto>;
schoolYear?: SchoolYearDto;
schoolYearId?: string;
department?: DepartmentDto;
departmentId?: string;
facultyDto?: Faculty;
facultyId?: string;
studyProgramme?: StudyProgrammeDto;
studyProgrammeId?: string | null;
status: ThesisStatus;
thesisType?: ThesisType;
thesisTypeId?: string | null;
thesisTypeCandidates?: Array<ThesisType> | null;
thesisTypeCandidateIds?: Array<string> | null;
outcomes?: Array<ThesisOutcome> | null;
outcomeIds?: Array<string> | null;
guidelines?: Array<string> | null;
literature?: Array<string> | null;
grade?: number | null;
users: Array<UserDto>;
});
