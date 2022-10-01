/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TeamType } from './TeamType';
import type { TrackedEntityDto } from './TrackedEntityDto';
import type { UserDto } from './UserDto';
import type { UserInTeamDto } from './UserInTeamDto';
import type { UserSimpleDto } from './UserSimpleDto';

export type TeamDto = (TrackedEntityDto & {
userInTeams: Array<UserInTeamDto>;
users: Array<(UserSimpleDto | UserDto)>;
name?: string | null;
description?: string | null;
avatar?: string | null;
type?: TeamType;
});
