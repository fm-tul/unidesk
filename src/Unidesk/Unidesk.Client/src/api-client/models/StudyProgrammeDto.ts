/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type StudyProgrammeDto = (TrackedEntityDto & {
nameEng?: string | null;
nameCze?: string | null;
code?: string | null;
descriptionEng?: string | null;
descriptionCze?: string | null;
});
