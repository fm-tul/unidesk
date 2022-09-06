/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryFilter } from './QueryFilter';
import type { UserDto } from './UserDto';

export type UserDtoPagedResponse = {
    filter: QueryFilter;
    items: Array<UserDto>;
};
