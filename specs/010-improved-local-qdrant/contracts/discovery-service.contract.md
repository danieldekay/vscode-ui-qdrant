# Auto-Discovery Service Contract

**Service**: `DiscoveryService.discoverDatabases(config: AutoDiscoveryConfig): Promise<DatabaseDiscoveryResult>`

**Purpose**: Scan workspace directories for potential Qdrant database files with progress reporting and cancellation support

**Input**:
- `config: AutoDiscoveryConfig` - Discovery configuration including timeout, depth, and file patterns

**Output**:
- `Promise<DatabaseDiscoveryResult>` - Discovery results with grouped files and validation outcomes

**Behavior**:
1. Initialize progress reporting if enabled in config
2. Scan workspace folders up to maxDirectoryDepth
3. Filter files by includedFileExtensions and excludedDirectories
4. Optionally validate discovered files during scanning
5. Group results by directory if groupByDirectory is true
6. Handle timeout and cancellation gracefully
7. Return comprehensive discovery result

**Success Response**:
```typescript
{
  discoveredFiles: DatabaseFile[],
  scanDuration: 1250,
  scannedDirectories: ["/workspace/src", "/workspace/data"],
  groupedByDirectory: Map({
    "/workspace/data": [file1, file2],
    "/workspace/src/db": [file3]
  }),
  totalFilesFound: 3,
  validationResults: Map({...}),
  scanErrors: [],
  wasTimedOut: false,
  isCancelled: false
}
```

**Error Response**:
```typescript
{
  discoveredFiles: [],
  scanDuration: 3000,
  scannedDirectories: ["/workspace"],
  groupedByDirectory: Map(),
  totalFilesFound: 0,
  validationResults: Map(),
  scanErrors: [
    { code: "SCAN_TIMEOUT", message: "Discovery timed out", directory: "/workspace/large_dir" }
  ],
  wasTimedOut: true,
  isCancelled: false
}
```

**Performance Requirements**:
- Must complete within config.scanTimeout (default 3 seconds)
- Should not block VS Code UI thread
- Must respect cancellation tokens
- Progress reporting interval <= 100ms

**Integration Points**:
- VS Code workspace.fs API for file system access
- VS Code progress API for user feedback
- CancellationToken for operation cancellation
- FileService for optional validation during discovery