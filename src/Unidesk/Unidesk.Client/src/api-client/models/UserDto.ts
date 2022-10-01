/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TeamSimpleDto } from './TeamSimpleDto';
import type { UserFunction } from './UserFunction';
import type { UserInTeamDto } from './UserInTeamDto';
import type { UserSimpleDto } from './UserSimpleDto';

export type UserDto = (UserSimpleDto & {
readonly grantIds: Array<string>;
thesisCount?: number;
userFunction: UserFunction;
supervisionsRatio?: number | null;
supervisionsTotal?: number | null;
userInTeams: Array<UserInTeamDto>;
teams: Array<TeamSimpleDto>;
});
