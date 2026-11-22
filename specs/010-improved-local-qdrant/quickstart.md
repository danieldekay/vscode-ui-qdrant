# Improved Local Qdrant Database Configuration - Quickstart

## Prerequisites

- VS Code with Qdrant extension installed
- Workspace containing Qdrant database files (or potential database locations)
- Node.js 20.x+ for development/testing

## Quick Test Scenarios

### Scenario 1: Auto-Discovery Success
**Objective**: Verify auto-discovery finds and presents database files correctly

**Setup**:
1. Create test workspace with sample Qdrant database files:
   ```
   test-workspace/
   ├── data/
   │   ├── qdrant_db/     # Valid Qdrant database
   │   └── backup.db      # Another potential database
   └── src/
       └── config/
           └── local.db   # Third potential database
   ```

**Steps**:
1. Open test workspace in VS Code
2. Execute command: `Qdrant: Select Local Database File`
3. Click "Auto-discover databases" in the dialog
4. Verify progress indicator appears
5. Verify discovery completes within 3 seconds
6. Verify files are grouped by directory:
   - `/data` (2 files)
   - `/src/config` (1 file)

**Expected Results**:
- ✅ Discovery dialog opens immediately
- ✅ Progress indicator shows during scanning
- ✅ Results grouped by directory with file counts
- ✅ All valid database files discovered
- ✅ Each file shows validation status indicator

### Scenario 2: Enhanced Error Messages
**Objective**: Verify layered error messaging works correctly

**Setup**:
1. Create test file with permission issues:
   ```bash
   touch /tmp/test_db.db
   chmod 000 /tmp/test_db.db  # Remove all permissions
   ```

**Steps**:
1. Execute command: `Qdrant: Select Local Database File`
2. Click "Browse manually"
3. Select the permission-denied file
4. Verify enhanced error dialog appears

**Expected Results**:
- ✅ Simple message: "This file cannot be accessed. You may not have permission to read it."
- ✅ "Show technical details" button available
- ✅ Quick actions present: "Fix Permissions", "Open Folder"
- ✅ Technical details hidden by default
- ✅ Clicking "Show technical details" reveals: "EACCES: permission denied..."

### Scenario 3: Quick Action Remediation
**Objective**: Verify quick action buttons work correctly

**Setup**:
1. Use the permission-denied file from Scenario 2

**Steps**:
1. Trigger validation error as in Scenario 2
2. Click "Fix Permissions" quick action
3. Verify appropriate system action occurs
4. Click "Open Folder" quick action
5. Verify folder opens in system file explorer

**Expected Results**:
- ✅ "Fix Permissions" action prompts for confirmation
- ✅ "Open Folder" action opens containing directory
- ✅ Actions execute within expected timeframes
- ✅ Error dialog updates after remediation attempts

### Scenario 4: Multiple Database Handling
**Objective**: Verify directory grouping and selection workflow

**Setup**:
1. Create workspace with multiple potential databases:
   ```
   workspace/
   ├── project-a/
   │   ├── qdrant/
   │   └── data.db
   ├── project-b/
   │   └── vectors.db
   └── shared/
       ├── main.db
       └── backup.db
   ```

**Steps**:
1. Execute auto-discovery command
2. Verify grouping by directory
3. Select file from different directories
4. Verify configuration updates correctly

**Expected Results**:
- ✅ Files grouped as: project-a (2), project-b (1), shared (2)
- ✅ Directory expansion shows individual files
- ✅ File selection updates workspace configuration
- ✅ Most recent selection remembered for future use

### Scenario 5: Performance and Cancellation
**Objective**: Verify performance requirements and cancellation support

**Setup**:
1. Create workspace with large directory structure:
   ```bash
   # Create deep directory structure for testing
   mkdir -p large-workspace/{dir1..dir100}/subdir
   touch large-workspace/dir*/subdir/test.db
   ```

**Steps**:
1. Execute auto-discovery on large workspace
2. Verify progress reporting appears
3. If operation approaches 3-second limit, verify timeout handling
4. Test cancellation by clicking cancel during discovery

**Expected Results**:
- ✅ Progress indicator shows during long operations
- ✅ Discovery completes or times out within 3 seconds
- ✅ Timeout results in partial results with clear messaging
- ✅ Cancellation immediately stops operation
- ✅ UI remains responsive throughout

## Validation Checklist

### Auto-Discovery Functionality
- [ ] Scans only workspace folders and immediate subdirectories
- [ ] Respects 3-second timeout limit
- [ ] Groups discovered files by directory
- [ ] Shows file count per directory
- [ ] Provides progress feedback
- [ ] Supports user cancellation
- [ ] Handles permission errors gracefully

### Enhanced Error Messages
- [ ] Shows simple, user-friendly messages by default
- [ ] Provides "Show technical details" option
- [ ] Technical details are informative for debugging
- [ ] Error messages suggest specific remediation steps
- [ ] Supports multiple error categories (not found, access denied, invalid format, etc.)

### Quick Action Buttons
- [ ] Context-appropriate actions for each error type
- [ ] File system actions (fix permissions, open folder)
- [ ] VS Code actions (open settings, retry)
- [ ] Qdrant service actions where applicable
- [ ] Actions execute within expected timeframes
- [ ] Confirmation dialogs for destructive actions

### Performance Requirements
- [ ] Command dialog opens within 100ms
- [ ] Auto-discovery completes within 3 seconds or shows progress
- [ ] Enhanced validation adds <50ms overhead
- [ ] UI remains responsive during all operations
- [ ] Memory usage remains reasonable for large workspaces

### Integration Requirements
- [ ] Workspace configuration updates correctly
- [ ] Previous selections remembered appropriately
- [ ] Compatible with existing Qdrant extension features
- [ ] Error handling integrates with existing patterns
- [ ] UI follows VS Code design guidelines

## Troubleshooting

### Discovery Returns No Results
- Verify workspace contains potential database files
- Check file extensions match expected patterns (.db, no extension)
- Ensure files are in workspace folders, not external directories
- Look for permission issues preventing directory access

### Validation Errors Not Enhanced
- Verify enhanced validation service is properly integrated
- Check that error categorization logic is working
- Ensure quick action generation is functioning
- Verify VS Code command integration for actions

### Performance Issues
- Monitor discovery timeout behavior in large workspaces
- Check progress reporting frequency
- Verify cancellation token handling
- Profile validation overhead for enhanced features

### UI Problems
- Test keyboard navigation and accessibility
- Verify error dialog layout and readability
- Check quick action button functionality
- Ensure proper error state cleanup

## Development Notes

- Use VS Code Test Runner for integration scenarios
- Mock large directory structures for performance testing
- Test with various file permission configurations
- Verify cross-platform compatibility (Windows, macOS, Linux)
- Include accessibility testing in validation process