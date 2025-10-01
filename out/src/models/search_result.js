"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchResultItem = validateSearchResultItem;
/**
 * Validation rules for SearchResultItem
 */
function validateSearchResultItem(item) {
    // id must be a valid string identifier
    if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
        return false;
    }
    // score must be between 0.0 and 1.0
    if (typeof item.score !== 'number' || item.score < 0.0 || item.score > 1.0) {
        return false;
    }
    // payload can be any object structure but must exist
    if (!item.payload || typeof item.payload !== 'object') {
        return false;
    }
    // vector is optional but if present must be an array of numbers
    if (item.vector !== undefined) {
        if (!Array.isArray(item.vector) || !item.vector.every((v) => typeof v === 'number')) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=search_result.js.map