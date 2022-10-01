/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TeamRole } from './TeamRole';
import type { TeamSimpleDto } from './TeamSimpleDto';
import type { UserDto } from './UserDto';
import type { UserInTeamStatus } from './UserInTeamStatus';
import type { UserSimpleDto } from './UserSimpleDto';

export type UserInTeamDto = {
    readonly _DtoType?: string | null;
    userId?: string;
    user?: (UserSimpleDto | UserDto) | null;
    teamId?: string;
    team?: TeamSimpleDto;
    status?: UserInTeamStatus;
    role?: TeamRole;
    readonly id: string;
};
