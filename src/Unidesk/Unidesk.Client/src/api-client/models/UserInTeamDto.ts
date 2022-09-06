/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserDto } from './UserDto';
import type { UserInTeamStatus } from './UserInTeamStatus';

export type UserInTeamDto = {
    userId?: string;
    user?: UserDto;
    team?: string | null;
    teamId?: string;
    status?: UserInTeamStatus;
};
