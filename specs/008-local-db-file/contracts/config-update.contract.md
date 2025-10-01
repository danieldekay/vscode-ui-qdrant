# Qdrant Configuration Service Contract

**Service**: `QdrantService.updateLocalDbPath(path: vscode.Uri): Promise<ConfigUpdateResult>`

**Purpose**: Update the Qdrant extension configuration to use a new local database file path

**Input**:
- `path: vscode.Uri` - Validated path to Qdrant database file

**Output**:
- `Promise<ConfigUpdateResult>` - Result of configuration update

**Update Process**:
1. **Validation**: Ensure path points to valid Qdrant file
2. **Current Connection**: Gracefully disconnect existing connection if active
3. **Configuration Update**: Store new path in VS Code workspace settings
4. **New Connection**: Attempt to connect to database at new path
5. **Status Update**: Update extension status indicators

**Success Response**:
```typescript
{
  success: true,
  previousPath?: vscode.Uri,
  newPath: vscode.Uri,
  connectionStatus: "connected",
  message: "Successfully connected to local Qdrant database"
}
```

**Error Response**:
```typescript
{
  success: false,
  attemptedPath: vscode.Uri,
  connectionStatus: "error",
  error: {
    code: "CONNECTION_FAILED",
    message: "Failed to connect to Qdrant database",
    details: "Database file may be corrupted or in use"
  }
}
```

**Atomicity Requirements**:
- If connection to new path fails, configuration should not be updated
- Previous connection should remain active until new connection succeeds
- Configuration changes should be reversible

**Integration Points**:
- VS Code workspace configuration API
- Qdrant client connection management
- Extension status bar and tree view updates
- File validation service (pre-condition)

**Event Emissions**:
- `onConfigChanged`: Emitted when configuration successfully updates
- `onConnectionStatusChanged`: Emitted when connection status changes
- `onError`: Emitted for connection or configuration errors