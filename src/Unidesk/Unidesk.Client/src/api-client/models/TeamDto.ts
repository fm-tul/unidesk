/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';
import type { UserInTeamDto } from './UserInTeamDto';

export type TeamDto = (TrackedEntityDto & {
userInTeams?: Array<UserInTeamDto> | null;
name?: string | null;
description?: string | null;
avatar?: string | null;
});
