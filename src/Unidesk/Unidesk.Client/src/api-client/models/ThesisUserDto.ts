/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ThesisDto } from './ThesisDto';
import type { UserDto } from './UserDto';
import type { UserFunction } from './UserFunction';

export type ThesisUserDto = {
    user: UserDto;
    userId: string;
    thesis?: ThesisDto;
    thesisId: string;
    function?: UserFunction;
};
