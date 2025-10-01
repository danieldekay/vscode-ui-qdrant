"use strict";
/**
 * Centralized validation utilities for the Qdrant extension.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVectorPointBatch = exports.validateVectorPoint = exports.validateSearchResultItem = exports.validateSearchParameters = exports.validateSearchFilter = exports.validateSearchConfig = exports.validateQdrantCollection = void 0;
exports.validateSearchQuery = validateSearchQuery;
exports.validateCollectionName = validateCollectionName;
exports.validateQdrantUrl = validateQdrantUrl;
exports.validateSearchOperation = validateSearchOperation;
var qdrant_collection_1 = require("../models/qdrant_collection");
Object.defineProperty(exports, "validateQdrantCollection", { enumerable: true, get: function () { return qdrant_collection_1.validateQdrantCollection; } });
var search_config_1 = require("../models/search_config");
Object.defineProperty(exports, "validateSearchConfig", { enumerable: true, get: function () { return search_config_1.validateSearchConfig; } });
var search_parameters_1 = require("../models/search_parameters");
Object.defineProperty(exports, "validateSearchFilter", { enumerable: true, get: function () { return search_parameters_1.validateSearchFilter; } });
Object.defineProperty(exports, "validateSearchParameters", { enumerable: true, get: function () { return search_parameters_1.validateSearchParameters; } });
// Re-export all validation functions from individual modules
var search_result_1 = require("../models/search_result");
Object.defineProperty(exports, "validateSearchResultItem", { enumerable: true, get: function () { return search_result_1.validateSearchResultItem; } });
var vector_point_1 = require("../models/vector_point");
Object.defineProperty(exports, "validateVectorPoint", { enumerable: true, get: function () { return vector_point_1.validateVectorPoint; } });
Object.defineProperty(exports, "validateVectorPointBatch", { enumerable: true, get: function () { return vector_point_1.validateVectorPointBatch; } });
/**
 * Validate a search query string.
 */
function validateSearchQuery(query) {
    if (!query || typeof query !== 'string') {
        return { valid: false, errors: ['Query must be a non-empty string'] };
    }
    const trimmed = query.trim();
    if (trimmed === '') {
        return { valid: false, errors: ['Query cannot be only whitespace'] };
    }
    if (trimmed.length > 10000) {
        return { valid: false, errors: ['Query is too long (maximum 10000 characters)'] };
    }
    return { valid: true };
}
/**
 * Validate a collection name.
 */
function validateCollectionName(name) {
    if (!name || typeof name !== 'string') {
        return { valid: false, errors: ['Collection name must be a string'] };
    }
    const trimmed = name.trim();
    if (trimmed === '') {
        return { valid: false, errors: ['Collection name cannot be empty'] };
    }
    if (trimmed.length > 255) {
        return { valid: false, errors: ['Collection name is too long (maximum 255 characters)'] };
    }
    // Qdrant collection name rules (simplified)
    const validNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validNameRegex.test(trimmed)) {
        return {
            valid: false,
            errors: ['Collection name can only contain letters, numbers, hyphens, and underscores'],
        };
    }
    return { valid: true };
}
/**
 * Validate a URL for Qdrant connection.
 */
function validateQdrantUrl(url) {
    if (!url || typeof url !== 'string') {
        return { valid: false, errors: ['URL must be a string'] };
    }
    const trimmed = url.trim();
    if (trimmed === '') {
        return { valid: false, errors: ['URL cannot be empty'] };
    }
    // Allow file:// URLs for local mode
    if (trimmed.startsWith('file://')) {
        return { valid: true };
    }
    // For HTTP URLs, basic validation
    try {
        const parsedUrl = new URL(trimmed);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return { valid: false, errors: ['URL must use HTTP or HTTPS protocol'] };
        }
    }
    catch {
        return { valid: false, errors: ['Invalid URL format'] };
    }
    return { valid: true };
}
/**
 * Comprehensive validation for search operation inputs.
 */
function validateSearchOperation(query, parameters) {
    const errors = [];
    // Validate query
    const queryValidation = validateSearchQuery(query);
    if (!queryValidation.valid) {
        errors.push(...(queryValidation.errors || []));
    }
    // Validate parameters (if provided)
    if (parameters) {
        // Import validation dynamically to avoid circular imports
        try {
            // This would use the SearchParameters validation
            // For now, basic checks
            if (typeof parameters.similarityThreshold === 'number') {
                if (parameters.similarityThreshold < 0 || parameters.similarityThreshold > 1) {
                    errors.push('Similarity threshold must be between 0.0 and 1.0');
                }
            }
            if (typeof parameters.resultLimit === 'number') {
                if (parameters.resultLimit < 1 || parameters.resultLimit > 1000) {
                    errors.push('Result limit must be between 1 and 1000');
                }
            }
        }
        catch (_error) {
            errors.push('Parameter validation failed');
        }
    }
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
}
//# sourceMappingURL=index.js.map