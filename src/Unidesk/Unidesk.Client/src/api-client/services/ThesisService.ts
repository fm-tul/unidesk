/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThesisDto } from '../models/ThesisDto';
import type { ThesisDtoPagedResponse } from '../models/ThesisDtoPagedResponse';
import type { ThesisFilter } from '../models/ThesisFilter';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ThesisService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns ThesisDto Success
     * @throws ApiError
     */
    public getOne({
id,
}: {
id?: string,
}): CancelablePromise<ThesisDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Thesis/get-one',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @returns ThesisDtoPagedResponse Success
     * @throws ApiError
     */
    public find({
requestBody,
}: {
requestBody?: ThesisFilter,
}): CancelablePromise<ThesisDtoPagedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Thesis/find',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ThesisDto Success
     * @throws ApiError
     */
    public upsert({
requestBody,
}: {
requestBody?: ThesisDto,
}): CancelablePromise<ThesisDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Thesis/upsert',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Server Error`,
            },
        });
    }

}
