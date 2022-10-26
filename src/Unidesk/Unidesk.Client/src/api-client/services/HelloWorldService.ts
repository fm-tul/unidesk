/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class HelloWorldService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns string Success
     * @throws ApiError
     */
    public getApiHelloWorldHelloworld(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/HelloWorld/helloworld',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public getApiHelloWorldFoo({
name,
description,
type,
}: {
name?: string,
description?: string,
type?: string,
}): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/HelloWorld/foo',
            query: {
                'Name': name,
                'Description': description,
                'Type': type,
            },
        });
    }

}
