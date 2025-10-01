"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantService = void 0;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const errors_1 = require("../types/errors");
const collection_1 = require("../validation/collection");
const vector_1 = require("../validation/vector");
/**
 * Implementation of IQdrantService using @qdrant/js-client-rest
 */
class QdrantService {
    client = null;
    config = null;
    connectedAt = null;
    lastError = null;
    /**
     * Connect to Qdrant instance
     */
    async connect(config) {
        try {
            this.lastError = null;
            // Build URL from config
            let url;
            if (config.url) {
                url = config.url;
            }
            else if (config.host && config.port) {
                const protocol = config.https ? 'https' : 'http';
                url = `${protocol}://${config.host}:${config.port}`;
            }
            else {
                throw new errors_1.QdrantConnectionError('Either url or host+port must be provided');
            }
            // Create client
            this.client = new js_client_rest_1.QdrantClient({
                url,
                apiKey: config.apiKey,
                timeout: config.timeout,
            });
            // Test connection with health check
            await this.healthCheck();
            this.config = config;
            this.connectedAt = new Date();
        }
        catch (error) {
            this.lastError = error instanceof Error ? error : new Error(String(error));
            this.client = null;
            this.config = null;
            this.connectedAt = null;
            throw errors_1.QdrantError.from(error, 'Failed to connect to Qdrant');
        }
    }
    /**
     * Disconnect from Qdrant instance
     */
    async disconnect() {
        this.client = null;
        this.config = null;
        this.connectedAt = null;
        this.lastError = null;
    }
    /**
     * Ensure client is connected, throw error if not
     */
    ensureConnected() {
        if (!this.isConnected()) {
            throw new errors_1.QdrantConnectionError('Not connected to Qdrant');
        }
    }
    /**
     * Check if currently connected
     */
    isConnected() {
        return this.client !== null && this.lastError === null;
    }
    /**
     * Get current connection status
     */
    getConnectionStatus() {
        if (this.isConnected()) {
            return {
                state: 'connected',
                connectedAt: this.connectedAt || undefined,
                config: this.config || undefined,
            };
        }
        if (this.lastError) {
            return {
                state: 'error',
                lastError: this.lastError,
                config: this.config || undefined,
            };
        }
        return {
            state: 'disconnected',
            config: this.config || undefined,
        };
    }
    /**
     * Create a new collection
     */
    async createCollection(config) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(config.name);
            // Create collection
            await this.client.createCollection(config.name, {
                vectors: config.vectors,
                optimizers_config: config.optimizers_config,
                hnsw_config: config.hnsw_config,
            });
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw errors_1.QdrantError.from(error, `Failed to create collection '${config.name}'`);
        }
    }
    /**
     * Delete a collection
     */
    async deleteCollection(name) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(name);
            await this.client.deleteCollection(name);
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw errors_1.QdrantError.from(error, `Failed to delete collection '${name}'`);
        }
    }
    /**
     * List all collections
     */
    async listCollections() {
        this.ensureConnected();
        try {
            const response = await this.client.getCollections();
            return response.collections.map((c) => c.name);
        }
        catch (error) {
            throw errors_1.QdrantError.from(error, 'Failed to list collections');
        }
    }
    /**
     * Check if collection exists
     */
    async collectionExists(name) {
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(name);
            const collections = await this.listCollections();
            return collections.includes(name);
        }
        catch (error) {
            if (error instanceof errors_1.QdrantCollectionNotFoundError) {
                return false;
            }
            throw error;
        }
    }
    /**
     * Get collection information
     */
    async getCollectionInfo(name) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(name);
            const info = await this.client.getCollection(name);
            return {
                name,
                vectors_count: info.vectors_count || 0,
                segments_count: info.segments_count,
                points_count: info.points_count || 0,
                status: (info.status === 'grey' ? 'red' : info.status),
                config: {
                    name,
                    vectors: {
                        size: 1536, // Fixed dimension for our use case
                        distance: ['Cosine', 'Euclid', 'Dot'].includes(info.config?.params?.vectors?.distance)
                            ? info.config?.params?.vectors?.distance
                            : 'Cosine',
                    },
                    optimizers_config: info.config?.optimizer_config
                        ? {
                            default_segment_number: info.config.optimizer_config.default_segment_number,
                            memmap_threshold: info.config.optimizer_config.memmap_threshold || 10000,
                        }
                        : undefined,
                    hnsw_config: info.config?.hnsw_config,
                },
            };
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw errors_1.QdrantError.from(error, `Failed to get collection info for '${name}'`);
        }
    }
    /**
     * Upsert vectors into a collection
     */
    async upsert(collectionName, points) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(collectionName);
            // Validate vectors
            const vectors = points.map((p) => p.vector);
            (0, vector_1.validateVectors)(vectors, collectionName);
            // Prepare points for Qdrant
            const qdrantPoints = points.map((point) => ({
                id: point.id,
                vector: point.vector,
                payload: point.payload || {},
            }));
            await this.client.upsert(collectionName, {
                wait: true,
                points: qdrantPoints,
            });
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw errors_1.QdrantError.from(error, `Failed to upsert points in collection '${collectionName}'`);
        }
    }
    /**
     * Search for similar vectors
     */
    async search(request) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(request.collectionName);
            // Validate query vector
            (0, vector_1.validateVector)(request.vector, request.collectionName);
            const searchResponse = await this.client.search(request.collectionName, {
                vector: request.vector,
                limit: request.limit,
                score_threshold: request.score_threshold,
                filter: request.filter,
                with_payload: request.with_payload,
                with_vector: request.with_vector,
            });
            return searchResponse.map((result) => ({
                id: String(result.id),
                score: result.score,
                payload: result.payload || undefined,
                vector: Array.isArray(result.vector) ? result.vector : undefined,
            }));
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw new errors_1.QdrantSearchError(`Search failed in collection '${request.collectionName}'`, request.collectionName, { originalError: error });
        }
    }
    /**
     * Delete vectors by IDs
     */
    async delete(collectionName, ids) {
        this.ensureConnected();
        try {
            // Validate collection name
            (0, collection_1.validateCollectionName)(collectionName);
            await this.client.delete(collectionName, {
                wait: true,
                points: ids,
            });
        }
        catch (error) {
            if (error instanceof errors_1.QdrantError) {
                throw error;
            }
            throw errors_1.QdrantError.from(error, `Failed to delete points from collection '${collectionName}'`);
        }
    }
    /**
     * Health check
     */
    async healthCheck() {
        if (!this.client) {
            return false;
        }
        try {
            // Try to list collections as a health check
            await this.client.getCollections();
            return true;
        }
        catch (error) {
            this.lastError = error instanceof Error ? error : new Error(String(error));
            return false;
        }
    }
}
exports.QdrantService = QdrantService;
//# sourceMappingURL=qdrant-service.js.map