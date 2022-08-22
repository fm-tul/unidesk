/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordDto } from './KeywordDto';

export type SimilarKeywordDto = {
    distance?: number;
    similarity?: number;
    keyword1?: KeywordDto;
    keyword2?: KeywordDto;
    readonly locale?: string | null;
};
