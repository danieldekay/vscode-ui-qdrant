/**
 * Data Validation Module
 *
 * Provides validation functions for Qdrant data models, requests, responses,
 * and configuration. Used by the extension to validate user input and API responses.
 */
/**
 * Custom validation error class
 */
export declare class ValidationError extends Error {
    readonly field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
/**
 * Collection Schema Validation
 */
export interface CollectionSchema {
    name: string;
    vectors: VectorConfig;
    optimizers_config?: {
        default_segment_number?: number;
        max_segment_size?: number;
    };
}
export interface VectorConfig {
    size: number;
    distance: 'Cosine' | 'Euclid' | 'Dot';
}
/**
 * Validates collection creation schema
 */
export declare function validateCollectionSchema(schema: any): asserts schema is CollectionSchema;
/**
 * Validates collection name format
 */
export declare function validateCollectionName(name: string): void;
/**
 * Validates vector configuration
 */
export declare function validateVectorConfig(config: any): asserts config is VectorConfig;
/**
 * Search Request Validation
 */
export interface SearchRequest {
    collectionName: string;
    vector: number[];
    limit?: number;
    offset?: number;
    withPayload?: boolean;
    withVectors?: boolean;
    scoreThreshold?: number;
}
/**
 * Validates search request format
 */
export declare function validateSearchRequest(request: any): asserts request is SearchRequest;
/**
 * Validates vector dimensions match collection
 */
export declare function validateVectorDimensions(vector: number[], expectedDimensions: number): void;
/**
 * Validates search parameters
 */
export declare function validateSearchParameters(params: any): void;
/**
 * Upsert Request Validation
 */
export interface UpsertRequest {
    collectionName: string;
    points: UpsertPoint[];
}
export interface UpsertPoint {
    id: string | number;
    vector: number[];
    payload?: Record<string, any>;
}
/**
 * Validates upsert request format
 */
export declare function validateUpsertRequest(request: any): asserts request is UpsertRequest;
/**
 * Validates a single upsert point
 */
export declare function validateUpsertPoint(point: any): asserts point is UpsertPoint;
/**
 * Validates payload structure
 */
export declare function validatePayload(payload: any): void;
/**
 * Configuration Validation
 */
export interface ExtensionConfig {
    qdrant: {
        url: string;
        apiKey?: string;
        timeout?: number;
        retries?: number;
        retryDelay?: number;
    };
}
/**
 * Validates extension configuration
 */
export declare function validateExtensionConfig(config: any): asserts config is ExtensionConfig;
/**
 * Validates URL format
 */
export declare function validateUrl(url: string): void;
/**
 * Validates numeric configuration values
 */
export declare function validateNumericConfig(value: any, fieldName: string, min: number, max: number): void;
/**
 * Response Data Validation
 */
export interface SearchResponse {
    result: SearchResult[];
    status: string;
    time: number;
}
export interface SearchResult {
    id: string | number;
    score: number;
    payload?: Record<string, any>;
    vector?: number[];
}
/**
 * Validates search response format
 */
export declare function validateSearchResponse(response: any): asserts response is SearchResponse;
/**
 * Validates a single search result
 */
export declare function validateSearchResult(result: any): asserts result is SearchResult;
/**
 * Validates collection info response
 */
export declare function validateCollectionInfoResponse(response: any): void;
/**
 * Validates error response format
 */
export declare function validateErrorResponse(response: any): void;
//# sourceMappingURL=validation.d.ts.map