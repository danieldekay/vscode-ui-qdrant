"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantTimeoutError = exports.QdrantServerError = exports.QdrantRateLimitError = exports.QdrantConfigurationError = exports.QdrantInvalidCollectionNameError = exports.QdrantValidationError = exports.QdrantSearchError = exports.QdrantInvalidVectorError = exports.QdrantVectorError = exports.QdrantCollectionNotFoundError = exports.QdrantCollectionExistsError = exports.QdrantCollectionError = exports.QdrantAuthenticationError = exports.QdrantConnectionError = exports.QdrantError = void 0;
/**
 * Base error class for all Qdrant-related errors
 */
class QdrantError extends Error {
    code;
    isRetryable;
    details;
    constructor(message, code, isRetryable = false, details) {
        super(message);
        this.name = 'QdrantError';
        this.code = code;
        this.isRetryable = isRetryable;
        this.details = details;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, QdrantError);
        }
    }
    /**
     * Creates a QdrantError from an unknown error
     */
    static from(error, defaultMessage = 'Unknown Qdrant error') {
        if (error instanceof QdrantError) {
            return error;
        }
        if (error instanceof Error) {
            return new QdrantError(error.message, 'UNKNOWN_ERROR', false, { originalError: error });
        }
        return new QdrantError(defaultMessage, 'UNKNOWN_ERROR', false, { originalError: error });
    }
}
exports.QdrantError = QdrantError;
/**
 * Error thrown when connection to Qdrant fails
 */
class QdrantConnectionError extends QdrantError {
    constructor(message, details) {
        super(message, 'CONNECTION_ERROR', true, details);
        this.name = 'QdrantConnectionError';
    }
}
exports.QdrantConnectionError = QdrantConnectionError;
/**
 * Error thrown when authentication fails
 */
class QdrantAuthenticationError extends QdrantError {
    constructor(message, details) {
        super(message, 'AUTHENTICATION_ERROR', false, details);
        this.name = 'QdrantAuthenticationError';
    }
}
exports.QdrantAuthenticationError = QdrantAuthenticationError;
/**
 * Error thrown when a collection operation fails
 */
class QdrantCollectionError extends QdrantError {
    collectionName;
    constructor(message, collectionName, details) {
        super(message, 'COLLECTION_ERROR', false, { collectionName, ...details });
        this.name = 'QdrantCollectionError';
        this.collectionName = collectionName;
    }
}
exports.QdrantCollectionError = QdrantCollectionError;
/**
 * Error thrown when collection already exists
 */
class QdrantCollectionExistsError extends QdrantCollectionError {
    constructor(collectionName) {
        super(`Collection '${collectionName}' already exists`, collectionName);
        this.name = 'QdrantCollectionExistsError';
    }
}
exports.QdrantCollectionExistsError = QdrantCollectionExistsError;
/**
 * Error thrown when collection does not exist
 */
class QdrantCollectionNotFoundError extends QdrantCollectionError {
    constructor(collectionName) {
        super(`Collection '${collectionName}' not found`, collectionName);
        this.name = 'QdrantCollectionNotFoundError';
    }
}
exports.QdrantCollectionNotFoundError = QdrantCollectionNotFoundError;
/**
 * Error thrown when vector operations fail
 */
class QdrantVectorError extends QdrantError {
    collectionName;
    constructor(message, collectionName, details) {
        super(message, 'VECTOR_ERROR', false, { collectionName, ...details });
        this.name = 'QdrantVectorError';
        this.collectionName = collectionName;
    }
}
exports.QdrantVectorError = QdrantVectorError;
/**
 * Error thrown when vector dimensions are invalid
 */
class QdrantInvalidVectorError extends QdrantVectorError {
    expectedDimensions;
    actualDimensions;
    constructor(expectedDimensions, actualDimensions, collectionName) {
        super(`Invalid vector dimensions: expected ${expectedDimensions}, got ${actualDimensions}`, collectionName, { expectedDimensions, actualDimensions });
        this.name = 'QdrantInvalidVectorError';
        this.expectedDimensions = expectedDimensions;
        this.actualDimensions = actualDimensions;
    }
}
exports.QdrantInvalidVectorError = QdrantInvalidVectorError;
/**
 * Error thrown when search operations fail
 */
class QdrantSearchError extends QdrantError {
    collectionName;
    constructor(message, collectionName, details) {
        super(message, 'SEARCH_ERROR', true, { collectionName, ...details });
        this.name = 'QdrantSearchError';
        this.collectionName = collectionName;
    }
}
exports.QdrantSearchError = QdrantSearchError;
/**
 * Error thrown when validation fails
 */
class QdrantValidationError extends QdrantError {
    field;
    value;
    constructor(message, field, value, details) {
        super(message, 'VALIDATION_ERROR', false, { field, value, ...details });
        this.name = 'QdrantValidationError';
        this.field = field;
        this.value = value;
    }
}
exports.QdrantValidationError = QdrantValidationError;
/**
 * Error thrown when collection name validation fails
 */
class QdrantInvalidCollectionNameError extends QdrantValidationError {
    constructor(collectionName) {
        super(`Invalid collection name: '${collectionName}'. Collection names must match pattern: ^[a-zA-Z0-9_-]+$`, 'collectionName', collectionName, { pattern: '^[a-zA-Z0-9_-]+$' });
        this.name = 'QdrantInvalidCollectionNameError';
    }
}
exports.QdrantInvalidCollectionNameError = QdrantInvalidCollectionNameError;
/**
 * Error thrown when configuration is invalid
 */
class QdrantConfigurationError extends QdrantError {
    constructor(message, details) {
        super(message, 'CONFIGURATION_ERROR', false, details);
        this.name = 'QdrantConfigurationError';
    }
}
exports.QdrantConfigurationError = QdrantConfigurationError;
/**
 * Error thrown when rate limits are exceeded
 */
class QdrantRateLimitError extends QdrantError {
    retryAfter;
    constructor(message, retryAfter, details) {
        super(message, 'RATE_LIMIT_ERROR', true, { retryAfter, ...details });
        this.name = 'QdrantRateLimitError';
        this.retryAfter = retryAfter;
    }
}
exports.QdrantRateLimitError = QdrantRateLimitError;
/**
 * Error thrown when server returns an unexpected response
 */
class QdrantServerError extends QdrantError {
    statusCode;
    constructor(message, statusCode, details) {
        super(message, 'SERVER_ERROR', statusCode >= 500, { statusCode, ...details });
        this.name = 'QdrantServerError';
        this.statusCode = statusCode;
    }
}
exports.QdrantServerError = QdrantServerError;
/**
 * Error thrown when timeout occurs
 */
class QdrantTimeoutError extends QdrantError {
    timeoutMs;
    constructor(message, timeoutMs, details) {
        super(message, 'TIMEOUT_ERROR', true, { timeoutMs, ...details });
        this.name = 'QdrantTimeoutError';
        this.timeoutMs = timeoutMs;
    }
}
exports.QdrantTimeoutError = QdrantTimeoutError;
//# sourceMappingURL=errors.js.map