# Improved Local Qdrant Database Configuration - Data Model

## DatabaseDiscoveryResult Entity

**Purpose**: Represents the outcome of auto-discovery scanning for Qdrant databases

**Fields**:
- `discoveredFiles: DatabaseFile[]` - List of discovered database files
- `scanDuration: number` - Time taken for discovery in milliseconds
- `scannedDirectories: string[]` - List of directories that were scanned
- `groupedByDirectory: Map<string, DatabaseFile[]>` - Files grouped by containing directory
- `totalFilesFound: number` - Count of potential database files discovered
- `validationResults: Map<string, FileValidationResult>` - Validation results for each discovered file
- `scanErrors: DiscoveryError[]` - Any errors encountered during scanning
- `wasTimedOut: boolean` - Whether scan was terminated due to timeout
- `isCancelled: boolean` - Whether scan was cancelled by user

**Relationships**:
- Contains multiple: DatabaseFile (discovered files)
- Contains multiple: FileValidationResult (validation outcomes)
- References: AutoDiscoveryConfig (scan configuration used)

**Validation Rules**:
- discoveredFiles array must not be null
- scanDuration must be non-negative
- groupedByDirectory must have consistent file counts with discoveredFiles
- If wasTimedOut is true, scanDuration should be approximately the timeout limit

**State Transitions**:
- `scanning` → `completed` (successful discovery)
- `scanning` → `timedOut` (exceeded time limit)
- `scanning` → `cancelled` (user cancellation)
- `scanning` → `error` (discovery failure)

## EnhancedValidationResult Entity

**Purpose**: Extended validation result with detailed error explanations and remediation suggestions

**Fields**:
- `basicResult: FileValidationResult` - Core validation outcome
- `simpleMessage: string` - User-friendly error explanation
- `technicalDetails?: string` - Optional technical error information
- `remedationSuggestions: ValidationSuggestion[]` - List of suggested fixes
- `quickActions: QuickAction[]` - Available quick action buttons
- `validationLevel: ValidationLevel` - Depth of validation performed
- `performanceMetrics: ValidationMetrics` - Timing and resource usage data

**Relationships**:
- Extends: FileValidationResult (existing validation structure)
- Contains multiple: ValidationSuggestion (remediation options)
- Contains multiple: QuickAction (UI action buttons)

**Validation Rules**:
- simpleMessage must be non-empty for failed validations
- technicalDetails should only be present when available
- quickActions must be relevant to the specific validation failure
- validationLevel must match the actual checks performed

## ValidationSuggestion Entity

**Purpose**: Specific recommendation for fixing a validation issue

**Fields**:
- `suggestionId: string` - Unique identifier for the suggestion
- `title: string` - Brief description of the suggested fix
- `description: string` - Detailed explanation of the remediation
- `actionType: SuggestionActionType` - Category of suggested action
- `priority: SuggestionPriority` - Importance level of this suggestion
- `estimatedEffort: EffortLevel` - Expected complexity to implement
- `prerequisites: string[]` - Required conditions before applying suggestion
- `relatedActions: string[]` - IDs of quick actions that implement this suggestion

**Relationships**:
- Belongs to: EnhancedValidationResult (validation that generated suggestion)
- References: QuickAction (implementable actions)

**Validation Rules**:
- suggestionId must be unique within validation result
- title and description must be non-empty
- actionType must be a valid SuggestionActionType
- prerequisites must be actionable by the user

## QuickAction Entity

**Purpose**: Actionable button for immediate error remediation

**Fields**:
- `actionId: string` - Unique identifier for the action
- `label: string` - Button text displayed to user
- `description: string` - Tooltip or expanded description
- `actionCategory: ActionCategory` - Type of action (file, VS Code, Qdrant)
- `vsCodeCommand?: string` - VS Code command to execute
- `commandArgs?: unknown[]` - Arguments for the VS Code command
- `requiresConfirmation: boolean` - Whether action needs user confirmation
- `isDestructive: boolean` - Whether action modifies files or settings
- `estimatedDuration: number` - Expected execution time in milliseconds

**Relationships**:
- Belongs to: EnhancedValidationResult (validation that offers this action)
- Implements: ValidationSuggestion (suggestions this action addresses)

**Validation Rules**:
- actionId must be unique within validation result
- label must be appropriate for button display
- If vsCodeCommand is provided, it must be a valid command ID
- Destructive actions should require confirmation

## AutoDiscoveryConfig Entity

**Purpose**: Configuration for auto-discovery behavior and scanning parameters

**Fields**:
- `scanTimeout: number` - Maximum time allowed for discovery in milliseconds
- `maxDirectoryDepth: number` - Maximum subdirectory levels to scan
- `includedFileExtensions: string[]` - File extensions to consider as potential databases
- `excludedDirectories: string[]` - Directory names to skip during scanning
- `enableProgressReporting: boolean` - Whether to show progress to user
- `allowCancellation: boolean` - Whether user can cancel discovery
- `validateDiscoveredFiles: boolean` - Whether to validate files during discovery
- `groupByDirectory: boolean` - Whether to group results by containing directory

**Relationships**:
- Used by: DatabaseDiscoveryResult (configuration applied during scan)
- Configures: DiscoveryService (scanning behavior)

**Validation Rules**:
- scanTimeout must be positive and reasonable (<= 30 seconds)
- maxDirectoryDepth must be positive and reasonable (<= 10)
- includedFileExtensions should include common Qdrant database extensions
- excludedDirectories should include common non-database directories

## Supporting Enums

### ValidationLevel
- `BASIC` - File existence and permissions only
- `STRUCTURAL` - Header and basic structure validation
- `COMPREHENSIVE` - Full integrity checking (not used in this feature)

### SuggestionActionType
- `FILE_SYSTEM` - File or directory operations
- `PERMISSIONS` - Access rights modifications
- `QDRANT_SERVICE` - Qdrant-specific operations
- `VS_CODE_SETTINGS` - Configuration changes
- `USER_GUIDANCE` - Informational suggestions

### SuggestionPriority
- `CRITICAL` - Must fix to proceed
- `IMPORTANT` - Strongly recommended
- `OPTIONAL` - Nice to have improvement

### EffortLevel
- `IMMEDIATE` - One-click fix
- `SIMPLE` - Basic user action required
- `MODERATE` - Multiple steps needed
- `COMPLEX` - Advanced user knowledge required

### ActionCategory
- `FILE_OPERATIONS` - File system actions (permissions, open folder)
- `QDRANT_OPERATIONS` - Qdrant service actions (restart, connect)
- `VS_CODE_OPERATIONS` - VS Code actions (settings, commands)
- `GUIDANCE_OPERATIONS` - Informational actions (show help, documentation)

## Relationships Summary

```
AutoDiscoveryConfig
    ↓ configures
DiscoveryService
    ↓ produces
DatabaseDiscoveryResult
    ↓ contains
DatabaseFile[] + FileValidationResult[]
    ↓ enhances to
EnhancedValidationResult
    ↓ contains
ValidationSuggestion[] + QuickAction[]
```

## State Flow

```
User triggers discovery
    ↓
AutoDiscoveryConfig applied
    ↓
DiscoveryService scans workspace
    ↓
DatabaseDiscoveryResult generated
    ↓
Files validated with enhancement
    ↓
EnhancedValidationResult created
    ↓
UI presents grouped results with actions
```