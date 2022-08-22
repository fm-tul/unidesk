/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DepartmentDto } from '../models/DepartmentDto';
import type { EnumsDto } from '../models/EnumsDto';
import type { FacultyDto } from '../models/FacultyDto';
import type { SchoolYearDto } from '../models/SchoolYearDto';
import type { SimpleJsonResponse } from '../models/SimpleJsonResponse';
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
            url: '/api/enums/FacultyGetAll',
        });
    }

    /**
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public departmentGetAll(): CancelablePromise<Array<DepartmentDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/DepartmentGetAll',
        });
    }

    /**
     * @returns SchoolYearDto Success
     * @throws ApiError
     */
    public schoolYearGetAll(): CancelablePromise<Array<SchoolYearDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/SchoolYearGetAll',
        });
    }

    /**
     * @returns ThesisOutcomeDto Success
     * @throws ApiError
     */
    public thesisOutcomeGetAll(): CancelablePromise<Array<ThesisOutcomeDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisOutcomeGetAll',
        });
    }

    /**
     * @returns ThesisTypeDto Success
     * @throws ApiError
     */
    public thesisTypeGetAll(): CancelablePromise<Array<ThesisTypeDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/ThesisTypeGetAll',
        });
    }

    /**
     * @returns StudyProgrammeDto Success
     * @throws ApiError
     */
    public studyProgrammeGetAll(): CancelablePromise<Array<StudyProgrammeDto>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/enums/StudyProgrammeGetAll',
        });
    }

    /**
     * @returns FacultyDto Success
     * @throws ApiError
     */
    public facultyUpsert({
requestBody,
}: {
requestBody: FacultyDto,
}): CancelablePromise<FacultyDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/FacultyUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns DepartmentDto Success
     * @throws ApiError
     */
    public departmentUpsert({
requestBody,
}: {
requestBody: DepartmentDto,
}): CancelablePromise<DepartmentDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/DepartmentUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns SchoolYearDto Success
     * @throws ApiError
     */
    public schoolYearUpsert({
requestBody,
}: {
requestBody: SchoolYearDto,
}): CancelablePromise<SchoolYearDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/SchoolYearUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ThesisOutcomeDto Success
     * @throws ApiError
     */
    public thesisOutcomeUpsert({
requestBody,
}: {
requestBody: ThesisOutcomeDto,
}): CancelablePromise<ThesisOutcomeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/ThesisOutcomeUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ThesisTypeDto Success
     * @throws ApiError
     */
    public thesisTypeUpsert({
requestBody,
}: {
requestBody: ThesisTypeDto,
}): CancelablePromise<ThesisTypeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/ThesisTypeUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns StudyProgrammeDto Success
     * @throws ApiError
     */
    public studyProgrammeUpsert({
requestBody,
}: {
requestBody: StudyProgrammeDto,
}): CancelablePromise<StudyProgrammeDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/enums/StudyProgrammeUpsertOne',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public facultyDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/FacultyDeleteOne/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public departmentDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/DepartmentDeleteOne/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public schoolYearDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/SchoolYearDeleteOne/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public thesisOutcomeDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/ThesisOutcomeDeleteOne/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public thesisTypeDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/ThesisTypeDeleteOne/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns SimpleJsonResponse Success
     * @throws ApiError
     */
    public studyProgrammeDelete({
id,
}: {
id: string,
}): CancelablePromise<SimpleJsonResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/enums/StudyProgrammeDeleteOne/{id}',
            path: {
                'id': id,
            },
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
