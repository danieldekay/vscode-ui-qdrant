# Enhanced Validation Service Contract

**Service**: `FileService.validateQdrantFileEnhanced(fileUri: vscode.Uri): Promise<EnhancedValidationResult>`

**Purpose**: Perform enhanced validation with layered error messaging and remediation suggestions

**Input**:
- `fileUri: vscode.Uri` - Absolute path to file for validation

**Output**:
- `Promise<EnhancedValidationResult>` - Enhanced validation result with detailed feedback

**Behavior**:
1. Perform standard FileService.validateQdrantFile validation
2. Generate simple, user-friendly error messages
3. Create technical details for advanced users
4. Suggest specific remediation actions
5. Generate context-appropriate quick action buttons
6. Include validation performance metrics

**Success Response**:
```typescript
{
  basicResult: {
    isValid: true,
    file: DatabaseFile,
    errors: [],
    warnings: [],
    metadata: ValidationMetadata
  },
  simpleMessage: "Database file is valid and ready to use",
  technicalDetails: undefined,
  remedationSuggestions: [],
  quickActions: [
    {
      actionId: "open-database",
      label: "Open Database",
      description: "Connect to this Qdrant database",
      actionCategory: "QDRANT_OPERATIONS",
      vsCodeCommand: "qdrant.connect",
      commandArgs: [fileUri],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 500
    }
  ],
  validationLevel: "STRUCTURAL",
  performanceMetrics: {
    validationDuration: 45,
    bytesRead: 512,
    checksPerformed: 5
  }
}
```

**Error Response**:
```typescript
{
  basicResult: {
    isValid: false,
    file: DatabaseFile,
    errors: [ValidationError],
    warnings: [],
    metadata: ValidationMetadata
  },
  simpleMessage: "This file cannot be accessed. You may not have permission to read it.",
  technicalDetails: "EACCES: permission denied, open '/path/to/file'",
  remedationSuggestions: [
    {
      suggestionId: "fix-permissions",
      title: "Fix File Permissions",
      description: "Grant read access to the database file",
      actionType: "FILE_SYSTEM",
      priority: "CRITICAL",
      estimatedEffort: "SIMPLE",
      prerequisites: ["File system access"],
      relatedActions: ["fix-permissions", "open-folder"]
    }
  ],
  quickActions: [
    {
      actionId: "fix-permissions",
      label: "Fix Permissions",
      description: "Attempt to fix file permissions",
      actionCategory: "FILE_OPERATIONS",
      vsCodeCommand: "vscode.openExternal",
      commandArgs: [fileUri],
      requiresConfirmation: true,
      isDestructive: false,
      estimatedDuration: 0
    },
    {
      actionId: "open-folder",
      label: "Open Folder",
      description: "Open containing folder in file explorer",
      actionCategory: "FILE_OPERATIONS",
      vsCodeCommand: "revealFileInOS",
      commandArgs: [fileUri],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 100
    }
  ],
  validationLevel: "BASIC",
  performanceMetrics: {
    validationDuration: 15,
    bytesRead: 0,
    checksPerformed: 2
  }
}
```

**Error Categories & Actions**:

| Error Type | Simple Message | Quick Actions |
|------------|----------------|---------------|
| FILE_NOT_FOUND | "File not found at this location" | Retry, Browse, Remove from list |
| ACCESS_DENIED | "Cannot access file (permission denied)" | Fix permissions, Open folder, Try as admin |
| INVALID_FORMAT | "This doesn't appear to be a Qdrant database" | Show details, Try anyway, Browse for correct file |
| CORRUPTED_DATABASE | "Database file appears corrupted" | Show details, Backup and repair, Browse for backup |

**Performance Requirements**:
- Enhanced validation should add <50ms overhead to basic validation
- Technical details generation should be lazy-loaded when requested
- Quick action validation should be immediate (<10ms)

**Integration Points**:
- Extends existing FileService.validateQdrantFile
- Uses VS Code command API for quick actions
- Integrates with VS Code theming for consistent UI
- Compatible with existing error handling patterns