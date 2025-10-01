"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVectorPoint = validateVectorPoint;
exports.validateVectorPointBatch = validateVectorPointBatch;
/**
 * Validation rules for VectorPoint
 */
function validateVectorPoint(point) {
    // id must be a string or number
    if (point.id === undefined || point.id === null) {
        return false;
    }
    if (typeof point.id !== 'string' && typeof point.id !== 'number') {
        return false;
    }
    // vector must be a non-empty array of numbers
    if (!Array.isArray(point.vector) || point.vector.length === 0) {
        return false;
    }
    if (!point.vector.every((v) => typeof v === 'number' && !Number.isNaN(v))) {
        return false;
    }
    // payload is optional but if present must be an object
    if (point.payload !== undefined &&
        (typeof point.payload !== 'object' || point.payload === null)) {
        return false;
    }
    return true;
}
/**
 * Validation rules for VectorPointBatch
 */
function validateVectorPointBatch(batch) {
    // points must be a non-empty array
    if (!Array.isArray(batch.points) || batch.points.length === 0) {
        return false;
    }
    // each point must be valid
    for (const point of batch.points) {
        if (!validateVectorPoint(point)) {
            return false;
        }
    }
    // wait is optional but must be boolean if present
    if (batch.wait !== undefined && typeof batch.wait !== 'boolean') {
        return false;
    }
    return true;
}
//# sourceMappingURL=vector_point.js.map