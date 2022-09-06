/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Severity } from './Severity';

export type ValidationFailure = {
    propertyName?: string | null;
    errorMessage?: string | null;
    attemptedValue?: any;
    customState?: any;
    severity?: Severity;
    errorCode?: string | null;
    formattedMessagePlaceholderValues?: Record<string, any> | null;
};
