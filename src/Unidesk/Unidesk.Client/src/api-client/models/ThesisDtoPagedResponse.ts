/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryFilter } from './QueryFilter';
import type { ThesisDto } from './ThesisDto';

export type ThesisDtoPagedResponse = {
    filter: QueryFilter;
    items: Array<ThesisDto>;
};
