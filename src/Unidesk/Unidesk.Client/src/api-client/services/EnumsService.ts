/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from '../models/Department';
import type { DepartmentDto } from '../models/DepartmentDto';
import type { EnumsDto } from '../models/EnumsDto';
import type { Faculty } from '../models/Faculty';
import type { FacultyDto } from '../models/FacultyDto';
import type { SchoolYear } from '../models/SchoolYear';
import type { SchoolYearDto } from '../models/SchoolYearDto';
import type { StudyProgramme } from '../models/StudyProgramme';
import type { ThesisOutcome } from '../models/ThesisOutcome';
import type { ThesisOutcomeDto } from '../models/ThesisOutcomeDto';
import type { ThesisType } from '../models/ThesisType';
import type { ThesisTypeDto } from '../models/ThesisTypeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EnumsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns Faculty Success
     * @throws ApiError
     */
    public facultyGetAll(): CancelablePromise<Array<Faculty>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/Faculty/list',
        });
    }

    /**
     * @returns FacultyDto Success
     * @throws ApiError
     */
    public facultyCreateOrUpdate({
requestBody,
}: {
requestBody: FacultyDto,
}): CancelablePromise<FacultyDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/Faculty/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Department Success
     * @throws ApiError
     */
    public departmentGetAll(): CancelablePromise<Array<Department>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/Department/list',
        });
    }

    /**
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public departmentCreateOrUpdate({
requestBody,
}: {
requestBody: DepartmentDto,
}): CancelablePromise<DepartmentDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/Department/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns SchoolYear Success
     * @throws ApiError
     */
    public schoolYearGetAll(): CancelablePromise<Array<SchoolYear>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/SchoolYear/list',
        });
    }

    /**
     * @returns SchoolYearDto Success
     * @throws ApiError
     */
    public schoolYearCreateOrUpdate({
requestBody,
}: {
requestBody: SchoolYearDto,
}): CancelablePromise<SchoolYearDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/SchoolYear/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ThesisOutcome Success
     * @throws ApiError
     */
    public thesisOutcomeGetAll(): CancelablePromise<Array<ThesisOutcome>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisOutcome/list',
        });
    }

    /**
     * @returns ThesisOutcomeDto Success
     * @throws ApiError
     */
    public thesisOutcomeCreateOrUpdate({
requestBody,
}: {
requestBody: ThesisOutcomeDto,
}): CancelablePromise<ThesisOutcomeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/ThesisOutcome/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ThesisType Success
     * @throws ApiError
     */
    public thesisTypeGetAll(): CancelablePromise<Array<ThesisType>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisType/list',
        });
    }

    /**
     * @returns ThesisTypeDto Success
     * @throws ApiError
     */
    public thesisTypeCreateOrUpdate({
requestBody,
}: {
requestBody: ThesisTypeDto,
}): CancelablePromise<ThesisTypeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/ThesisType/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns StudyProgramme Success
     * @throws ApiError
     */
    public studyProgrammeGetAll(): CancelablePromise<Array<StudyProgramme>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/StudyProgramme/list',
        });
    }

    /**
     * @returns EnumsDto Success
     * @throws ApiError
     */
    public allEnums(): CancelablePromise<EnumsDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enum/All/list',
        });
    }

}
