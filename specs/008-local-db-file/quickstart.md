# Local DB File Selection - Quickstart

## Prerequisites

1. **Qdrant Database File**: Have a local Qdrant database file (.db or .sqlite) in your workspace
2. **VS Code Extension**: Ensure the vscode-ui-qdrant extension is installed and activated
3. **File Permissions**: Ensure the database file is readable by your user account

## Quick Test Workflow

### 1. Open Command Palette
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Qdrant" to see available commands

### 2. Select Local Database File
- Run command: `Qdrant: Select Local Database File`
- File picker dialog opens with Qdrant file filters
- Navigate to and select your Qdrant database file
- Click "Open" to confirm selection

### 3. Verify Configuration
- Check VS Code settings for `qdrant.localDbPath`
- Extension status bar should show connection status
- Tree view should display database contents if connected

## Expected Results

**Success Indicators**:
- ✅ Notification: "Successfully connected to local Qdrant database"
- ✅ Status bar shows: "Qdrant: Connected"
- ✅ Tree view populates with collections/vectors
- ✅ Workspace settings updated with file path

**Error Scenarios**:
- ❌ Invalid file: "Selected file is not a valid Qdrant database"
- ❌ No permissions: "Cannot access selected file"
- ❌ Connection failed: "Failed to connect to Qdrant database"

## Troubleshooting

### File Not Found
- Ensure the file exists at the selected path
- Check file permissions with `ls -la <file>`
- Try selecting the file again

### Connection Failed
- Verify Qdrant is not already running on the default port
- Check if another process has locked the file
- Try restarting VS Code

### Extension Not Activated
- Check VS Code extension status in the Extensions panel
- Look for errors in the developer console (Help → Toggle Developer Tools)
- Try reloading the window (Ctrl+Shift+P → "Developer: Reload Window")

## Validation Checklist

- [ ] Command appears in command palette
- [ ] File picker opens with correct filters
- [ ] File selection updates configuration
- [ ] Connection status updates appropriately
- [ ] Error messages are clear and actionable