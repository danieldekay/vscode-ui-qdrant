# Local DB File Selection - Data Model

## DatabaseFile Entity

**Purpose**: Represents a Qdrant database file selected by the user

**Fields**:
- `path: vscode.Uri` - Absolute file path as VS Code URI
- `relativePath?: string` - Workspace-relative path if applicable
- `validationStatus: ValidationStatus` - Current validation state
- `lastValidated: Date` - Timestamp of last validation check
- `metadata?: FileMetadata` - Optional file information

**Relationships**:
- Belongs to: QdrantConfig (one config can have one active file)
- Referenced by: FileValidationResult (validation results for this file)

**Validation Rules**:
- Path must be absolute and resolvable
- File must exist and be readable
- File should be a valid Qdrant database format (future validation)
- Path should be within user-accessible directories

**State Transitions**:
- `unvalidated` → `validating` (on selection)
- `validating` → `valid` (validation passes)
- `validating` → `invalid` (validation fails)
- `valid` → `unvalidated` (file becomes inaccessible)

## FileValidationResult Entity

**Purpose**: Result of validating a database file for Qdrant compatibility

**Fields**:
- `filePath: vscode.Uri` - Path of the validated file
- `isValid: boolean` - Whether validation passed
- `errors: ValidationError[]` - List of validation errors
- `warnings: ValidationWarning[]` - List of non-blocking warnings
- `validatedAt: Date` - When validation was performed

**Relationships**:
- References: DatabaseFile (result for this file)

**Validation Rules**:
- Must have associated file path
- Errors array can be empty if valid
- Warnings are informational only

## QdrantConfig Entity

**Purpose**: Configuration for Qdrant connection, including local database path

**Fields**:
- `localDbPath?: vscode.Uri` - Path to local Qdrant database file
- `connectionStatus: ConnectionStatus` - Current connection state
- `lastConnected?: Date` - When last successfully connected
- `autoReconnect: boolean` - Whether to attempt reconnection on file changes

**Relationships**:
- Has one: DatabaseFile (currently selected file)

**Validation Rules**:
- If localDbPath set, must be valid DatabaseFile
- Connection status must reflect actual connectivity

**State Transitions**:
- `disconnected` → `connecting` (on config update)
- `connecting` → `connected` (successful connection)
- `connecting` → `disconnected` (connection failure)
- `connected` → `disconnected` (file becomes invalid)

## Supporting Types

```typescript
enum ValidationStatus {
  UNVALIDATED = 'unvalidated',
  VALIDATING = 'validating',
  VALID = 'valid',
  INVALID = 'invalid'
}

enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
}

interface FileMetadata {
  size: number;
  modified: Date;
  permissions: string;
}
```