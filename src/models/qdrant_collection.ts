/**
 * Represents a Qdrant collection with its metadata and configuration.
 */
export interface QdrantCollection {
  /** Collection name */
  name: string;

  /** Vector dimension */
  vectors: {
    size: number;
    distance: 'Cosine' | 'Euclid' | 'Dot';
  };

  /** Number of points in the collection */
  pointsCount: number;

  /** Collection status */
  status: 'green' | 'yellow' | 'red';

  /** Configuration settings */
  config: {
    params: {
      replicationFactor: number;
      writeConsistencyFactor: number;
    };
    hnswConfig: {
      m: number;
      efConstruct: number;
      fullScanThreshold: number;
    };
    optimizerConfig: {
      deletedThreshold: number;
      vacuumMinVectorNumber: number;
      defaultSegmentNumber: number;
      maxSegmentSize: number;
      memmapThreshold: number;
      indexingThreshold: number;
      flushIntervalSec: number;
    };
  };
}

/**
 * Validation rules for QdrantCollection
 */
export function validateQdrantCollection(collection: QdrantCollection): boolean {
  // name must be a non-empty string
  if (!collection.name || typeof collection.name !== 'string' || collection.name.trim() === '') {
    return false;
  }

  // vectors must have valid size and distance
  if (
    !collection.vectors ||
    typeof collection.vectors.size !== 'number' ||
    collection.vectors.size <= 0
  ) {
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
  if (
    !collection.config ||
    !collection.config.params ||
    !collection.config.hnswConfig ||
    !collection.config.optimizerConfig
  ) {
    return false;
  }

  return true;
}
