/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type DepartmentDto = (TrackedEntityDto & {
nameEng: string;
nameCze: string;
code?: string | null;
descriptionEng?: string | null;
descriptionCze?: string | null;
});
