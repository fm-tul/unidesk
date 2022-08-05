/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Grant } from './Grant';

export type UserDto = {
    id: string;
    readonly _DtoType?: string | null;
    created: string;
    createdBy?: string | null;
    modified: string;
    modifiedBy?: string | null;
    readonly isNew?: boolean;
    readonly isNew2?: boolean;
    username?: string | null;
    email?: string | null;
    stagId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
    titleBefore?: string | null;
    titleAfter?: string | null;
    grants: Array<Grant>;
};
