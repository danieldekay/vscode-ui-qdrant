# Quick Start: Qdrant Client Integration

## Overview

This guide provides a quick start for integrating Qdrant vector database functionality into the VS Code extension. The implementation follows a service-oriented architecture with proper error handling and TypeScript typing.

## Prerequisites

- Node.js LTS 20.x+
- VS Code Extension Development Environment
- Local Qdrant instance (for development)
- OpenAI API key (for embeddings)

## Installation

Add the Qdrant client dependency:

```bash
npm install @qdrant/js-client-rest
```

## Basic Usage

### 1. Import and Initialize

```typescript
import { QdrantService } from './services/qdrant-service';
import { QdrantConfig } from './types/qdrant';

// Initialize service
const qdrantService = new QdrantService();

// Configure connection
const config: QdrantConfig = {
  host: 'localhost',
  port: 6333,
  timeout: 30000
};

// Connect to Qdrant
await qdrantService.connect(config);
```

### 2. Create a Collection

```typescript
const collectionConfig = {
  name: 'my-collection',
  vectors: {
    size: 1536,  // OpenAI text-embedding-3-small
    distance: 'Cosine'
  }
};

await qdrantService.createCollection(collectionConfig);
```

### 3. Add Vectors

```typescript
const vectors = [
  {
    id: 'doc-1',
    vector: [/* 1536-dimensional embedding */],
    payload: { text: 'Sample document', metadata: { source: 'user' } }
  }
];

await qdrantService.upsert('my-collection', vectors);
```

### 4. Search Vectors

```typescript
const searchRequest = {
  collectionName: 'my-collection',
  vector: [/* 1536-dimensional query embedding */],
  limit: 10,
  score_threshold: 0.7,
  with_payload: true
};

const results = await qdrantService.search(searchRequest);
console.log('Search results:', results);
```

## Configuration

### VS Code Settings

Add to `package.json`:

```json
{
  "contributes": {
    "configuration": {
      "title": "Qdrant",
      "properties": {
        "qdrant.host": {
          "type": "string",
          "default": "localhost",
          "description": "Qdrant server hostname"
        },
        "qdrant.port": {
          "type": "number",
          "default": 6333,
          "description": "Qdrant server port"
        },
        "qdrant.apiKey": {
          "type": "string",
          "description": "Qdrant API key (optional)"
        }
      }
    }
  }
}
```

### Extension Integration

```typescript
// In extension.ts
import * as vscode from 'vscode';
import { QdrantService } from './services/qdrant-service';

let qdrantService: QdrantService;

export function activate(context: vscode.ExtensionContext) {
  // Initialize service
  qdrantService = new QdrantService();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('qdrant.connect', async () => {
      const config = {
        host: vscode.workspace.getConfiguration('qdrant').get('host'),
        port: vscode.workspace.getConfiguration('qdrant').get('port'),
        apiKey: vscode.workspace.getConfiguration('qdrant').get('apiKey')
      };

      try {
        await qdrantService.connect(config);
        vscode.window.showInformationMessage('Connected to Qdrant');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to connect: ${error.message}`);
      }
    })
  );
}
```

## Error Handling

### Common Error Patterns

```typescript
try {
  await qdrantService.search(searchRequest);
} catch (error) {
  if (error instanceof QdrantConnectionError) {
    // Handle connection issues
    vscode.window.showErrorMessage('Not connected to Qdrant');
  } else if (error instanceof QdrantSearchError) {
    // Handle search failures
    vscode.window.showErrorMessage('Search failed');
  } else if (error instanceof QdrantConfigError) {
    // Handle configuration issues
    vscode.window.showErrorMessage(`Configuration error: ${error.field}`);
  }
}
```

### Validation Errors

```typescript
import { validateCollectionName, validateVector } from './validation';

// Validate inputs
if (!validateCollectionName(collectionName)) {
  throw new QdrantConfigError('Invalid collection name');
}

if (!validateVector(vector)) {
  throw new QdrantConfigError('Invalid vector format');
}
```

## Testing

### Unit Tests

```typescript
import { QdrantService } from '../services/qdrant-service';
import { mockQdrantClient } from './mocks/qdrant-client';

describe('QdrantService', () => {
  let service: QdrantService;

  beforeEach(() => {
    service = new QdrantService();
    // Mock the Qdrant client
    service['_client'] = mockQdrantClient;
  });

  it('should connect successfully', async () => {
    const config = { host: 'localhost', port: 6333 };
    await expect(service.connect(config)).resolves.toBeUndefined();
  });
});
```

### Integration Tests

```typescript
describe('Qdrant Integration', () => {
  let service: QdrantService;

  beforeAll(async () => {
    service = new QdrantService();
    await service.connect({ host: 'localhost', port: 6333 });
  });

  it('should create and search collection', async () => {
    // Create collection
    await service.createCollection({
      name: 'test-collection',
      vectors: { size: 1536, distance: 'Cosine' }
    });

    // Add test data
    await service.upsert('test-collection', [
      { id: '1', vector: new Array(1536).fill(0.1) }
    ]);

    // Search
    const results = await service.search({
      collectionName: 'test-collection',
      vector: new Array(1536).fill(0.1),
      limit: 5
    });

    expect(results).toHaveLength(1);
  });
});
```

## Development Workflow

### 1. Start Local Qdrant

```bash
# Using Docker
docker run -p 6333:6333 qdrant/qdrant

# Or using the Qdrant binary
./qdrant
```

### 2. Run Tests

```bash
npm run test
```

### 3. Development Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## Troubleshooting

### Connection Issues

- Verify Qdrant is running on the correct host/port
- Check firewall settings
- Ensure API key is correct (if required)

### Search Issues

- Verify collection exists
- Check vector dimensions (must be 1536)
- Validate search parameters

### Performance Issues

- Monitor concurrent operations (max 10 searches, 5 upserts)
- Check collection size limits (max 1M vectors)
- Review timeout settings

## Next Steps

1. Implement UI components for collection management
2. Add embedding generation using OpenAI API
3. Create VS Code commands for common operations
4. Add telemetry and error reporting
5. Implement data import/export functionality
