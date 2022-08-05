/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDto } from './UserDto';

export type LoginResponse = {
    isAuthenticated?: boolean;
    message?: string | null;
    user?: UserDto;
};
