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
export type { FacultyDto } from './models/FacultyDto';
export type { ImportOneRequest } from './models/ImportOneRequest';
export type { KeywordDto } from './models/KeywordDto';
export type { KeywordDtoPagedResponse } from './models/KeywordDtoPagedResponse';
export type { KeywordFilter } from './models/KeywordFilter';
export { KeywordUsedCount } from './models/KeywordUsedCount';
export type { LoginRequest } from './models/LoginRequest';
export type { LoginResponse } from './models/LoginResponse';
export type { MergePair } from './models/MergePair';
export type { MergePairs } from './models/MergePairs';
export type { QueryFilter } from './models/QueryFilter';
export type { SchoolYearDto } from './models/SchoolYearDto';
export { Severity } from './models/Severity';
export type { SimilarKeywordDto } from './models/SimilarKeywordDto';
export type { SimpleJsonResponse } from './models/SimpleJsonResponse';
export type { StudyProgrammeDto } from './models/StudyProgrammeDto';
export type { TeamDto } from './models/TeamDto';
export type { ThesisDto } from './models/ThesisDto';
export type { ThesisDtoPagedResponse } from './models/ThesisDtoPagedResponse';
export type { ThesisFilter } from './models/ThesisFilter';
export type { ThesisOutcomeDto } from './models/ThesisOutcomeDto';
export { ThesisStatus } from './models/ThesisStatus';
export type { ThesisTypeDto } from './models/ThesisTypeDto';
export type { ThesisUserDto } from './models/ThesisUserDto';
export type { TrackedEntityDto } from './models/TrackedEntityDto';
export type { UserDto } from './models/UserDto';
export type { UserDtoPagedResponse } from './models/UserDtoPagedResponse';
export type { UserFilter } from './models/UserFilter';
export { UserFunction } from './models/UserFunction';
export type { UserInTeamDto } from './models/UserInTeamDto';
export { UserInTeamStatus } from './models/UserInTeamStatus';
export type { ValidationFailure } from './models/ValidationFailure';

export { EnumsService } from './services/EnumsService';
export { HelloWorldService } from './services/HelloWorldService';
export { ImportService } from './services/ImportService';
export { KeywordsService } from './services/KeywordsService';
export { TeamService } from './services/TeamService';
export { ThesisService } from './services/ThesisService';
export { UnideskService } from './services/UnideskService';
export { UsersService } from './services/UsersService';
