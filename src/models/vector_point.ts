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
export function validateVectorPoint(point: VectorPoint): boolean {
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
  if (
    point.payload !== undefined &&
    (typeof point.payload !== 'object' || point.payload === null)
  ) {
    return false;
  }

  return true;
}

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
export function validateVectorPointBatch(batch: VectorPointBatch): boolean {
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
