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

export class QdrantClient {
  private config?: QdrantConfig;
  private connected = false;

  /**
   * Connect to Qdrant server
   */
  async connect(config: QdrantConfig): Promise<void> {
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
    } catch (error) {
      throw new Error(
        `Failed to connect to Qdrant: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Disconnect from Qdrant server
   */
  async disconnect(): Promise<void> {
    this.config = undefined;
    this.connected = false;
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * List all collections
   */
  async listCollections(): Promise<string[]> {
    this.ensureConnected();

    const response = await this.makeRequest('/collections', 'GET');

    if (!response.ok) {
      throw new Error(`Failed to list collections: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.result?.collections?.map((c: any) => c.name) || [];
  }

  /**
   * Create a new collection
   */
  async createCollection(name: string, config: CollectionConfig): Promise<void> {
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
  async deleteCollection(name: string): Promise<void> {
    this.ensureConnected();

    const response = await this.makeRequest(`/collections/${name}`, 'DELETE');

    if (!response.ok) {
      throw new Error(`Failed to delete collection: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Get collection information
   */
  async getCollection(name: string): Promise<CollectionInfo> {
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
  async search(collection: string, request: SearchRequest): Promise<SearchResponse> {
    this.ensureConnected();

    const response = await this.makeRequest(
      `/collections/${collection}/points/search`,
      'POST',
      request,
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Upsert vectors to collection
   */
  async upsert(collection: string, request: UpsertRequest): Promise<void> {
    this.ensureConnected();

    const response = await this.makeRequest(`/collections/${collection}/points`, 'PUT', request);

    if (!response.ok) {
      throw new Error(`Upsert failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Delete vectors from collection
   */
  async delete(collection: string, ids: (string | number)[]): Promise<void> {
    this.ensureConnected();

    const response = await this.makeRequest(`/collections/${collection}/points/delete`, 'POST', {
      points: ids,
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    }
  }

  private ensureConnected(): void {
    if (!this.connected || !this.config) {
      throw new Error('Not connected to Qdrant server');
    }
  }

  private getHeaders(apiKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    return headers;
  }

  private async makeRequest(endpoint: string, method: string, body?: any): Promise<Response> {
    if (!this.config) {
      throw new Error('Not connected to Qdrant server');
    }

    const url = `${this.config.url}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(this.config.apiKey),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(url, options);
  }
}
