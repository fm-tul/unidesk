/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordDto } from './KeywordDto';
import type { TeamDto } from './TeamDto';
import type { ThesisStatus } from './ThesisStatus';
import type { ThesisUserDto } from './ThesisUserDto';
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
keywords: Array<KeywordDto>;
schoolYearId: string;
departmentId: string;
facultyId: string;
studyProgrammeId?: string | null;
status: ThesisStatus;
thesisTypeId?: string | null;
thesisTypeCandidateIds: Array<string>;
outcomeIds: Array<string>;
guidelines?: string | null;
guidelinesList: Array<string>;
literature?: string | null;
literatureList: Array<string>;
grade?: number | null;
thesisUsers?: Array<ThesisUserDto> | null;
authors: Array<UserDto>;
supervisors: Array<UserDto>;
opponents: Array<UserDto>;
teams: Array<TeamDto>;
});
