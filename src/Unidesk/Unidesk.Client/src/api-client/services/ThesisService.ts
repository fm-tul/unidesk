/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ThesisDto } from '../models/ThesisDto';
import type { ThesisStatus } from '../models/ThesisStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ThesisService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns ThesisDto Success
     * @throws ApiError
     */
    public getAll({
userId,
keywords,
status,
hasKeywords,
page,
pageSize,
orderBy,
orderAscending,
}: {
userId?: string,
keywords?: Array<string>,
status?: ThesisStatus,
hasKeywords?: boolean,
page?: number,
pageSize?: number,
orderBy?: string,
orderAscending?: boolean,
}): CancelablePromise<Array<ThesisDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Thesis/list',
            query: {
                'UserId': userId,
                'Keywords': keywords,
                'Status': status,
                'HasKeywords': hasKeywords,
                'Page': page,
                'PageSize': pageSize,
                'OrderBy': orderBy,
                'OrderAscending': orderAscending,
            },
        });
    }

}
