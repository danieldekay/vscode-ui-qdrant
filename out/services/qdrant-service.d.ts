import * as vscode from 'vscode';
import type { CollectionConfig, CollectionInfo, ConnectionStatus, QdrantConfig, SearchRequest, SearchResult, VectorData } from '../types/qdrant';
import type { ConfigUpdateResult } from '../types/qdrantConfig';
/**
 * Service interface for Qdrant vector database operations
 */
export interface IQdrantService {
    connect(config: QdrantConfig): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getConnectionStatus(): ConnectionStatus;
    createCollection(config: CollectionConfig): Promise<void>;
    deleteCollection(name: string): Promise<void>;
    listCollections(): Promise<string[]>;
    collectionExists(name: string): Promise<boolean>;
    getCollectionInfo(name: string): Promise<CollectionInfo>;
    upsert(collectionName: string, points: VectorData[]): Promise<void>;
    search(request: SearchRequest): Promise<SearchResult[]>;
    delete(collectionName: string, ids: string[]): Promise<void>;
    healthCheck(): Promise<boolean>;
}
/**
 * Implementation of IQdrantService using @qdrant/js-client-rest
 */
export declare class QdrantService implements IQdrantService {
    private client;
    private config;
    private connectedAt;
    private lastError;
    /**
     * Connect to Qdrant instance
     */
    connect(config: QdrantConfig): Promise<void>;
    /**
     * Disconnect from Qdrant instance
     */
    disconnect(): Promise<void>;
    /**
     * Ensure client is connected, throw error if not
     */
    private ensureConnected;
    /**
     * Check if currently connected
     */
    isConnected(): boolean;
    /**
     * Get current connection status
     */
    getConnectionStatus(): ConnectionStatus;
    /**
     * Create a new collection
     */
    createCollection(config: CollectionConfig): Promise<void>;
    /**
     * Delete a collection
     */
    deleteCollection(name: string): Promise<void>;
    /**
     * List all collections
     */
    listCollections(): Promise<string[]>;
    /**
     * Check if collection exists
     */
    collectionExists(name: string): Promise<boolean>;
    /**
     * Get collection information
     */
    getCollectionInfo(name: string): Promise<CollectionInfo>;
    /**
     * Upsert vectors into a collection
     */
    upsert(collectionName: string, points: VectorData[]): Promise<void>;
    /**
     * Search for similar vectors
     */
    search(request: SearchRequest): Promise<SearchResult[]>;
    /**
     * Delete vectors by IDs
     */
    delete(collectionName: string, ids: string[]): Promise<void>;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
    /**
     * Update the local database file path configuration
     * @param fileUri - URI pointing to the new Qdrant database file
     * @returns Promise resolving to configuration update result
     */
    static updateLocalDbPath(fileUri: vscode.Uri): Promise<ConfigUpdateResult>;
}
//# sourceMappingURL=qdrant-service.d.ts.map