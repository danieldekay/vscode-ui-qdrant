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
export declare function validateQdrantCollection(collection: QdrantCollection): boolean;
//# sourceMappingURL=qdrant_collection.d.ts.map