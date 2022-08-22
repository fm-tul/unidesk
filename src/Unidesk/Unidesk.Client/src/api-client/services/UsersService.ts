/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { UserDto } from '../models/UserDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns LoginResponse Success
     * @throws ApiError
     */
    public login({
requestBody,
}: {
requestBody?: LoginRequest,
}): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Users/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns LoginResponse Success
     * @throws ApiError
     */
    public loginSso({
path,
}: {
path: string,
}): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/login.sso/{path}',
            path: {
                'path': path,
            },
        });
    }

    /**
     * @returns LoginResponse Success
     * @throws ApiError
     */
    public logout(): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/logout',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public getApiUsersGet({
id,
}: {
id: string,
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/get/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns UserDto Success
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
}): CancelablePromise<Array<UserDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/all',
            query: {
                'Page': page,
                'PageSize': pageSize,
                'OrderBy': orderBy,
                'OrderAscending': orderAscending,
            },
        });
    }

    /**
     * @returns UserDto Success
     * @throws ApiError
     */
    public find({
keyword,
}: {
keyword?: string,
}): CancelablePromise<Array<UserDto>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Users/find',
            query: {
                'keyword': keyword,
            },
        });
    }

}
