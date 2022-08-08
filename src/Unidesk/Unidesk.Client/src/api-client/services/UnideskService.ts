/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Boolean_f__AnonymousType18 } from '../models/Boolean_f__AnonymousType18';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UnideskService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns Boolean_f__AnonymousType18 Success
     * @throws ApiError
     */
    public getApiEnumCacheReset(): CancelablePromise<Boolean_f__AnonymousType18> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enum/Cache/reset',
        });
    }

}
