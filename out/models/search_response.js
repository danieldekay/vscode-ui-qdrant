"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchResponse = validateSearchResponse;
exports.createEmptySearchResponse = createEmptySearchResponse;
/**
 * Validation rules for SearchResponse
 */
function validateSearchResponse(response) {
    // queryId must be a string
    if (!response.queryId || typeof response.queryId !== 'string') {
        return false;
    }
    // results array can be empty but must be defined
    if (!Array.isArray(response.results)) {
        return false;
    }
    // totalFound must be >= results.length and non-negative
    if (typeof response.totalFound !== 'number' ||
        response.totalFound < 0 ||
        response.totalFound < response.results.length) {
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
function createEmptySearchResponse(queryId) {
    return {
        queryId,
        results: [],
        totalFound: 0,
        searchTime: 0,
        hasMore: false,
    };
}
//# sourceMappingURL=search_response.js.map