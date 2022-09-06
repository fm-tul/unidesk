/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryFilter } from './QueryFilter';
import type { ThesisStatus } from './ThesisStatus';

export type ThesisFilter = {
    filter?: QueryFilter;
    userId?: string | null;
    keywords?: Array<string> | null;
    status?: ThesisStatus;
    hasKeywords?: boolean | null;
    keyword?: string | null;
};
