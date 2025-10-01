"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQdrantCollection = validateQdrantCollection;
/**
 * Validation rules for QdrantCollection
 */
function validateQdrantCollection(collection) {
    // name must be a non-empty string
    if (!collection.name || typeof collection.name !== 'string' || collection.name.trim() === '') {
        return false;
    }
    // vectors must have valid size and distance
    if (!collection.vectors ||
        typeof collection.vectors.size !== 'number' ||
        collection.vectors.size <= 0) {
        return false;
    }
    const validDistances = ['Cosine', 'Euclid', 'Dot'];
    if (!validDistances.includes(collection.vectors.distance)) {
        return false;
    }
    // pointsCount must be non-negative
    if (typeof collection.pointsCount !== 'number' || collection.pointsCount < 0) {
        return false;
    }
    // status must be valid
    const validStatuses = ['green', 'yellow', 'red'];
    if (!validStatuses.includes(collection.status)) {
        return false;
    }
    // config is required and must have required fields
    if (!collection.config ||
        !collection.config.params ||
        !collection.config.hnswConfig ||
        !collection.config.optimizerConfig) {
        return false;
    }
    return true;
}
//# sourceMappingURL=qdrant_collection.js.map