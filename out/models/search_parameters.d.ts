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
export type FilterOperator = 'EQ' | 'NE' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'IN' | 'NIN';
/**
 * Default values for SearchParameters
 */
export declare const DEFAULT_SEARCH_PARAMETERS: SearchParameters;
/**
 * Validation rules for SearchParameters
 */
export declare function validateSearchParameters(params: SearchParameters): boolean;
/**
 * Validation rules for SearchFilter
 */
export declare function validateSearchFilter(filter: SearchFilter): boolean;
//# sourceMappingURL=search_parameters.d.ts.map