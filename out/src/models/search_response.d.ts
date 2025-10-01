import type { SearchResultItem } from './search_result';
/**
 * Collection of vectors returned from a Qdrant search operation.
 */
export interface SearchResponse {
    /** Unique identifier for the search query */
    queryId: string;
    /** Array of individual result items */
    results: SearchResultItem[];
    /** Total number of matches found (may exceed returned results) */
    totalFound: number;
    /** Time taken for search in milliseconds */
    searchTime: number;
    /** Whether more results are available beyond the limit */
    hasMore: boolean;
}
/**
 * Validation rules for SearchResponse
 */
export declare function validateSearchResponse(response: SearchResponse): boolean;
/**
 * Empty search response for when no results are found.
 */
export declare function createEmptySearchResponse(queryId: string): SearchResponse;
/**
 * Search response with error information.
 */
export interface SearchErrorResponse {
    /** Whether the operation was successful */
    success: false;
    /** Error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: any;
}
/**
 * Successful search response.
 */
export interface SearchSuccessResponse {
    /** Whether the operation was successful */
    success: true;
    /** Search results data */
    data: SearchResponse;
}
/**
 * Union type for search responses.
 */
export type SearchResponseType = SearchSuccessResponse | SearchErrorResponse;
//# sourceMappingURL=search_response.d.ts.map