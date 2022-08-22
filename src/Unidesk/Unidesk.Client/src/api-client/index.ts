/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiClient } from './ApiClient';

export { ApiError } from './core/ApiError';
export { BaseHttpRequest } from './core/BaseHttpRequest';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { DepartmentDto } from './models/DepartmentDto';
export type { EnumsDto } from './models/EnumsDto';
export type { Faculty } from './models/Faculty';
export type { FacultyDto } from './models/FacultyDto';
export type { KeywordDto } from './models/KeywordDto';
export type { LoginRequest } from './models/LoginRequest';
export type { LoginResponse } from './models/LoginResponse';
export type { MergePair } from './models/MergePair';
export type { MergePairs } from './models/MergePairs';
export type { SchoolYearDto } from './models/SchoolYearDto';
export type { SimilarKeywordDto } from './models/SimilarKeywordDto';
export type { SimpleJsonResponse } from './models/SimpleJsonResponse';
export type { StudyProgrammeDto } from './models/StudyProgrammeDto';
export type { ThesisDto } from './models/ThesisDto';
export type { ThesisOutcome } from './models/ThesisOutcome';
export type { ThesisOutcomeDto } from './models/ThesisOutcomeDto';
export { ThesisStatus } from './models/ThesisStatus';
export type { ThesisType } from './models/ThesisType';
export type { ThesisTypeDto } from './models/ThesisTypeDto';
export type { TrackedEntityDto } from './models/TrackedEntityDto';
export type { UserDto } from './models/UserDto';

export { EnumsService } from './services/EnumsService';
export { HelloWorldService } from './services/HelloWorldService';
export { ImportService } from './services/ImportService';
export { KeywordsService } from './services/KeywordsService';
export { ThesisService } from './services/ThesisService';
export { UnideskService } from './services/UnideskService';
export { UsersService } from './services/UsersService';
