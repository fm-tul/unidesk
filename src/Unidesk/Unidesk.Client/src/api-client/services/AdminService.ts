/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminActions } from '../models/AdminActions';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AdminService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns any Success
     * @throws ApiError
     */
    public action({
action,
}: {
action?: AdminActions,
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Admin/action',
            query: {
                'action': action,
            },
        });
    }

}
