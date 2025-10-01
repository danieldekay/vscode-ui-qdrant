/**
 * Qdrant API Client
 *
 * HTTP-based client for interacting with Qdrant vector database
 */
export interface QdrantConfig {
    url: string;
    apiKey?: string;
}
export interface CollectionConfig {
    vectors: {
        size: number;
        distance: 'Cosine' | 'Euclid' | 'Dot';
    };
}
export interface SearchRequest {
    vector: number[];
    limit: number;
    with_payload?: boolean;
    with_vector?: boolean;
}
export interface SearchResponse {
    result: Array<{
        id: string | number;
        score: number;
        payload?: any;
        vector?: number[];
    }>;
}
export interface UpsertRequest {
    points: Array<{
        id: string | number;
        vector: number[];
        payload?: any;
    }>;
}
export interface CollectionInfo {
    result: {
        status: string;
        vectors_count: number;
        points_count: number;
    };
}
export declare class QdrantClient {
    private config?;
    private connected;
    /**
     * Connect to Qdrant server
     */
    connect(config: QdrantConfig): Promise<void>;
    /**
     * Disconnect from Qdrant server
     */
    disconnect(): Promise<void>;
    /**
     * Check if client is connected
     */
    isConnected(): boolean;
    /**
     * List all collections
     */
    listCollections(): Promise<string[]>;
    /**
     * Create a new collection
     */
    createCollection(name: string, config: CollectionConfig): Promise<void>;
    /**
     * Delete a collection
     */
    deleteCollection(name: string): Promise<void>;
    /**
     * Get collection information
     */
    getCollection(name: string): Promise<CollectionInfo>;
    /**
     * Search for similar vectors
     */
    search(collection: string, request: SearchRequest): Promise<SearchResponse>;
    /**
     * Upsert vectors to collection
     */
    upsert(collection: string, request: UpsertRequest): Promise<void>;
    /**
     * Delete vectors from collection
     */
    delete(collection: string, ids: (string | number)[]): Promise<void>;
    private ensureConnected;
    private getHeaders;
    private makeRequest;
}
//# sourceMappingURL=client.d.ts.map