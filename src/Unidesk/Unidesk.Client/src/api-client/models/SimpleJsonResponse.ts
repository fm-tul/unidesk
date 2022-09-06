/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ValidationFailure } from './ValidationFailure';

export type SimpleJsonResponse = {
    success?: boolean;
    message?: string | null;
    stackTrace?: Array<string> | null;
    debugMessage?: string | null;
    errors?: Array<ValidationFailure> | null;
};
