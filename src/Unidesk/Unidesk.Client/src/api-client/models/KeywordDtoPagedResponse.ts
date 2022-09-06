/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordDto } from './KeywordDto';
import type { QueryFilter } from './QueryFilter';

export type KeywordDtoPagedResponse = {
    filter: QueryFilter;
    items: Array<KeywordDto>;
};
