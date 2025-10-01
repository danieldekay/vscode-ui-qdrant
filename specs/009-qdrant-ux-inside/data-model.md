# Data Model: Qdrant UX Inside VSCode

**Feature**: Qdrant UX Inside VSCode
**Date**: 2025-10-01

## Overview

The Qdrant UX feature manages search operations within a VS Code webview interface. The data model focuses on search queries, parameters, results, and configuration entities that support the search workflow.

## Core Entities

### SearchQuery
Represents a user's search input with optional filtering criteria.

**Fields**:
- `text: string` - The search query text (required)
- `filters: SearchFilter[]` - Optional metadata filters to narrow results
- `timestamp: Date` - When the query was created

**Validation Rules**:
- `text` must not be empty or whitespace-only
- `filters` array can be empty but must contain valid filter objects if present

**Relationships**:
- 1:1 with SearchParameters (combined in search request)
- 1:N with SearchResults (one query can produce multiple result sets)

### SearchParameters
Configuration settings that control search behavior and result filtering.

**Fields**:
- `similarityThreshold: number` - Minimum similarity score (0.0 to 1.0, default: 0.7)
- `resultLimit: number` - Maximum number of results to return (1-1000, default: 50)
- `searchFilters: SearchFilter[]` - Additional filtering criteria
- `includePayload: boolean` - Whether to include full payload data (default: true)
- `includeVector: boolean` - Whether to include vector data (default: false)

**Validation Rules**:
- `similarityThreshold` must be between 0.0 and 1.0
- `resultLimit` must be between 1 and 1000
- `searchFilters` must contain valid filter objects

**Relationships**:
- 1:1 with SearchQuery (combined in search request)
- Influences SearchResults structure and content

### SearchResults
Collection of vectors returned from a Qdrant search operation.

**Fields**:
- `queryId: string` - Unique identifier for the search query
- `results: SearchResultItem[]` - Array of individual result items
- `totalFound: number` - Total number of matches found (may exceed returned results)
- `searchTime: number` - Time taken for search in milliseconds
- `hasMore: boolean` - Whether more results are available beyond the limit

**Validation Rules**:
- `results` array can be empty but must be defined
- `totalFound` must be >= results.length
- `searchTime` must be >= 0

**Relationships**:
- N:1 with SearchQuery (multiple results can come from one query)
- Contains SearchResultItem entities

### SearchResultItem
Individual search result containing vector data and metadata.

**Fields**:
- `id: string` - Unique identifier of the vector in Qdrant
- `score: number` - Similarity score (0.0 to 1.0)
- `payload: object` - Associated metadata/payload data
- `vector?: number[]` - Vector data (optional, only included if requested)

**Validation Rules**:
- `id` must be a valid string identifier
- `score` must be between 0.0 and 1.0
- `payload` can be any object structure

**Relationships**:
- Belongs to SearchResults collection

### SearchFilter
Criteria for filtering search results based on metadata.

**Fields**:
- `field: string` - The metadata field to filter on
- `operator: FilterOperator` - Comparison operator (EQ, NE, GT, LT, IN, etc.)
- `value: any` - The value to compare against

**Validation Rules**:
- `field` must be a non-empty string
- `operator` must be a valid FilterOperator enum value
- `value` must be compatible with the operator type

**Relationships**:
- Used in SearchQuery.filters and SearchParameters.searchFilters

### QdrantConfiguration
Connection and default settings for Qdrant database access.

**Fields**:
- `host: string` - Qdrant server hostname/IP
- `port: number` - Qdrant server port (default: 6333)
- `apiKey?: string` - Optional API key for authentication
- `collection: string` - Default collection name to search
- `timeout: number` - Request timeout in milliseconds (default: 30000)

**Validation Rules**:
- `host` must be a valid hostname or IP address
- `port` must be between 1 and 65535
- `collection` must be a non-empty string
- `timeout` must be > 0

**Relationships**:
- Referenced by search operations for connection details

## Data Flow

1. **Search Initiation**: User creates SearchQuery + SearchParameters
2. **API Request**: Combined into Qdrant search request using QdrantConfiguration
3. **API Response**: Raw Qdrant results transformed into SearchResults
4. **UI Display**: SearchResults rendered as table with SearchResultItem details

## State Management

**Search Session State**:
- Current query and parameters
- Result pagination state
- Loading/error states
- Connection status

**Persistence**:
- Search history (optional, for future enhancement)
- User preferences for default parameters
- Qdrant connection configuration (via VS Code settings)

## Validation Constraints

**Cross-Entity Rules**:
- SearchParameters.resultLimit cannot exceed system maximum (1000)
- SearchQuery.filters must be compatible with Qdrant payload structure
- SearchResults must maintain score ordering (highest first)

**Business Rules**:
- Empty search queries return no results
- Invalid parameters show validation errors without API calls
- Connection failures preserve query state for retry

## Error Handling

**Validation Errors**:
- Invalid parameter ranges
- Malformed filter criteria
- Missing required fields

**Runtime Errors**:
- Connection failures (network, authentication, server errors)
- Timeout conditions
- Invalid response formats

**Recovery Strategies**:
- Retry connection with exponential backoff
- Fallback to cached/offline state where possible
- Clear error messages with suggested fixes