/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TeamDto } from '../models/TeamDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TeamService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns TeamDto Success
     * @throws ApiError
     */
    public find({
keyword,
}: {
keyword?: string,
}): CancelablePromise<Array<TeamDto>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Team/find',
            query: {
                'keyword': keyword,
            },
        });
    }

}
