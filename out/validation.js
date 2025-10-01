"use strict";
/**
 * Data Validation Module
 *
 * Provides validation functions for Qdrant data models, requests, responses,
 * and configuration. Used by the extension to validate user input and API responses.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateCollectionSchema = validateCollectionSchema;
exports.validateCollectionName = validateCollectionName;
exports.validateVectorConfig = validateVectorConfig;
exports.validateSearchRequest = validateSearchRequest;
exports.validateVectorDimensions = validateVectorDimensions;
exports.validateSearchParameters = validateSearchParameters;
exports.validateUpsertRequest = validateUpsertRequest;
exports.validateUpsertPoint = validateUpsertPoint;
exports.validatePayload = validatePayload;
exports.validateExtensionConfig = validateExtensionConfig;
exports.validateUrl = validateUrl;
exports.validateNumericConfig = validateNumericConfig;
exports.validateSearchResponse = validateSearchResponse;
exports.validateSearchResult = validateSearchResult;
exports.validateCollectionInfoResponse = validateCollectionInfoResponse;
exports.validateErrorResponse = validateErrorResponse;
/**
 * Custom validation error class
 */
class ValidationError extends Error {
    field;
    constructor(message, field) {
        super(message);
        this.field = field;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/**
 * Validates collection creation schema
 */
function validateCollectionSchema(schema) {
    if (!schema || typeof schema !== 'object') {
        throw new ValidationError('Collection schema must be an object');
    }
    // Validate name
    if (!schema.name || typeof schema.name !== 'string') {
        throw new ValidationError('Collection name is required and must be a string', 'name');
    }
    validateCollectionName(schema.name);
    // Validate vectors config
    if (!schema.vectors || typeof schema.vectors !== 'object') {
        throw new ValidationError('Vectors configuration is required', 'vectors');
    }
    validateVectorConfig(schema.vectors);
    // Validate optimizers_config if present
    if (schema.optimizers_config !== undefined) {
        if (typeof schema.optimizers_config !== 'object') {
            throw new ValidationError('Optimizers config must be an object', 'optimizers_config');
        }
        const { default_segment_number, max_segment_size } = schema.optimizers_config;
        if (default_segment_number !== undefined) {
            if (typeof default_segment_number !== 'number' || default_segment_number <= 0) {
                throw new ValidationError('Default segment number must be a positive number', 'optimizers_config.default_segment_number');
            }
        }
        if (max_segment_size !== undefined) {
            if (typeof max_segment_size !== 'number' || max_segment_size <= 0) {
                throw new ValidationError('Max segment size must be a positive number', 'optimizers_config.max_segment_size');
            }
        }
    }
}
/**
 * Validates collection name format
 */
function validateCollectionName(name) {
    if (typeof name !== 'string') {
        throw new ValidationError('Collection name must be a string');
    }
    if (name.length === 0) {
        throw new ValidationError('Collection name cannot be empty');
    }
    if (name.length > 255) {
        throw new ValidationError('Collection name cannot exceed 255 characters');
    }
    // Check for invalid characters
    const invalidChars = /[/\\ @#$%^&*()+=[\]{}|:;"'<>,?\s]/;
    if (invalidChars.test(name)) {
        throw new ValidationError('Collection name contains invalid characters. Only alphanumeric characters, hyphens, underscores, and dots are allowed');
    }
    // Check for reserved names
    const reservedNames = ['system', 'admin', 'internal', 'temp'];
    if (reservedNames.includes(name.toLowerCase())) {
        throw new ValidationError(`Collection name '${name}' is reserved`);
    }
}
/**
 * Validates vector configuration
 */
function validateVectorConfig(config) {
    if (!config || typeof config !== 'object') {
        throw new ValidationError('Vector config must be an object');
    }
    // Validate size
    if (config.size === undefined || config.size === null) {
        throw new ValidationError('Vector size is required', 'size');
    }
    if (typeof config.size !== 'number') {
        throw new ValidationError('Vector size must be a number', 'size');
    }
    if (!Number.isInteger(config.size) || config.size < 1 || config.size > 65536) {
        throw new ValidationError('Vector size must be an integer between 1 and 65536', 'size');
    }
    // Validate distance
    const validDistances = ['Cosine', 'Euclid', 'Dot'];
    if (config.distance === undefined || config.distance === null) {
        throw new ValidationError('Distance metric is required', 'distance');
    }
    if (typeof config.distance !== 'string') {
        throw new ValidationError('Distance metric must be a string', 'distance');
    }
    if (!validDistances.includes(config.distance)) {
        throw new ValidationError(`Distance metric must be one of: ${validDistances.join(', ')}`, 'distance');
    }
}
/**
 * Validates search request format
 */
function validateSearchRequest(request) {
    if (!request || typeof request !== 'object') {
        throw new ValidationError('Search request must be an object');
    }
    // Validate collection name
    if (!request.collectionName || typeof request.collectionName !== 'string') {
        throw new ValidationError('Collection name is required and must be a string', 'collectionName');
    }
    validateCollectionName(request.collectionName);
    // Validate vector
    if (!Array.isArray(request.vector)) {
        throw new ValidationError('Vector must be an array of numbers', 'vector');
    }
    if (request.vector.length === 0) {
        throw new ValidationError('Vector cannot be empty', 'vector');
    }
    if (request.vector.length > 65536) {
        throw new ValidationError('Vector cannot exceed 65536 dimensions', 'vector');
    }
    for (let i = 0; i < request.vector.length; i++) {
        if (typeof request.vector[i] !== 'number' || Number.isNaN(request.vector[i])) {
            throw new ValidationError(`Vector element at index ${i} must be a valid number`, 'vector');
        }
    }
    // Validate optional parameters
    validateSearchParameters({
        limit: request.limit,
        offset: request.offset,
        scoreThreshold: request.scoreThreshold,
        withPayload: request.withPayload,
        withVectors: request.withVectors,
    });
}
/**
 * Validates vector dimensions match collection
 */
function validateVectorDimensions(vector, expectedDimensions) {
    if (!Array.isArray(vector)) {
        throw new ValidationError('Vector must be an array');
    }
    if (vector.length !== expectedDimensions) {
        throw new ValidationError(`Vector dimensions (${vector.length}) do not match collection dimensions (${expectedDimensions})`);
    }
}
/**
 * Validates search parameters
 */
function validateSearchParameters(params) {
    if (!params || typeof params !== 'object') {
        return; // Optional parameters
    }
    // Validate limit
    if (params.limit !== undefined) {
        if (typeof params.limit !== 'number' ||
            !Number.isInteger(params.limit) ||
            params.limit < 1 ||
            params.limit > 1000) {
            throw new ValidationError('Limit must be an integer between 1 and 1000', 'limit');
        }
    }
    // Validate offset
    if (params.offset !== undefined) {
        if (typeof params.offset !== 'number' ||
            !Number.isInteger(params.offset) ||
            params.offset < 0) {
            throw new ValidationError('Offset must be a non-negative integer', 'offset');
        }
    }
    // Validate scoreThreshold
    if (params.scoreThreshold !== undefined) {
        if (typeof params.scoreThreshold !== 'number' ||
            params.scoreThreshold < 0 ||
            params.scoreThreshold > 1) {
            throw new ValidationError('Score threshold must be a number between 0 and 1', 'scoreThreshold');
        }
    }
    // Validate withPayload
    if (params.withPayload !== undefined && typeof params.withPayload !== 'boolean') {
        throw new ValidationError('withPayload must be a boolean', 'withPayload');
    }
    // Validate withVectors
    if (params.withVectors !== undefined && typeof params.withVectors !== 'boolean') {
        throw new ValidationError('withVectors must be a boolean', 'withVectors');
    }
}
/**
 * Validates upsert request format
 */
function validateUpsertRequest(request) {
    if (!request || typeof request !== 'object') {
        throw new ValidationError('Upsert request must be an object');
    }
    // Validate collection name
    if (!request.collectionName || typeof request.collectionName !== 'string') {
        throw new ValidationError('Collection name is required and must be a string', 'collectionName');
    }
    validateCollectionName(request.collectionName);
    // Validate points
    if (!Array.isArray(request.points)) {
        throw new ValidationError('Points must be an array', 'points');
    }
    if (request.points.length === 0) {
        throw new ValidationError('Points array cannot be empty', 'points');
    }
    if (request.points.length > 1000) {
        throw new ValidationError('Cannot upsert more than 1000 points at once', 'points');
    }
    for (let i = 0; i < request.points.length; i++) {
        const point = request.points[i];
        try {
            validateUpsertPoint(point);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw new ValidationError(`Point at index ${i}: ${error.message}`, `points[${i}]`);
            }
            throw error;
        }
    }
}
/**
 * Validates a single upsert point
 */
function validateUpsertPoint(point) {
    if (!point || typeof point !== 'object') {
        throw new ValidationError('Point must be an object');
    }
    // Validate ID
    if (point.id === undefined || point.id === null) {
        throw new ValidationError('Point ID is required', 'id');
    }
    if (typeof point.id !== 'string' && typeof point.id !== 'number') {
        throw new ValidationError('Point ID must be a string or number', 'id');
    }
    if (typeof point.id === 'string' && point.id.length === 0) {
        throw new ValidationError('Point ID cannot be an empty string', 'id');
    }
    // Validate vector
    if (!Array.isArray(point.vector)) {
        throw new ValidationError('Vector must be an array of numbers', 'vector');
    }
    if (point.vector.length === 0) {
        throw new ValidationError('Vector cannot be empty', 'vector');
    }
    if (point.vector.length > 65536) {
        throw new ValidationError('Vector cannot exceed 65536 dimensions', 'vector');
    }
    for (let i = 0; i < point.vector.length; i++) {
        if (typeof point.vector[i] !== 'number' || Number.isNaN(point.vector[i])) {
            throw new ValidationError(`Vector element at index ${i} must be a valid number`, 'vector');
        }
    }
    // Validate payload (optional)
    if (point.payload !== undefined) {
        validatePayload(point.payload);
    }
}
/**
 * Validates payload structure
 */
function validatePayload(payload) {
    if (payload === null) {
        return; // Null payload is allowed
    }
    if (typeof payload !== 'object' || Array.isArray(payload)) {
        throw new ValidationError('Payload must be an object or null');
    }
    // Validate payload depth (prevent deep nesting)
    const maxDepth = 10;
    function validateDepth(obj, currentDepth = 0) {
        if (currentDepth > maxDepth) {
            throw new ValidationError('Payload nesting depth exceeds maximum allowed depth');
        }
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            for (const value of Object.values(obj)) {
                if (typeof value === 'object' && value !== null) {
                    validateDepth(value, currentDepth + 1);
                }
            }
        }
    }
    validateDepth(payload);
}
/**
 * Validates extension configuration
 */
function validateExtensionConfig(config) {
    if (!config || typeof config !== 'object') {
        throw new ValidationError('Configuration must be an object');
    }
    if (!config.qdrant || typeof config.qdrant !== 'object') {
        throw new ValidationError('Qdrant configuration is required', 'qdrant');
    }
    const qdrant = config.qdrant;
    // Validate URL
    if (!qdrant.url || typeof qdrant.url !== 'string') {
        throw new ValidationError('Qdrant URL is required', 'qdrant.url');
    }
    validateUrl(qdrant.url);
    // Validate optional fields
    if (qdrant.apiKey !== undefined && typeof qdrant.apiKey !== 'string') {
        throw new ValidationError('API key must be a string', 'qdrant.apiKey');
    }
    if (qdrant.timeout !== undefined) {
        validateNumericConfig(qdrant.timeout, 'timeout', 1000, 300000); // 1s to 5min
    }
    if (qdrant.retries !== undefined) {
        validateNumericConfig(qdrant.retries, 'retries', 0, 10);
    }
    if (qdrant.retryDelay !== undefined) {
        validateNumericConfig(qdrant.retryDelay, 'retryDelay', 0, 60000); // 0 to 1min
    }
}
/**
 * Validates URL format
 */
function validateUrl(url) {
    if (typeof url !== 'string') {
        throw new ValidationError('URL must be a string');
    }
    if (url.length === 0) {
        throw new ValidationError('URL cannot be empty');
    }
    try {
        const parsedUrl = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new ValidationError('URL must use HTTP or HTTPS protocol');
        }
        // Basic validation for Qdrant URLs
        if (parsedUrl.pathname &&
            parsedUrl.pathname !== '/' &&
            !parsedUrl.pathname.startsWith('/collections')) {
            // Allow root path and collections paths
            throw new ValidationError('Invalid URL path for Qdrant server');
        }
    }
    catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        throw new ValidationError('Invalid URL format');
    }
}
/**
 * Validates numeric configuration values
 */
function validateNumericConfig(value, fieldName, min, max) {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isInteger(value)) {
        throw new ValidationError(`${fieldName} must be an integer`, fieldName);
    }
    if (value < min || value > max) {
        throw new ValidationError(`${fieldName} must be between ${min} and ${max}`, fieldName);
    }
}
/**
 * Validates search response format
 */
function validateSearchResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new ValidationError('Search response must be an object');
    }
    // Validate result array
    if (!Array.isArray(response.result)) {
        throw new ValidationError('Result must be an array', 'result');
    }
    for (let i = 0; i < response.result.length; i++) {
        const result = response.result[i];
        try {
            validateSearchResult(result);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw new ValidationError(`Result at index ${i}: ${error.message}`, `result[${i}]`);
            }
            throw error;
        }
    }
    // Validate status
    if (response.status !== 'ok') {
        throw new ValidationError('Response status must be "ok"', 'status');
    }
    // Validate time
    if (typeof response.time !== 'number' || response.time < 0) {
        throw new ValidationError('Time must be a non-negative number', 'time');
    }
}
/**
 * Validates a single search result
 */
function validateSearchResult(result) {
    if (!result || typeof result !== 'object') {
        throw new ValidationError('Search result must be an object');
    }
    // Validate ID
    if (result.id === undefined || result.id === null) {
        throw new ValidationError('Result ID is required', 'id');
    }
    if (typeof result.id !== 'string' && typeof result.id !== 'number') {
        throw new ValidationError('Result ID must be a string or number', 'id');
    }
    // Validate score
    if (typeof result.score !== 'number' || Number.isNaN(result.score)) {
        throw new ValidationError('Score must be a number', 'score');
    }
    // Validate optional payload
    if (result.payload !== undefined) {
        validatePayload(result.payload);
    }
    // Validate optional vector
    if (result.vector !== undefined) {
        if (!Array.isArray(result.vector)) {
            throw new ValidationError('Vector must be an array of numbers', 'vector');
        }
        for (let i = 0; i < result.vector.length; i++) {
            if (typeof result.vector[i] !== 'number' || Number.isNaN(result.vector[i])) {
                throw new ValidationError(`Vector element at index ${i} must be a valid number`, 'vector');
            }
        }
    }
}
/**
 * Validates collection info response
 */
function validateCollectionInfoResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new ValidationError('Collection info response must be an object');
    }
    // Validate result
    if (!response.result || typeof response.result !== 'object') {
        throw new ValidationError('Result is required', 'result');
    }
    const result = response.result;
    // Validate name
    if (!result.name || typeof result.name !== 'string') {
        throw new ValidationError('Collection name is required', 'result.name');
    }
    validateCollectionName(result.name);
    // Validate vector_count
    if (result.vector_count !== undefined) {
        if (typeof result.vector_count !== 'number' ||
            !Number.isInteger(result.vector_count) ||
            result.vector_count < 0) {
            throw new ValidationError('Vector count must be a non-negative integer', 'result.vector_count');
        }
    }
    // Validate status
    if (result.status !== undefined) {
        const validStatuses = ['green', 'yellow', 'red'];
        if (typeof result.status !== 'string' || !validStatuses.includes(result.status)) {
            throw new ValidationError(`Status must be one of: ${validStatuses.join(', ')}`, 'result.status');
        }
    }
    // Validate config
    if (result.config !== undefined) {
        if (typeof result.config !== 'object') {
            throw new ValidationError('Config must be an object', 'result.config');
        }
        if (result.config.params?.vectors) {
            validateVectorConfig(result.config.params.vectors);
        }
    }
    // Validate status and time
    if (response.status !== 'ok') {
        throw new ValidationError('Response status must be "ok"', 'status');
    }
    if (typeof response.time !== 'number' || response.time < 0) {
        throw new ValidationError('Time must be a non-negative number', 'time');
    }
}
/**
 * Validates error response format
 */
function validateErrorResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new ValidationError('Error response must be an object');
    }
    // Validate status
    if (response.status !== 'error') {
        throw new ValidationError('Error response status must be "error"', 'status');
    }
    // Validate message
    if (!response.message || typeof response.message !== 'string') {
        throw new ValidationError('Error message is required and must be a string', 'message');
    }
    // Validate code (optional)
    if (response.code !== undefined) {
        if (typeof response.code !== 'number' || !Number.isInteger(response.code)) {
            throw new ValidationError('Error code must be an integer', 'code');
        }
    }
    // Validate time
    if (typeof response.time !== 'number' || response.time < 0) {
        throw new ValidationError('Time must be a non-negative number', 'time');
    }
}
//# sourceMappingURL=validation.js.map