/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ThesisOutcome = {
    id: string;
    created?: string;
    createdBy?: string | null;
    modified?: string;
    modifiedBy?: string | null;
    readonly isNew?: boolean;
    nameEng?: string | null;
    nameCze?: string | null;
    descriptionEng?: string | null;
    descriptionCze?: string | null;
};
