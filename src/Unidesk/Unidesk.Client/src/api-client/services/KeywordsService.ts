/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KeywordDto } from '../models/KeywordDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class KeywordsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns KeywordDto Success
     * @throws ApiError
     */
    public getAll({
page,
pageSize,
orderBy,
orderAscending,
}: {
page?: number,
pageSize?: number,
orderBy?: string,
orderAscending?: boolean,
}): CancelablePromise<Array<KeywordDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Keywords/all',
            query: {
                'Page': page,
                'PageSize': pageSize,
                'OrderBy': orderBy,
                'OrderAscending': orderAscending,
            },
        });
    }

}
