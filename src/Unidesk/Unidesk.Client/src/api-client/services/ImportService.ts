/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportOneRequest } from '../models/ImportOneRequest';
import type { ThesisDto } from '../models/ThesisDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ImportService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns ThesisDto Success
     * @throws ApiError
     */
    public importFromStag({
year,
department,
}: {
year?: number,
department?: string,
}): CancelablePromise<Array<ThesisDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Import/stag-import-all',
            query: {
                'year': year,
                'department': department,
            },
        });
    }

    /**
     * @returns ThesisDto Success
     * @throws ApiError
     */
    public importOneFromStag({
requestBody,
}: {
requestBody?: ImportOneRequest,
}): CancelablePromise<ThesisDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Import/stag-import-one',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
