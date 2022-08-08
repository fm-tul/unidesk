/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepartmentDto } from '../models/DepartmentDto';
import type { EnumsDto } from '../models/EnumsDto';
import type { Faculty } from '../models/Faculty';
import type { SchoolYearDto } from '../models/SchoolYearDto';
import type { StudyProgrammeDto } from '../models/StudyProgrammeDto';
import type { ThesisOutcomeDto } from '../models/ThesisOutcomeDto';
import type { ThesisType } from '../models/ThesisType';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EnumsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns Faculty Success
     * @throws ApiError
     */
    public faculty(): CancelablePromise<Array<Faculty>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/Faculty/list',
        });
    }

    /**
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public department(): CancelablePromise<Array<DepartmentDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/Department/list',
        });
    }

    /**
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public departmentEdit({
requestBody,
}: {
requestBody: DepartmentDto,
}): CancelablePromise<DepartmentDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/Department/edit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns SchoolYearDto Success
     * @throws ApiError
     */
    public schoolYear(): CancelablePromise<Array<SchoolYearDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/SchoolYear/list',
        });
    }

    /**
     * @returns ThesisOutcomeDto Success
     * @throws ApiError
     */
    public thesisOutcome(): CancelablePromise<Array<ThesisOutcomeDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisOutcome/list',
        });
    }

    /**
     * @returns ThesisType Success
     * @throws ApiError
     */
    public thesisType(): CancelablePromise<Array<ThesisType>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisType/list',
        });
    }

    /**
     * @returns StudyProgrammeDto Success
     * @throws ApiError
     */
    public studyProgramme(): CancelablePromise<Array<StudyProgrammeDto>> {
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
