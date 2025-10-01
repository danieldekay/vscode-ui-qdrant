# File Selection Command Contract

**Command**: `qdrant.selectLocalDbFile`

**Purpose**: Allow user to select a local Qdrant database file through VS Code's file picker

**Input**:
- Trigger: VS Code command palette or UI element
- Context: VS Code workspace with Qdrant extension active

**Output**:
- Success: Selected file path stored in workspace configuration
- Error: User notification with error details

**Behavior**:
1. Open VS Code file picker dialog with Qdrant file filters
2. Validate selected file for Qdrant compatibility
3. Update workspace configuration with selected path
4. Show success/error notification to user
5. Trigger Qdrant connection attempt if validation passes

**Error Cases**:
- User cancels dialog: No action taken
- Invalid file selected: Show validation errors, allow retry
- File access denied: Show permission error with remediation steps
- Configuration update fails: Show error, suggest manual config

**Integration Points**:
- VS Code `window.showOpenDialog()` API
- Workspace configuration API
- File validation service
- Qdrant connection service