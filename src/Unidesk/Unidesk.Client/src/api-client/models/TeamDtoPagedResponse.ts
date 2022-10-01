/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryFilter } from './QueryFilter';
import type { TeamDto } from './TeamDto';

export type TeamDtoPagedResponse = {
    filter: QueryFilter;
    items: Array<TeamDto>;
};
