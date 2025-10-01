/**
 * Base error class for all Qdrant-related errors
 */
export class QdrantError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    isRetryable: boolean = false,
    details?: Record<string, any>,
  ) {
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
  static from(error: unknown, defaultMessage: string = 'Unknown Qdrant error'): QdrantError {
    if (error instanceof QdrantError) {
      return error;
    }

    if (error instanceof Error) {
      return new QdrantError(error.message, 'UNKNOWN_ERROR', false, { originalError: error });
    }

    return new QdrantError(defaultMessage, 'UNKNOWN_ERROR', false, { originalError: error });
  }
}

/**
 * Error thrown when connection to Qdrant fails
 */
export class QdrantConnectionError extends QdrantError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONNECTION_ERROR', true, details);
    this.name = 'QdrantConnectionError';
  }
}

/**
 * Error thrown when authentication fails
 */
export class QdrantAuthenticationError extends QdrantError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'AUTHENTICATION_ERROR', false, details);
    this.name = 'QdrantAuthenticationError';
  }
}

/**
 * Error thrown when a collection operation fails
 */
export class QdrantCollectionError extends QdrantError {
  public readonly collectionName: string;

  constructor(message: string, collectionName: string, details?: Record<string, any>) {
    super(message, 'COLLECTION_ERROR', false, { collectionName, ...details });
    this.name = 'QdrantCollectionError';
    this.collectionName = collectionName;
  }
}

/**
 * Error thrown when collection already exists
 */
export class QdrantCollectionExistsError extends QdrantCollectionError {
  constructor(collectionName: string) {
    super(`Collection '${collectionName}' already exists`, collectionName);
    this.name = 'QdrantCollectionExistsError';
  }
}

/**
 * Error thrown when collection does not exist
 */
export class QdrantCollectionNotFoundError extends QdrantCollectionError {
  constructor(collectionName: string) {
    super(`Collection '${collectionName}' not found`, collectionName);
    this.name = 'QdrantCollectionNotFoundError';
  }
}

/**
 * Error thrown when vector operations fail
 */
export class QdrantVectorError extends QdrantError {
  public readonly collectionName?: string;

  constructor(message: string, collectionName?: string, details?: Record<string, any>) {
    super(message, 'VECTOR_ERROR', false, { collectionName, ...details });
    this.name = 'QdrantVectorError';
    this.collectionName = collectionName;
  }
}

/**
 * Error thrown when vector dimensions are invalid
 */
export class QdrantInvalidVectorError extends QdrantVectorError {
  public readonly expectedDimensions: number;
  public readonly actualDimensions: number;

  constructor(expectedDimensions: number, actualDimensions: number, collectionName?: string) {
    super(
      `Invalid vector dimensions: expected ${expectedDimensions}, got ${actualDimensions}`,
      collectionName,
      { expectedDimensions, actualDimensions },
    );
    this.name = 'QdrantInvalidVectorError';
    this.expectedDimensions = expectedDimensions;
    this.actualDimensions = actualDimensions;
  }
}

/**
 * Error thrown when search operations fail
 */
export class QdrantSearchError extends QdrantError {
  public readonly collectionName: string;

  constructor(message: string, collectionName: string, details?: Record<string, any>) {
    super(message, 'SEARCH_ERROR', true, { collectionName, ...details });
    this.name = 'QdrantSearchError';
    this.collectionName = collectionName;
  }
}

/**
 * Error thrown when validation fails
 */
export class QdrantValidationError extends QdrantError {
  public readonly field: string;
  public readonly value: any;

  constructor(message: string, field: string, value: any, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', false, { field, value, ...details });
    this.name = 'QdrantValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Error thrown when collection name validation fails
 */
export class QdrantInvalidCollectionNameError extends QdrantValidationError {
  constructor(collectionName: string) {
    super(
      `Invalid collection name: '${collectionName}'. Collection names must match pattern: ^[a-zA-Z0-9_-]+$`,
      'collectionName',
      collectionName,
      { pattern: '^[a-zA-Z0-9_-]+$' },
    );
    this.name = 'QdrantInvalidCollectionNameError';
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class QdrantConfigurationError extends QdrantError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', false, details);
    this.name = 'QdrantConfigurationError';
  }
}

/**
 * Error thrown when rate limits are exceeded
 */
export class QdrantRateLimitError extends QdrantError {
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number, details?: Record<string, any>) {
    super(message, 'RATE_LIMIT_ERROR', true, { retryAfter, ...details });
    this.name = 'QdrantRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when server returns an unexpected response
 */
export class QdrantServerError extends QdrantError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, details?: Record<string, any>) {
    super(message, 'SERVER_ERROR', statusCode >= 500, { statusCode, ...details });
    this.name = 'QdrantServerError';
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown when timeout occurs
 */
export class QdrantTimeoutError extends QdrantError {
  public readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number, details?: Record<string, any>) {
    super(message, 'TIMEOUT_ERROR', true, { timeoutMs, ...details });
    this.name = 'QdrantTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}
