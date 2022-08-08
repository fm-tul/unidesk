/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type FacultyDto = (TrackedEntityDto & {
nameEng: string;
nameCze: string;
code?: string | null;
descriptionEng?: string | null;
descriptionCze?: string | null;
});
