/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type ThesisOutcomeDto = (TrackedEntityDto & {
nameEng: string;
nameCze: string;
descriptionEng?: string | null;
descriptionCze?: string | null;
});
