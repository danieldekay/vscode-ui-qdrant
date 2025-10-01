/**
 * Base error class for all Qdrant-related errors
 */
export declare class QdrantError extends Error {
    readonly code: string;
    readonly isRetryable: boolean;
    readonly details?: Record<string, any>;
    constructor(message: string, code: string, isRetryable?: boolean, details?: Record<string, any>);
    /**
     * Creates a QdrantError from an unknown error
     */
    static from(error: unknown, defaultMessage?: string): QdrantError;
}
/**
 * Error thrown when connection to Qdrant fails
 */
export declare class QdrantConnectionError extends QdrantError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error thrown when authentication fails
 */
export declare class QdrantAuthenticationError extends QdrantError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error thrown when a collection operation fails
 */
export declare class QdrantCollectionError extends QdrantError {
    readonly collectionName: string;
    constructor(message: string, collectionName: string, details?: Record<string, any>);
}
/**
 * Error thrown when collection already exists
 */
export declare class QdrantCollectionExistsError extends QdrantCollectionError {
    constructor(collectionName: string);
}
/**
 * Error thrown when collection does not exist
 */
export declare class QdrantCollectionNotFoundError extends QdrantCollectionError {
    constructor(collectionName: string);
}
/**
 * Error thrown when vector operations fail
 */
export declare class QdrantVectorError extends QdrantError {
    readonly collectionName?: string;
    constructor(message: string, collectionName?: string, details?: Record<string, any>);
}
/**
 * Error thrown when vector dimensions are invalid
 */
export declare class QdrantInvalidVectorError extends QdrantVectorError {
    readonly expectedDimensions: number;
    readonly actualDimensions: number;
    constructor(expectedDimensions: number, actualDimensions: number, collectionName?: string);
}
/**
 * Error thrown when search operations fail
 */
export declare class QdrantSearchError extends QdrantError {
    readonly collectionName: string;
    constructor(message: string, collectionName: string, details?: Record<string, any>);
}
/**
 * Error thrown when validation fails
 */
export declare class QdrantValidationError extends QdrantError {
    readonly field: string;
    readonly value: any;
    constructor(message: string, field: string, value: any, details?: Record<string, any>);
}
/**
 * Error thrown when collection name validation fails
 */
export declare class QdrantInvalidCollectionNameError extends QdrantValidationError {
    constructor(collectionName: string);
}
/**
 * Error thrown when configuration is invalid
 */
export declare class QdrantConfigurationError extends QdrantError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Error thrown when rate limits are exceeded
 */
export declare class QdrantRateLimitError extends QdrantError {
    readonly retryAfter?: number;
    constructor(message: string, retryAfter?: number, details?: Record<string, any>);
}
/**
 * Error thrown when server returns an unexpected response
 */
export declare class QdrantServerError extends QdrantError {
    readonly statusCode: number;
    constructor(message: string, statusCode: number, details?: Record<string, any>);
}
/**
 * Error thrown when timeout occurs
 */
export declare class QdrantTimeoutError extends QdrantError {
    readonly timeoutMs: number;
    constructor(message: string, timeoutMs: number, details?: Record<string, any>);
}
//# sourceMappingURL=errors.d.ts.map