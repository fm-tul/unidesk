/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { UserDto } from '../models/UserDto';
import type { UserDtoPagedResponse } from '../models/UserDtoPagedResponse';
import type { UserFilter } from '../models/UserFilter';

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
     * @returns UserDto Success
     * @throws ApiError
     */
    public get({
id,
}: {
id: string,
}): CancelablePromise<UserDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/get/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns UserDtoPagedResponse Success
     * @throws ApiError
     */
    public find({
requestBody,
}: {
requestBody?: UserFilter,
}): CancelablePromise<UserDtoPagedResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Users/find',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns UserDto Success
     * @throws ApiError
     */
    public getTheBestTeachers(): CancelablePromise<Array<UserDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Users/the-best-teachers',
        });
    }

}
