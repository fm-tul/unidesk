/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TeamRole } from './TeamRole';
import type { UserInTeamStatus } from './UserInTeamStatus';

export type UserTeamRoleDto = {
    readonly _DtoType?: string | null;
    userId: string;
    status: UserInTeamStatus;
    role: TeamRole;
};
