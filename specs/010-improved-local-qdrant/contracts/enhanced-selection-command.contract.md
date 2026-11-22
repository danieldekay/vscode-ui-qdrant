# Database Selection Command Contract

**Command**: `qdrant.selectLocalDbFileEnhanced`

**Purpose**: Enhanced database file selection with auto-discovery and improved error handling

**Input**:
- Trigger: VS Code command palette, UI element, or programmatic call
- Context: VS Code workspace with Qdrant extension active

**Output**:
- Success: Selected file path stored in workspace configuration
- Error: Enhanced error notification with remediation options

**Behavior**:
1. Show enhanced file selection dialog with auto-discovery option
2. If auto-discovery requested, scan workspace using DiscoveryService
3. Present discovered files grouped by directory
4. Allow manual file selection if auto-discovery insufficient
5. Perform enhanced validation on selected file
6. Display layered error messages if validation fails
7. Provide quick action buttons for error remediation
8. Update workspace configuration on successful validation
9. Trigger connection attempt if validation passes

**Success Flow**:
```
User → Command → Discovery Dialog → [Auto-discovery] → Grouped Results →
File Selection → Enhanced Validation → Success Message → Configuration Update →
Connection Attempt
```

**Error Flow**:
```
User → Command → Discovery Dialog → File Selection → Enhanced Validation →
Validation Failure → Enhanced Error Display → Quick Actions →
[User Action] → Retry or Cancel
```

**UI Components**:

1. **Discovery Dialog**:
   - "Auto-discover databases" button
   - "Browse manually" button
   - Progress indicator during discovery
   - Cancel button for long operations

2. **Discovery Results View**:
   - Directory groups with file counts
   - File list with validation status indicators
   - "Refresh discovery" button
   - "Browse for other file" option

3. **Enhanced Error Dialog**:
   - Simple error message (primary)
   - "Show technical details" expandable section
   - Quick action buttons (context-specific)
   - "Try again" and "Cancel" options

**Quick Action Examples**:

| Error Scenario | Quick Actions Available |
|----------------|------------------------|
| Permission denied | Fix Permissions, Open Folder, Try as Admin |
| File not found | Retry, Browse, Remove from Recent |
| Invalid format | Show Details, Try Anyway, Browse for Correct File |
| Discovery timeout | Retry with Longer Timeout, Browse Manually |
| Multiple databases | Show All, Use Most Recent, Let Me Choose |

**Configuration Integration**:
- Updates `qdrant.localDbPath` workspace setting
- Preserves previous successful paths in `qdrant.recentDbPaths`
- Respects user discovery preferences in `qdrant.autoDiscovery`

**Error Handling**:
- Graceful degradation if auto-discovery fails
- Fallback to manual browsing in all error scenarios
- Preservation of user selections across retry attempts
- Clear error state management and cleanup

**Performance Requirements**:
- Dialog should appear within 100ms of command execution
- Auto-discovery should complete within 3 seconds or show progress
- UI should remain responsive during all operations
- Error remediation should provide immediate feedback

**Accessibility**:
- Full keyboard navigation support
- Screen reader compatible error messages
- High contrast support for all UI elements
- Focus management during dialog transitions

**Integration Points**:
- VS Code command API for registration and execution
- VS Code file dialog API for manual browsing
- VS Code configuration API for settings management
- DiscoveryService for auto-discovery functionality
- Enhanced validation service for file checking
- VS Code notification API for user feedback