# Data Model: VSCode Extension Scaffold & Development Environment

**Date**: 2025-10-01
**Feature**: VSCode Extension Scaffold & Development Environment
**Branch**: 005-vscode-extension-scaffold

## Entities

### Extension Manifest
**Purpose**: Defines extension metadata, commands, and activation events
**Fields**:
- `name`: string (extension identifier)
- `displayName`: string (user-visible name)
- `version`: string (semantic version)
- `description`: string (extension description)
- `engines.vscode`: string (minimum VS Code version, "^1.74.0")
- `activationEvents`: string[] (events that activate extension)
- `contributes.commands`: Command[] (registered commands)
- `contributes.views`: View[] (UI contributions)
**Validation Rules**:
- `engines.vscode` must be "^1.74.0" or higher
- `activationEvents` must include "onCommand" for Qdrant commands
- `contributes.commands` must include Qdrant search and collection commands

### Qdrant Connection
**Purpose**: Configuration for connecting to local Qdrant instance
**Fields**:
- `host`: string (Qdrant server host, default "localhost")
- `port`: number (Qdrant server port, default 6333)
- `apiKey`: string (optional authentication key)
- `timeout`: number (connection timeout in milliseconds, default 5000)
- `isConnected`: boolean (current connection status)
**Validation Rules**:
- `host` must be valid hostname or IP
- `port` must be between 1-65535
- `timeout` must be positive number

### Vector Search Query
**Purpose**: Represents a vector similarity search request
**Fields**:
- `collection`: string (target collection name)
- `vector`: number[] (query vector)
- `limit`: number (maximum results, default 10)
- `scoreThreshold`: number (minimum similarity score, optional)
- `filter`: object (metadata filter conditions, optional)
- `withPayload`: boolean (include document payload, default true)
- `withVectors`: boolean (include vector data, default false)
**Validation Rules**:
- `collection` must not be empty
- `vector` must be non-empty array of numbers
- `limit` must be positive integer ≤ 1000

### Search Result
**Purpose**: Represents a single vector search result
**Fields**:
- `id`: string (document unique identifier)
- `score`: number (similarity score 0.0-1.0)
- `payload`: object (document content and metadata)
- `vector`: number[] (document vector, optional)
**Validation Rules**:
- `score` must be between 0.0 and 1.0
- `id` must be non-empty string

### Collection Info
**Purpose**: Metadata about a Qdrant collection
**Fields**:
- `name`: string (collection name)
- `vectorSize`: number (vector dimensionality)
- `distance`: string (distance metric: "Cosine" | "Euclid" | "Dot")
- `pointCount`: number (number of vectors in collection)
- `status`: string (collection status: "Green" | "Yellow" | "Red")
**Validation Rules**:
- `name` must match Qdrant naming conventions
- `vectorSize` must be positive integer
- `distance` must be one of allowed values

### UI State
**Purpose**: Manages extension UI component states
**Fields**:
- `connectionStatus`: "connected" | "connecting" | "disconnected" | "error"
- `currentCollection`: string (active collection name, optional)
- `searchInProgress`: boolean (search operation active)
- `lastError`: string (last error message, optional)
**Validation Rules**:
- `connectionStatus` must be one of defined values
- State transitions must be valid (e.g., no direct "connecting" → "error")

## Relationships

### Extension Manifest → Qdrant Connection
- One-to-one: Extension has one connection configuration
- Extension manifest defines connection settings in contributes.configuration

### Qdrant Connection → Collection Info
- One-to-many: Connection can access multiple collections
- Collections discovered dynamically via Qdrant API

### Collection Info → Vector Search Query
- One-to-many: Each collection can have multiple search queries
- Queries target specific collections

### Vector Search Query → Search Result
- One-to-many: Each query returns multiple results
- Results ordered by similarity score descending

### UI State → All Entities
- One-to-one: UI state reflects current extension state
- UI components update based on connection and operation status

## State Transitions

### Connection States
```
Disconnected → Connecting (user initiates connection)
Connecting → Connected (successful connection)
Connecting → Error (connection failure)
Connected → Error (runtime disconnection)
Error → Connecting (user retries)
Any State → Disconnected (user disconnects)
```

### Search Operation States
```
Idle → Searching (user initiates search)
Searching → Results (successful completion)
Searching → Error (search failure)
Results → Idle (user clears results)
Error → Idle (user acknowledges error)
```

## Validation Rules Summary

1. **Connection Validation**: Host/port format, timeout ranges
2. **Search Validation**: Vector format, limit bounds, collection existence
3. **Collection Validation**: Naming conventions, configuration consistency
4. **UI State Validation**: Valid state transitions, required field presence
5. **Cross-entity Validation**: Collection existence for searches, connection for operations</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/005-vscode-extension-scaffold/data-model.md