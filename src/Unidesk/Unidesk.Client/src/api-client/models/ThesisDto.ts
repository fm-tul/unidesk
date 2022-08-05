/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordThesisDto } from './KeywordThesisDto';
import type { ThesisStatus } from './ThesisStatus';
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
status: ThesisStatus;
grade?: number | null;
users: Array<UserDto>;
});
