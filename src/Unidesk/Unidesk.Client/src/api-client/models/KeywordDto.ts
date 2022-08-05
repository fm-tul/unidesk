/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';

export type KeywordDto = (TrackedEntityDto & {
value?: string | null;
locale?: string | null;
used?: number;
});
