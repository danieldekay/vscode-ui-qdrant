# File Validation Service Contract

**Service**: `FileService.validateQdrantFile(path: vscode.Uri): Promise<FileValidationResult>`

**Purpose**: Validate that a file path points to a valid, accessible Qdrant database file

**Input**:
- `path: vscode.Uri` - Absolute path to file to validate

**Output**:
- `Promise<FileValidationResult>` - Validation result with success/failure details

**Validation Steps**:
1. **Existence Check**: Verify file exists at path
2. **Access Check**: Verify file is readable by current user
3. **Format Check**: Verify file appears to be Qdrant database (future implementation)
4. **Permission Check**: Verify file is not locked by another process

**Success Response**:
```typescript
{
  filePath: vscode.Uri,
  isValid: true,
  errors: [],
  warnings: [], // e.g., "File is very large", "Modified recently"
  validatedAt: Date
}
```

**Error Response**:
```typescript
{
  filePath: vscode.Uri,
  isValid: false,
  errors: [
    { code: "FILE_NOT_FOUND", message: "File does not exist" },
    { code: "ACCESS_DENIED", message: "Cannot read file" },
    { code: "INVALID_FORMAT", message: "Not a valid Qdrant database" }
  ],
  warnings: [],
  validatedAt: Date
}
```

**Performance Requirements**:
- Validation should complete within 100ms for local files
- Should not block UI thread
- Should cache results for recently validated files

**Integration Points**:
- VS Code workspace.fs API for file operations
- Node.js fs module for additional checks
- Qdrant client for format validation (future)