/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { HelloWorldService } from './services/HelloWorldService';
import { ImportService } from './services/ImportService';
import { KeywordsService } from './services/KeywordsService';
import { ThesisService } from './services/ThesisService';
import { UsersService } from './services/UsersService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ApiClient {

    public readonly helloWorld: HelloWorldService;
    public readonly import: ImportService;
    public readonly keywords: KeywordsService;
    public readonly thesis: ThesisService;
    public readonly users: UsersService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.helloWorld = new HelloWorldService(this.request);
        this.import = new ImportService(this.request);
        this.keywords = new KeywordsService(this.request);
        this.thesis = new ThesisService(this.request);
        this.users = new UsersService(this.request);
    }
}
