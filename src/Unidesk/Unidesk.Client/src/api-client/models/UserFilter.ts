/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryFilter } from './QueryFilter';
import type { UserFunction } from './UserFunction';

export type UserFilter = {
    filter?: QueryFilter;
    keyword?: string | null;
    userFunctions?: Array<UserFunction> | null;
};
