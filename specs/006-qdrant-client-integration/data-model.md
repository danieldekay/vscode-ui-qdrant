# Data Model: Qdrant Client Integration

## Core Data Types

### Vector Data Structure

```typescript
interface VectorData {
  id: string;
  vector: number[]; // 1536 dimensions (OpenAI text-embedding-3-small)
  payload?: Record<string, any>;
}
```

### Collection Configuration

```typescript
interface CollectionConfig {
  name: string;
  vectors: {
    size: 1536; // Fixed for OpenAI text-embedding-3-small
    distance: 'Cosine' | 'Euclid' | 'Dot';
  };
  optimizers_config?: {
    default_segment_number: number;
    memmap_threshold: number;
  };
  hnsw_config?: {
    m: number;
    ef_construct: number;
    full_scan_threshold: number;
  };
}
```

### Search Parameters

```typescript
interface SearchRequest {
  collectionName: string;
  vector: number[]; // Query vector (1536 dimensions)
  limit: number; // Number of results to return
  score_threshold?: number; // Minimum similarity score
  filter?: Record<string, any>; // Payload filtering
  with_payload?: boolean | string[]; // Include payload in results
  with_vector?: boolean; // Include vectors in results
}

interface SearchResult {
  id: string;
  score: number;
  payload?: Record<string, any>;
  vector?: number[];
}
```

## Service Interface

### QdrantService Contract

```typescript
interface IQdrantService {
  // Connection management
  connect(config: QdrantConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Collection operations
  createCollection(config: CollectionConfig): Promise<void>;
  deleteCollection(name: string): Promise<void>;
  listCollections(): Promise<string[]>;
  collectionExists(name: string): Promise<boolean>;

  // Vector operations
  upsert(collectionName: string, points: VectorData[]): Promise<void>;
  search(request: SearchRequest): Promise<SearchResult[]>;
  delete(collectionName: string, ids: string[]): Promise<void>;

  // Collection info
  getCollectionInfo(name: string): Promise<CollectionInfo>;
}
```

### Configuration Types

```typescript
interface QdrantConfig {
  url?: string; // For cloud/remote instances
  host?: string; // For local instances
  port?: number;
  apiKey?: string; // Optional authentication
  timeout?: number; // Request timeout in milliseconds
}

interface CollectionInfo {
  name: string;
  vectors_count: number;
  segments_count: number;
  points_count: number;
  status: 'green' | 'yellow' | 'red';
  config: CollectionConfig;
}
```

## Error Types

### Custom Error Hierarchy

```typescript
class QdrantError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'QdrantError';
  }
}

class QdrantConnectionError extends QdrantError {
  constructor(message: string, originalError?: Error) {
    super(message, 'CONNECTION_ERROR', originalError);
    this.name = 'QdrantConnectionError';
  }
}

class QdrantSearchError extends QdrantError {
  constructor(message: string, originalError?: Error) {
    super(message, 'SEARCH_ERROR', originalError);
    this.name = 'QdrantSearchError';
  }
}

class QdrantConfigError extends QdrantError {
  constructor(message: string, field?: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'QdrantConfigError';
    this.field = field;
  }
  field?: string;
}
```

## Validation Rules

### Collection Name Validation

- Must be 1-63 characters long
- Can only contain lowercase letters, numbers, hyphens, and underscores
- Must start and end with alphanumeric characters
- Cannot be empty or contain only whitespace

### Vector Validation

- Must be exactly 1536 dimensions (OpenAI text-embedding-3-small)
- All values must be finite numbers (not NaN or Infinity)
- Values should be normalized floats between -1 and 1

### Search Parameter Validation

- `limit` must be between 1 and 1000
- `score_threshold` must be between 0 and 1 (if provided)
- Query vector must be exactly 1536 dimensions
- Collection name must exist and be valid

## State Management

### Connection State

```typescript
enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

interface ConnectionStatus {
  state: ConnectionState;
  lastError?: QdrantError;
  connectedAt?: Date;
  config?: QdrantConfig;
}
```

### Operation Queue

For handling concurrent operations and rate limiting:

```typescript
interface QueuedOperation<T = any> {
  id: string;
  type: 'search' | 'upsert' | 'delete' | 'collection_op';
  priority: 'low' | 'normal' | 'high';
  execute: () => Promise<T>;
  timeout: number;
  createdAt: Date;
}
