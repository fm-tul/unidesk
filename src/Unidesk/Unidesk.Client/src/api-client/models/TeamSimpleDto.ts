/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserTeamRoleDto } from './UserTeamRoleDto';

export type TeamSimpleDto = {
    readonly _DtoType?: string | null;
    id: string;
    name: string;
    userTeamRoles: Array<UserTeamRoleDto>;
};
