/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TeamDto } from '../models/TeamDto';
import type { TeamDtoPagedResponse } from '../models/TeamDtoPagedResponse';
import type { TeamFilter } from '../models/TeamFilter';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TeamService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns TeamDtoPagedResponse Success
     * @throws ApiError
     */
    public find({
requestBody,
}: {
requestBody?: TeamFilter,
}): CancelablePromise<TeamDtoPagedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Team/find',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns TeamDto Success
     * @throws ApiError
     */
    public getOne({
id,
}: {
id?: string,
}): CancelablePromise<TeamDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Team/get-one',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @returns TeamDto Success
     * @throws ApiError
     */
    public upsert({
requestBody,
}: {
requestBody?: TeamDto,
}): CancelablePromise<TeamDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Team/upsert',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Server Error`,
            },
        });
    }

}
