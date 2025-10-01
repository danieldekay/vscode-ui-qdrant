"use strict";
/**
 * Qdrant API Client
 *
 * HTTP-based client for interacting with Qdrant vector database
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantClient = void 0;
class QdrantClient {
    config;
    connected = false;
    /**
     * Connect to Qdrant server
     */
    async connect(config) {
        // Validate connection parameters
        if (!config.url) {
            throw new Error('Qdrant URL is required');
        }
        try {
            // Test connection by making a simple health check
            const response = await fetch(`${config.url}/health`, {
                method: 'GET',
                headers: this.getHeaders(config.apiKey),
            });
            if (!response.ok) {
                throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
            }
            this.config = config;
            this.connected = true;
        }
        catch (error) {
            throw new Error(`Failed to connect to Qdrant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Disconnect from Qdrant server
     */
    async disconnect() {
        this.config = undefined;
        this.connected = false;
    }
    /**
     * Check if client is connected
     */
    isConnected() {
        return this.connected;
    }
    /**
     * List all collections
     */
    async listCollections() {
        this.ensureConnected();
        const response = await this.makeRequest('/collections', 'GET');
        if (!response.ok) {
            throw new Error(`Failed to list collections: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.result?.collections?.map((c) => c.name) || [];
    }
    /**
     * Create a new collection
     */
    async createCollection(name, config) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${name}`, 'PUT', {
            vectors: config.vectors,
        });
        if (!response.ok) {
            throw new Error(`Failed to create collection: ${response.status} ${response.statusText}`);
        }
    }
    /**
     * Delete a collection
     */
    async deleteCollection(name) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${name}`, 'DELETE');
        if (!response.ok) {
            throw new Error(`Failed to delete collection: ${response.status} ${response.statusText}`);
        }
    }
    /**
     * Get collection information
     */
    async getCollection(name) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${name}`, 'GET');
        if (!response.ok) {
            throw new Error(`Failed to get collection info: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
     * Search for similar vectors
     */
    async search(collection, request) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${collection}/points/search`, 'POST', request);
        if (!response.ok) {
            throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
     * Upsert vectors to collection
     */
    async upsert(collection, request) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${collection}/points`, 'PUT', request);
        if (!response.ok) {
            throw new Error(`Upsert failed: ${response.status} ${response.statusText}`);
        }
    }
    /**
     * Delete vectors from collection
     */
    async delete(collection, ids) {
        this.ensureConnected();
        const response = await this.makeRequest(`/collections/${collection}/points/delete`, 'POST', {
            points: ids,
        });
        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
        }
    }
    ensureConnected() {
        if (!this.connected || !this.config) {
            throw new Error('Not connected to Qdrant server');
        }
    }
    getHeaders(apiKey) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (apiKey) {
            headers.Authorization = `Bearer ${apiKey}`;
        }
        return headers;
    }
    async makeRequest(endpoint, method, body) {
        if (!this.config) {
            throw new Error('Not connected to Qdrant server');
        }
        const url = `${this.config.url}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders(this.config.apiKey),
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        return fetch(url, options);
    }
}
exports.QdrantClient = QdrantClient;
//# sourceMappingURL=client.js.map