# QdrantService Contract

## Overview

The QdrantService provides a high-level abstraction over the Qdrant vector database client, implementing connection management, error handling, and vector operations with proper TypeScript typing.

## Interface Definition

```typescript
export interface IQdrantService {
  // Connection Management
  connect(config: QdrantConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectionStatus(): ConnectionStatus;

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
```

## Method Contracts

### Connection Management

#### connect(config: QdrantConfig): Promise&lt;void&gt;

**Purpose**: Establish connection to Qdrant instance

**Preconditions**:

- Service is not already connected
- Config contains valid connection parameters

**Postconditions**:

- Connection is established and ready for operations
- Connection status is updated

**Error Conditions**:

- `QdrantConnectionError`: Connection failed
- `QdrantConfigError`: Invalid configuration

#### disconnect(): Promise&lt;void&gt;

**Purpose**: Close connection to Qdrant instance

**Preconditions**:

- Service is connected

**Postconditions**:

- Connection is closed
- All pending operations are cancelled
- Connection status is updated

**Error Conditions**:

- `QdrantConnectionError`: Disconnection failed

### Collection Operations

#### createCollection(config: CollectionConfig): Promise&lt;void&gt;

**Purpose**: Create a new vector collection

**Preconditions**:

- Service is connected
- Collection name is valid and doesn't exist
- Config contains valid parameters

**Postconditions**:

- Collection is created with specified configuration
- Collection is ready for vector operations

**Error Conditions**:

- `QdrantConnectionError`: Not connected
- `QdrantConfigError`: Invalid collection config
- `QdrantError`: Collection already exists or creation failed

#### search(request: SearchRequest): Promise&lt;SearchResult[]&gt;

**Purpose**: Perform vector similarity search

**Preconditions**:

- Service is connected
- Collection exists
- Request contains valid search parameters

**Postconditions**:

- Returns ordered list of similar vectors
- Results respect limit and threshold parameters

**Error Conditions**:

- `QdrantConnectionError`: Not connected
- `QdrantSearchError`: Search operation failed
- `QdrantConfigError`: Invalid search parameters

## Data Contracts

### QdrantConfig

```typescript
interface QdrantConfig {
  url?: string;        // Full URL for cloud instances (e.g., "https://xyz.cloud.qdrant.io:6333")
  host?: string;       // Hostname for local instances (default: "localhost")
  port?: number;       // Port number (default: 6333)
  apiKey?: string;     // API key for authentication
  timeout?: number;    // Request timeout in milliseconds (default: 30000)
}
```

### CollectionConfig

```typescript
interface CollectionConfig {
  name: string;
  vectors: {
    size: 1536;                    // Fixed for OpenAI text-embedding-3-small
    distance: 'Cosine' | 'Euclid' | 'Dot';
  };
  optimizers_config?: {
    default_segment_number: number;
    memmap_threshold: number;
  };
  hnsw_config?: {
    m: number;                     // Number of edges per node (default: 16)
    ef_construct: number;          // Construction parameter (default: 100)
    full_scan_threshold: number;   // Threshold for full scan (default: 10000)
  };
}
```

### SearchRequest

```typescript
interface SearchRequest {
  collectionName: string;
  vector: number[];                // Query vector (must be 1536 dimensions)
  limit: number;                   // Number of results (1-1000)
  score_threshold?: number;        // Minimum similarity score (0-1)
  filter?: Record<string, any>;    // Payload filtering conditions
  with_payload?: boolean | string[]; // Include payload in results
  with_vector?: boolean;           // Include vectors in results
}
```

## Error Contracts

### Error Hierarchy

```text
QdrantError (base)
├── QdrantConnectionError
├── QdrantSearchError
├── QdrantConfigError
└── QdrantValidationError
```

### Error Response Format

```typescript
interface QdrantError {
  name: string;           // Error class name
  message: string;        // Human-readable error message
  code: string;           // Error code for programmatic handling
  originalError?: Error;  // Original error from Qdrant client (if applicable)
  field?: string;         // Field name for validation errors
  collection?: string;    // Collection name for collection-specific errors
}
```

## Validation Contracts

### Collection Name Validation

- **Format**: `/^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/`
- **Length**: 1-63 characters
- **Characters**: lowercase letters, numbers, hyphens, underscores
- **Boundaries**: Must start and end with alphanumeric characters

### Vector Validation

- **Dimensions**: Exactly 1536 (OpenAI text-embedding-3-small)
- **Values**: Finite numbers only (not NaN, not Infinity)
- **Range**: Typically normalized floats between -1 and 1

### Search Parameter Validation

- **limit**: 1 ≤ limit ≤ 1000
- **score_threshold**: 0 ≤ threshold ≤ 1 (when provided)
- **vector**: Must be exactly 1536 dimensions
- **collectionName**: Must exist and be valid format

## Performance Contracts

### Operation Timeouts

- **Connection operations**: 30 seconds
- **Search operations**: 10 seconds
- **Collection operations**: 60 seconds
- **Health checks**: 5 seconds

### Concurrency Limits

- **Maximum concurrent searches**: 10
- **Maximum concurrent upserts**: 5
- **Maximum concurrent collection operations**: 2

### Resource Limits

- **Maximum collection name length**: 63 characters
- **Maximum payload size per point**: 1MB
- **Maximum batch size for upsert**: 1000 points
- **Maximum search results**: 1000 results
