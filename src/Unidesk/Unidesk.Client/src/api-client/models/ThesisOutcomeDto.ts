/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type ThesisOutcomeDto = (TrackedEntityDto & {
nameEng?: string | null;
nameCze?: string | null;
descriptionEng?: string | null;
descriptionCze?: string | null;
});
