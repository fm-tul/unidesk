/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrackedEntityDto } from './TrackedEntityDto';
import type { UserFunction } from './UserFunction';

export type UserDto = (TrackedEntityDto & {
username?: string | null;
email?: string | null;
stagId?: string | null;
firstName?: string | null;
lastName?: string | null;
middleName?: string | null;
titleBefore?: string | null;
titleAfter?: string | null;
grants: Array<string>;
thesisCount?: number;
userFunction?: UserFunction;
});
