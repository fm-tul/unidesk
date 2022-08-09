/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepartmentDto } from '../models/DepartmentDto';
import type { EnumsDto } from '../models/EnumsDto';
import type { FacultyDto } from '../models/FacultyDto';
import type { SchoolYearDto } from '../models/SchoolYearDto';
import type { StudyProgrammeDto } from '../models/StudyProgrammeDto';
import type { ThesisOutcomeDto } from '../models/ThesisOutcomeDto';
import type { ThesisTypeDto } from '../models/ThesisTypeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EnumsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns FacultyDto Success
     * @throws ApiError
     */
    public facultyGetAll(): CancelablePromise<Array<FacultyDto>> {
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
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public departmentGetAll(): CancelablePromise<Array<DepartmentDto>> {
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
     * @returns SchoolYearDto Success
     * @throws ApiError
     */
    public schoolYearGetAll(): CancelablePromise<Array<SchoolYearDto>> {
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
     * @returns ThesisOutcomeDto Success
     * @throws ApiError
     */
    public thesisOutcomeGetAll(): CancelablePromise<Array<ThesisOutcomeDto>> {
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
     * @returns ThesisTypeDto Success
     * @throws ApiError
     */
    public thesisTypeGetAll(): CancelablePromise<Array<ThesisTypeDto>> {
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
     * @returns StudyProgrammeDto Success
     * @throws ApiError
     */
    public studyProgrammeGetAll(): CancelablePromise<Array<StudyProgrammeDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/StudyProgramme/list',
        });
    }

    /**
     * @returns StudyProgrammeDto Success
     * @throws ApiError
     */
    public studyProgrammeCreateOrUpdate({
requestBody,
}: {
requestBody: StudyProgrammeDto,
}): CancelablePromise<StudyProgrammeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/StudyProgramme/list',
            body: requestBody,
            mediaType: 'application/json',
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
