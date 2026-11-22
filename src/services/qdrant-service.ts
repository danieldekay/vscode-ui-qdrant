import { QdrantClient } from '@qdrant/js-client-rest';
import * as vscode from 'vscode';
import {
  QdrantCollectionNotFoundError,
  QdrantConnectionError,
  QdrantError,
  QdrantSearchError,
} from '../types/errors';
import type {
  CollectionConfig,
  CollectionInfo,
  ConnectionStatus,
  QdrantConfig,
  SearchRequest,
  SearchResult,
  VectorData,
} from '../types/qdrant';
import type { ConfigUpdateResult } from '../types/qdrantConfig';
import {
  type ConnectionError,
  ConnectionErrorCode,
  ConnectionStatus as LocalConnectionStatus,
} from '../types/qdrantConfig';
import { validateCollectionName } from '../validation/collection';
import { validateVector, validateVectors } from '../validation/vector';

/**
 * Service interface for Qdrant vector database operations
 */
export interface IQdrantService {
  // Connection Management
  connect(config: QdrantConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectionStatus(): ConnectionStatus;
  updateLocalDbPath(fileUri: vscode.Uri): Promise<ConfigUpdateResult>;

  // Collection Operations
  createCollection(config: CollectionConfig): Promise<void>;
  deleteCollection(name: string): Promise<void>;
  listCollections(): Promise<string[]>;
  collectionExists(name: string): Promise<boolean>;
  getCollectionInfo(name: string): Promise<CollectionInfo>;

  // Vector Operations
  upsert(collectionName: string, points: VectorData[]): Promise<void>;
  search(request: SearchRequest): Promise<SearchResult[]>;
  delete(collectionName: string, ids: string[]): Promise<void>;

  // Health Check
  healthCheck(): Promise<boolean>;
}

/**
 * Implementation of IQdrantService using @qdrant/js-client-rest
 */
export class QdrantService implements IQdrantService {
  private client: QdrantClient | null = null;
  private config: QdrantConfig | null = null;
  private connectedAt: Date | null = null;
  private lastError: Error | null = null;

  /**
   * Connect to Qdrant instance
   */
  async connect(config: QdrantConfig): Promise<void> {
    try {
      this.lastError = null;

      // Build URL from config
      let url: string;
      if (config.url) {
        url = config.url;
      } else if (config.host && config.port) {
        const protocol = config.https ? 'https' : 'http';
        url = `${protocol}://${config.host}:${config.port}`;
      } else {
        throw new QdrantConnectionError('Either url or host+port must be provided');
      }

      // Create client
      this.client = new QdrantClient({
        url,
        apiKey: config.apiKey,
        timeout: config.timeout,
      });

      // Test connection with health check
      await this.healthCheck();

      this.config = config;
      this.connectedAt = new Date();
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      this.client = null;
      this.config = null;
      this.connectedAt = null;

      throw QdrantError.from(error, 'Failed to connect to Qdrant');
    }
  }

  /**
   * Disconnect from Qdrant instance
   */
  async disconnect(): Promise<void> {
    this.client = null;
    this.config = null;
    this.connectedAt = null;
    this.lastError = null;
  }

  /**
   * Ensure client is connected, throw error if not
   */
  private ensureConnected(): void {
    if (!this.isConnected()) {
      throw new QdrantConnectionError('Not connected to Qdrant');
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.client !== null && this.lastError === null;
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
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
  async createCollection(config: CollectionConfig): Promise<void> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(config.name);

      // Create collection
      await this.client!.createCollection(config.name, {
        vectors: config.vectors,
        optimizers_config: config.optimizers_config,
        hnsw_config: config.hnsw_config,
      });
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw QdrantError.from(error, `Failed to create collection '${config.name}'`);
    }
  }

  /**
   * Delete a collection
   */
  async deleteCollection(name: string): Promise<void> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(name);

      await this.client!.deleteCollection(name);
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw QdrantError.from(error, `Failed to delete collection '${name}'`);
    }
  }

  /**
   * List all collections
   */
  async listCollections(): Promise<string[]> {
    this.ensureConnected();

    try {
      const response = await this.client!.getCollections();
      return response.collections.map((c) => c.name);
    } catch (error) {
      throw QdrantError.from(error, 'Failed to list collections');
    }
  }

  /**
   * Check if collection exists
   */
  async collectionExists(name: string): Promise<boolean> {
    try {
      // Validate collection name
      validateCollectionName(name);

      const collections = await this.listCollections();
      return collections.includes(name);
    } catch (error) {
      if (error instanceof QdrantCollectionNotFoundError) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get collection information
   */
  async getCollectionInfo(name: string): Promise<CollectionInfo> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(name);

      const info = await this.client!.getCollection(name);

      return {
        name,
        vectors_count: info.vectors_count || 0,
        segments_count: info.segments_count,
        points_count: info.points_count || 0,
        status: (info.status === 'grey' ? 'red' : info.status) as 'green' | 'yellow' | 'red',
        config: {
          name,
          vectors: {
            size: 1536, // Fixed dimension for our use case
            distance: (['Cosine', 'Euclid', 'Dot'] as const).includes(
              (info.config?.params?.vectors as any)?.distance,
            )
              ? ((info.config?.params?.vectors as any)?.distance as 'Cosine' | 'Euclid' | 'Dot')
              : 'Cosine',
          },
          optimizers_config: info.config?.optimizer_config
            ? {
                default_segment_number: info.config.optimizer_config.default_segment_number,
                memmap_threshold: info.config.optimizer_config.memmap_threshold || 10000,
              }
            : undefined,
          hnsw_config: info.config?.hnsw_config as any,
        },
      };
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw QdrantError.from(error, `Failed to get collection info for '${name}'`);
    }
  }

  /**
   * Upsert vectors into a collection
   */
  async upsert(collectionName: string, points: VectorData[]): Promise<void> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(collectionName);

      // Validate vectors
      const vectors = points.map((p) => p.vector);
      validateVectors(vectors, collectionName);

      // Prepare points for Qdrant
      const qdrantPoints = points.map((point) => ({
        id: point.id,
        vector: point.vector,
        payload: point.payload || {},
      }));

      await this.client!.upsert(collectionName, {
        wait: true,
        points: qdrantPoints,
      });
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw QdrantError.from(error, `Failed to upsert points in collection '${collectionName}'`);
    }
  }

  /**
   * Search for similar vectors
   */
  async search(request: SearchRequest): Promise<SearchResult[]> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(request.collectionName);

      // Validate query vector
      validateVector(request.vector, request.collectionName);

      const searchResponse = await this.client!.search(request.collectionName, {
        vector: request.vector,
        limit: request.limit,
        score_threshold: request.score_threshold,
        filter: request.filter,
        with_payload: request.with_payload,
        with_vector: request.with_vector,
      });

      return (searchResponse as any[]).map((result) => ({
        id: String(result.id),
        score: result.score,
        payload: result.payload || undefined,
        vector: Array.isArray(result.vector) ? (result.vector as number[]) : undefined,
      }));
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw new QdrantSearchError(
        `Search failed in collection '${request.collectionName}'`,
        request.collectionName,
        { originalError: error },
      );
    }
  }

  /**
   * Delete vectors by IDs
   */
  async delete(collectionName: string, ids: string[]): Promise<void> {
    this.ensureConnected();

    try {
      // Validate collection name
      validateCollectionName(collectionName);

      await this.client!.delete(collectionName, {
        wait: true,
        points: ids,
      });
    } catch (error) {
      if (error instanceof QdrantError) {
        throw error;
      }
      throw QdrantError.from(error, `Failed to delete points from collection '${collectionName}'`);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      // Try to list collections as a health check
      await this.client.getCollections();
      return true;
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      return false;
    }
  }

  /**
   * Update the local database file path configuration and connect to the database
   * @param fileUri - URI pointing to the new Qdrant database file
   * @returns Promise resolving to configuration update result
   */
  async updateLocalDbPath(fileUri: vscode.Uri): Promise<ConfigUpdateResult> {
    try {
      // Get current configuration
      const config = vscode.workspace.getConfiguration('qdrant');
      const previousPath = config.get<vscode.Uri | undefined>('localDbPath');

      // Store the previous config for rollback if needed
      const previousConfig = {
        localDbPath: previousPath,
        connectionStatus: previousPath
          ? LocalConnectionStatus.CONNECTED
          : LocalConnectionStatus.DISCONNECTED,
      };

      // Update configuration with new path
      await config.update('localDbPath', fileUri, vscode.ConfigurationTarget.Workspace);

      // Try to connect to the local Qdrant database
      let connectionStatus: LocalConnectionStatus;
      let connectionError: ConnectionError | undefined;

      try {
        // Basic validation that file exists and is accessible
        await vscode.workspace.fs.stat(fileUri);

        // For local database files, we need to create a local connection
        // For now, we'll assume a local server running on default port 6333
        // In a real implementation, this would start a local Qdrant server with the database file
        const localConfig: QdrantConfig = {
          url: 'http://localhost:6333',
          timeout: 5000,
        };

        // Attempt to connect to local Qdrant server
        await this.connect(localConfig);
        connectionStatus = LocalConnectionStatus.CONNECTED;
      } catch (error) {
        connectionStatus = LocalConnectionStatus.ERROR;
        connectionError = {
          code: ConnectionErrorCode.NETWORK_ERROR,
          message: 'Failed to connect to local Qdrant database',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
          recoverable: true,
          recoveryAction: 'Ensure Qdrant server is running locally on port 6333',
        };
      }

      const newConfig = {
        localDbPath: fileUri,
        connectionStatus,
        connectionError,
        lastConnectedAt:
          connectionStatus === LocalConnectionStatus.CONNECTED ? Date.now() : undefined,
      };

      return {
        success: connectionStatus === LocalConnectionStatus.CONNECTED,
        newConfig,
        previousConfig: previousConfig.localDbPath ? previousConfig : undefined,
        updatedAt: Date.now(),
      };
    } catch (error) {
      // Configuration update failed
      const connectionError: ConnectionError = {
        code: ConnectionErrorCode.UNKNOWN_ERROR,
        message: 'Failed to update configuration',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        recoverable: true,
        recoveryAction: 'Try again or check VS Code settings',
      };

      return {
        success: false,
        newConfig: {
          connectionStatus: LocalConnectionStatus.ERROR,
          connectionError,
        },
        error: connectionError,
        updatedAt: Date.now(),
      };
    }
  }
}
