/**
 * Represents a vector point in Qdrant with its ID, vector data, and payload.
 */
export interface VectorPoint {
    /** Unique identifier for the point */
    id: string | number;
    /** Vector data as array of numbers */
    vector: number[];
    /** Associated payload/metadata */
    payload?: Record<string, any>;
}
/**
 * Validation rules for VectorPoint
 */
export declare function validateVectorPoint(point: VectorPoint): boolean;
/**
 * Batch of vector points for bulk operations.
 */
export interface VectorPointBatch {
    /** Array of points to process */
    points: VectorPoint[];
    /** Whether to wait for indexing to complete */
    wait?: boolean;
}
/**
 * Validation rules for VectorPointBatch
 */
export declare function validateVectorPointBatch(batch: VectorPointBatch): boolean;
//# sourceMappingURL=vector_point.d.ts.map