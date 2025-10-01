# API Contract: Qdrant Search Interface

**Feature**: Qdrant UX Inside VSCode
**Date**: 2025-10-01
**Contract Type**: Internal Extension API

## Overview

This contract defines the interface between the VS Code extension UI components and the Qdrant search functionality. It covers the search command execution, webview management, and result display operations.

## API Endpoints

### 1. Execute Search Command

**Endpoint**: `qdrant.search`
**Method**: VS Code Command
**Description**: Opens the Qdrant search interface webview

**Request**:
```typescript
interface SearchCommandRequest {
  // No parameters - command opens the search interface
}
```

**Response**:
```typescript
interface SearchCommandResponse {
  success: boolean;
  webviewId?: string;
  error?: string;
}
```

**Error Conditions**:
- VS Code API unavailable
- Webview creation failure

### 2. Perform Search Operation

**Endpoint**: `qdrant.performSearch`
**Method**: Internal Service Call
**Description**: Executes a search against the Qdrant database

**Request**:
```typescript
interface SearchRequest {
  query: string;
  parameters: {
    similarityThreshold: number; // 0.0 - 1.0
    resultLimit: number; // 1 - 1000
    filters?: SearchFilter[];
    includePayload: boolean;
    includeVector: boolean;
  };
  collection: string;
}
```

**Response**:
```typescript
interface SearchResponse {
  success: boolean;
  results?: {
    queryId: string;
    items: SearchResultItem[];
    totalFound: number;
    searchTime: number;
    hasMore: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Error Conditions**:
- Connection failure
- Invalid parameters
- Collection not found
- Timeout

### 3. Update Search Parameters

**Endpoint**: `qdrant.updateSearchParameters`
**Method**: Webview Message
**Description**: Updates search parameters without re-executing the search

**Request**:
```typescript
interface UpdateParametersRequest {
  parameters: {
    similarityThreshold: number;
    resultLimit: number;
    filters?: SearchFilter[];
  };
}
```

**Response**:
```typescript
interface UpdateParametersResponse {
  success: boolean;
  validatedParameters: {
    similarityThreshold: number;
    resultLimit: number;
    filters?: SearchFilter[];
  };
  error?: string;
}
```

### 4. Get Connection Status

**Endpoint**: `qdrant.getConnectionStatus`
**Method**: Internal Service Call
**Description**: Checks the current Qdrant connection status

**Request**:
```typescript
interface ConnectionStatusRequest {
  // No parameters
}
```

**Response**:
```typescript
interface ConnectionStatusResponse {
  connected: boolean;
  collection?: string;
  error?: string;
}
```

## Data Types

### SearchFilter
```typescript
interface SearchFilter {
  field: string;
  operator: 'EQ' | 'NE' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'IN' | 'NIN';
  value: any;
}
```

### SearchResultItem
```typescript
interface SearchResultItem {
  id: string;
  score: number;
  payload: Record<string, any>;
  vector?: number[];
}
```

## Contract Tests

### Test Case 1: Successful Search
```
Given: Valid search query and connected Qdrant instance
When: performSearch is called with valid parameters
Then: Returns success: true with results array
And: Results contain valid SearchResultItem objects
And: Scores are between 0.0 and 1.0
```

### Test Case 2: Invalid Parameters
```
Given: Search request with invalid parameters
When: performSearch is called
Then: Returns success: false with validation error
And: Error contains specific validation details
```

### Test Case 3: Connection Failure
```
Given: Qdrant server is unreachable
When: performSearch is called
Then: Returns success: false with connection error
And: Error message indicates connection issue
```

### Test Case 4: Empty Results
```
Given: Valid query that matches no documents
When: performSearch is called
Then: Returns success: true with empty results array
And: totalFound is 0
```

### Test Case 5: Parameter Update
```
Given: Valid parameter update request
When: updateSearchParameters is called
Then: Returns success: true with validated parameters
And: Parameters are within valid ranges
```

## Performance Requirements

- Search operations should complete within reasonable time limits
- Parameter updates should be validated immediately (<100ms)
- Connection status checks should be fast (<50ms)
- Memory usage should be efficient for large result sets

## Error Handling

- All operations must handle and report errors appropriately
- Network failures should be retried with exponential backoff
- Invalid inputs should provide clear validation messages
- System errors should not crash the VS Code extension

## Version Compatibility

- API contracts must maintain backward compatibility
- Breaking changes require version negotiation
- Deprecation notices for obsolete endpoints