/**
 * Centralized validation utilities for the Qdrant extension.
 */
export { validateQdrantCollection } from '../models/qdrant_collection';
export { validateSearchConfig } from '../models/search_config';
export { validateSearchFilter, validateSearchParameters } from '../models/search_parameters';
export { validateSearchResultItem } from '../models/search_result';
export { validateVectorPoint, validateVectorPointBatch } from '../models/vector_point';
/**
 * Generic validation result type.
 */
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}
/**
 * Validate a search query string.
 */
export declare function validateSearchQuery(query: string): ValidationResult;
/**
 * Validate a collection name.
 */
export declare function validateCollectionName(name: string): ValidationResult;
/**
 * Validate a URL for Qdrant connection.
 */
export declare function validateQdrantUrl(url: string): ValidationResult;
/**
 * Comprehensive validation for search operation inputs.
 */
export declare function validateSearchOperation(query: string, parameters: any): ValidationResult;
//# sourceMappingURL=index.d.ts.map