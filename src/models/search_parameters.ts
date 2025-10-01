/**
 * Configuration settings that control search behavior and result filtering.
 */
export interface SearchParameters {
  /** Minimum similarity score (0.0 to 1.0, default: 0.7) */
  similarityThreshold: number;

  /** Maximum number of results to return (1-1000, default: 50) */
  resultLimit: number;

  /** Additional filtering criteria */
  searchFilters?: SearchFilter[];

  /** Whether to include full payload data (default: true) */
  includePayload: boolean;

  /** Whether to include vector data (default: false) */
  includeVector: boolean;
}

/**
 * Filter criteria for search results.
 */
export interface SearchFilter {
  /** The metadata field to filter on */
  field: string;

  /** Comparison operator */
  operator: FilterOperator;

  /** The value to compare against */
  value: any;
}

/**
 * Supported filter operators.
 */
export type FilterOperator =
  | 'EQ' // Equal
  | 'NE' // Not equal
  | 'GT' // Greater than
  | 'LT' // Less than
  | 'GTE' // Greater than or equal
  | 'LTE' // Less than or equal
  | 'IN' // In array
  | 'NIN'; // Not in array

/**
 * Default values for SearchParameters
 */
export const DEFAULT_SEARCH_PARAMETERS: SearchParameters = {
  similarityThreshold: 0.7,
  resultLimit: 50,
  includePayload: true,
  includeVector: false,
};

/**
 * Validation rules for SearchParameters
 */
export function validateSearchParameters(params: SearchParameters): boolean {
  // similarityThreshold must be between 0.0 and 1.0
  if (
    typeof params.similarityThreshold !== 'number' ||
    params.similarityThreshold < 0.0 ||
    params.similarityThreshold > 1.0
  ) {
    return false;
  }

  // resultLimit must be between 1 and 1000
  if (
    typeof params.resultLimit !== 'number' ||
    params.resultLimit < 1 ||
    params.resultLimit > 1000
  ) {
    return false;
  }

  // searchFilters must contain valid filter objects if present
  if (params.searchFilters !== undefined) {
    if (!Array.isArray(params.searchFilters)) {
      return false;
    }

    for (const filter of params.searchFilters) {
      if (!validateSearchFilter(filter)) {
        return false;
      }
    }
  }

  // includePayload and includeVector must be booleans
  if (typeof params.includePayload !== 'boolean' || typeof params.includeVector !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Validation rules for SearchFilter
 */
export function validateSearchFilter(filter: SearchFilter): boolean {
  // field must be a non-empty string
  if (!filter.field || typeof filter.field !== 'string' || filter.field.trim() === '') {
    return false;
  }

  // operator must be a valid FilterOperator
  const validOperators: FilterOperator[] = ['EQ', 'NE', 'GT', 'LT', 'GTE', 'LTE', 'IN', 'NIN'];
  if (!validOperators.includes(filter.operator)) {
    return false;
  }

  // value must exist (can be any type)
  if (filter.value === undefined) {
    return false;
  }

  return true;
}
