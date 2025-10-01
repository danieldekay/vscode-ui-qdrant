# Local DB File Selection - Research Findings

## VS Code File Picker API Patterns

**Decision**: Use `vscode.window.showOpenDialog()` with file filters for Qdrant database files

**Rationale**:
- Native VS Code API provides consistent UX across platforms
- Supports file type filtering (.db, .sqlite, etc.)
- Handles workspace-relative paths automatically
- Integrates with VS Code's file dialog theming

**Alternatives considered**:
- Custom webview file browser: Too complex, inconsistent UX
- Manual path input: Poor UX, error-prone
- Third-party file picker libraries: Unnecessary dependency

## Qdrant Local File Path Configuration

**Decision**: Store path in VS Code workspace configuration under `qdrant.localDbPath`

**Rationale**:
- VS Code configuration API provides persistence across sessions
- Workspace-scoped settings allow per-project configuration
- Automatic serialization/deserialization of paths
- Integrates with VS Code settings UI

**Alternatives considered**:
- Global extension settings: Not project-specific
- Environment variables: Less discoverable
- Custom config file: Redundant with VS Code settings

## File Validation Patterns for Qdrant Database Files

**Decision**: Multi-stage validation with user feedback

**Rationale**:
- File existence check: Basic validation before deeper checks
- Read permission check: Ensures file is accessible
- Qdrant format validation: Verify file structure (future-proof)
- Graceful error handling: Clear messages for each failure type

**Alternatives considered**:
- Single validation function: Less informative errors
- No validation: Risk of runtime failures
- External validation tools: Unnecessary dependencies

## Error Handling Patterns for VS Code File Operations

**Decision**: VS Code notification system with actionable error messages

**Rationale**:
- `vscode.window.showErrorMessage()` provides consistent error UX
- Support for action buttons (e.g., "Retry", "Open Settings")
- Error messages include remediation steps
- Integrates with VS Code's notification system

**Alternatives considered**:
- Console logging only: Not user-visible
- Modal dialogs: Blocks UI inappropriately
- Status bar only: Insufficient detail

## VS Code Workspace Configuration API for File Paths

**Decision**: Use `vscode.workspace.getConfiguration()` with URI conversion

**Rationale**:
- Automatic handling of workspace-relative vs absolute paths
- `vscode.Uri.file()` for proper path handling across platforms
- Configuration watchers for real-time updates
- Type-safe configuration access

**Alternatives considered**:
- Manual path resolution: Platform-specific bugs
- Raw string storage: No URI validation
- Custom path utilities: Reimplements VS Code functionality

## Best Practices for VS Code Extension File Operations

**Decision**: Async file operations with proper error boundaries

**Rationale**:
- VS Code extensions run in Node.js environment
- File operations are async by default
- Use `vscode.workspace.fs` for workspace-aware operations
- Proper error boundaries prevent extension crashes

**Alternatives considered**:
- Synchronous file operations: Blocks extension host
- Direct Node.js fs module: Bypasses VS Code abstractions
- No error handling: Unstable extension behavior