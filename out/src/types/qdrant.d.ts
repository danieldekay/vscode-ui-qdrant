/**
 * Configuration for connecting to Qdrant
 */
export interface QdrantConfig {
    /** Qdrant server URL (e.g., 'http://localhost:6333' or 'file:///path/to/db' for local mode) */
    url?: string;
    /** Qdrant server host (alternative to url) */
    host?: string;
    /** Qdrant server port (alternative to url) */
    port?: number;
    /** API key for authentication */
    apiKey?: string;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Whether to use HTTPS */
    https?: boolean;
}
/**
 * Configuration for creating a Qdrant collection
 */
export interface CollectionConfig {
    /** Collection name (must match pattern: ^[a-zA-Z0-9_-]+$) */
    name: string;
    /** Vector configuration */
    vectors: {
        /** Vector dimension size (fixed at 1536 for OpenAI text-embedding-3-small) */
        size: 1536;
        /** Distance metric for similarity search */
        distance: 'Cosine' | 'Euclid' | 'Dot';
    };
    /** Optimizer configuration for performance tuning */
    optimizers_config?: {
        /** Default number of segments */
        default_segment_number: number;
        /** Memory map threshold in bytes */
        memmap_threshold: number;
    };
    /** HNSW (Hierarchical Navigable Small World) index configuration */
    hnsw_config?: {
        /** Number of bi-directional links created for every new element during construction */
        m: number;
        /** Number of neighbours to return during the stage of index construction */
        ef_construct: number;
        /** Minimum number of vectors in a segment to enable full scan threshold */
        full_scan_threshold: number;
    };
}
/**
 * Data structure for vector points to be inserted
 */
export interface VectorData {
    /** Unique identifier for the vector point */
    id: string;
    /** Vector embedding (must be 1536 dimensions) */
    vector: number[];
    /** Optional payload data associated with the vector */
    payload?: Record<string, any>;
}
/**
 * Search request parameters
 */
export interface SearchRequest {
    /** Name of the collection to search in */
    collectionName: string;
    /** Query vector (must be 1536 dimensions) */
    vector: number[];
    /** Maximum number of results to return */
    limit: number;
    /** Minimum similarity score threshold (0.0 to 1.0) */
    score_threshold?: number;
    /** Filter conditions for payload-based filtering */
    filter?: Record<string, any>;
    /** Which payload fields to include in results */
    with_payload?: boolean | string[];
    /** Whether to include the vector data in results */
    with_vector?: boolean;
}
/**
 * Search result structure
 */
export interface SearchResult {
    /** Unique identifier of the found vector */
    id: string;
    /** Similarity score (higher is more similar) */
    score: number;
    /** Payload data if requested */
    payload?: Record<string, any>;
    /** Vector data if requested */
    vector?: number[];
}
/**
 * Connection status information
 */
export interface ConnectionStatus {
    /** Current connection state */
    state: 'disconnected' | 'connecting' | 'connected' | 'error';
    /** Last error if connection failed */
    lastError?: Error;
    /** Timestamp when connection was established */
    connectedAt?: Date;
    /** Current configuration being used */
    config?: QdrantConfig;
}
/**
 * Collection information returned by Qdrant
 */
export interface CollectionInfo {
    /** Collection name */
    name: string;
    /** Number of vectors in the collection */
    vectors_count: number;
    /** Number of segments in the collection */
    segments_count: number;
    /** Total number of points (including deleted) */
    points_count: number;
    /** Collection health status */
    status: 'green' | 'yellow' | 'red';
    /** Collection configuration */
    config: CollectionConfig;
}
/**
 * Delete request parameters
 */
export interface DeleteRequest {
    /** Name of the collection to delete from */
    collectionName: string;
    /** IDs of points to delete */
    ids: string[];
    /** Wait for operation to complete */
    wait?: boolean;
}
/**
 * Upsert request parameters
 */
export interface UpsertRequest {
    /** Name of the collection to upsert into */
    collectionName: string;
    /** Points to upsert */
    points: VectorData[];
    /** Wait for operation to complete */
    wait?: boolean;
}
/**
 * Health check response
 */
export interface HealthResponse {
    /** Whether the service is healthy */
    healthy: boolean;
    /** Service version if available */
    version?: string;
    /** Additional health information */
    details?: Record<string, any>;
}
//# sourceMappingURL=qdrant.d.ts.map