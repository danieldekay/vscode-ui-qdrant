"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SEARCH_PARAMETERS = void 0;
exports.validateSearchParameters = validateSearchParameters;
exports.validateSearchFilter = validateSearchFilter;
/**
 * Default values for SearchParameters
 */
exports.DEFAULT_SEARCH_PARAMETERS = {
    similarityThreshold: 0.7,
    resultLimit: 50,
    includePayload: true,
    includeVector: false,
};
/**
 * Validation rules for SearchParameters
 */
function validateSearchParameters(params) {
    // similarityThreshold must be between 0.0 and 1.0
    if (typeof params.similarityThreshold !== 'number' ||
        params.similarityThreshold < 0.0 ||
        params.similarityThreshold > 1.0) {
        return false;
    }
    // resultLimit must be between 1 and 1000
    if (typeof params.resultLimit !== 'number' ||
        params.resultLimit < 1 ||
        params.resultLimit > 1000) {
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
function validateSearchFilter(filter) {
    // field must be a non-empty string
    if (!filter.field || typeof filter.field !== 'string' || filter.field.trim() === '') {
        return false;
    }
    // operator must be a valid FilterOperator
    const validOperators = ['EQ', 'NE', 'GT', 'LT', 'GTE', 'LTE', 'IN', 'NIN'];
    if (!validOperators.includes(filter.operator)) {
        return false;
    }
    // value must exist (can be any type)
    if (filter.value === undefined) {
        return false;
    }
    return true;
}
//# sourceMappingURL=search_parameters.js.map