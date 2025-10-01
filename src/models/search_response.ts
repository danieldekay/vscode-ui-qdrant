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
export function validateSearchResponse(response: SearchResponse): boolean {
  // queryId must be a string
  if (!response.queryId || typeof response.queryId !== 'string') {
    return false;
  }

  // results array can be empty but must be defined
  if (!Array.isArray(response.results)) {
    return false;
  }

  // totalFound must be >= results.length and non-negative
  if (
    typeof response.totalFound !== 'number' ||
    response.totalFound < 0 ||
    response.totalFound < response.results.length
  ) {
    return false;
  }

  // searchTime must be >= 0
  if (typeof response.searchTime !== 'number' || response.searchTime < 0) {
    return false;
  }

  // hasMore must be boolean
  if (typeof response.hasMore !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Empty search response for when no results are found.
 */
export function createEmptySearchResponse(queryId: string): SearchResponse {
  return {
    queryId,
    results: [],
    totalFound: 0,
    searchTime: 0,
    hasMore: false,
  };
}

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
