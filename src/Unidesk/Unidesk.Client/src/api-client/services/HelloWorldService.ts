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

}
