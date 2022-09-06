/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordUsedCount } from './KeywordUsedCount';
import type { QueryFilter } from './QueryFilter';

export type KeywordFilter = {
    filter?: QueryFilter;
    keyword?: string | null;
    usedCount?: KeywordUsedCount;
};
