/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KeywordDto } from '../models/KeywordDto';
import type { KeywordDtoPagedResponse } from '../models/KeywordDtoPagedResponse';
import type { KeywordFilter } from '../models/KeywordFilter';
import type { MergePairs } from '../models/MergePairs';
import type { SimilarKeywordDto } from '../models/SimilarKeywordDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class KeywordsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns KeywordDtoPagedResponse Success
     * @throws ApiError
     */
    public getAll({
requestBody,
}: {
requestBody?: KeywordFilter,
}): CancelablePromise<KeywordDtoPagedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Keywords/all',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns KeywordDto Success
     * @throws ApiError
     */
    public find({
keyword,
}: {
keyword?: string,
}): CancelablePromise<Array<KeywordDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Keywords/find',
            query: {
                'keyword': keyword,
            },
        });
    }

    /**
     * @returns KeywordDto Success
     * @throws ApiError
     */
    public findRelated({
keywordId,
}: {
keywordId?: string,
}): CancelablePromise<Array<KeywordDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Keywords/find-related',
            query: {
                'keywordId': keywordId,
            },
        });
    }

    /**
     * @returns SimilarKeywordDto Success
     * @throws ApiError
     */
    public findDuplicates({
keyword,
}: {
keyword?: string,
}): CancelablePromise<Array<SimilarKeywordDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Keywords/find-duplicates',
            query: {
                'keyword': keyword,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public merge({
keywordMain,
keywordAlias,
}: {
keywordMain?: string,
keywordAlias?: string,
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Keywords/merge',
            query: {
                'keywordMain': keywordMain,
                'keywordAlias': keywordAlias,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public mergeMultiple({
requestBody,
}: {
requestBody?: MergePairs,
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Keywords/merge-multiple',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
