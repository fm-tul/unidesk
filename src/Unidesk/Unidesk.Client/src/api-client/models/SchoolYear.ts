/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateOnly } from './DateOnly';

export type SchoolYear = {
    id: string;
    created?: string;
    createdBy?: string | null;
    modified?: string;
    modifiedBy?: string | null;
    readonly isNew?: boolean;
    start?: DateOnly;
    end?: DateOnly;
};
