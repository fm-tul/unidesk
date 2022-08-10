/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SimpleJsonResponse } from '../models/SimpleJsonResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UnideskService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public getApiEnumCacheReset(): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enum/Cache/reset',
        });
    }

}
