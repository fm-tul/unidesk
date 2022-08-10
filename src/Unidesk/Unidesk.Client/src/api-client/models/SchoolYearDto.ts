/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type SchoolYearDto = (TrackedEntityDto & {
start: string;
end: string;
readonly name?: string | null;
});
