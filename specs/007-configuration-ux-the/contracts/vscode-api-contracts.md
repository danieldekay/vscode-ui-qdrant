# VSCode API Contracts: Configuration UX Link

**Feature**: Configuration UX Link
**Date**: 2025-10-01
**Purpose**: Define VSCode API contracts for configuration access functionality

## Command Contracts

### qdrant.openConfig

Opens VSCode settings UI focused on Qdrant configuration section.

**Command Declaration**:
```typescript
{
  "command": "qdrant.openConfig",
  "title": "Qdrant: Open Configuration"
}
```

**Implementation Contract**:
```typescript
async function executeOpenConfig(): Promise<void> {
  try {
    await vscode.commands.executeCommand('workbench.action.openSettings', 'qdrant');
  } catch (error) {
    // Fallback: show error and open settings.json
    const message = 'Could not open settings UI. Opening settings file instead.';
    const action = await vscode.window.showErrorMessage(message, 'Open Settings File');

    if (action === 'Open Settings File') {
      const settingsUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file(''), '.vscode', 'settings.json');
      await vscode.commands.executeCommand('vscode.open', settingsUri);
    }

    throw error;
  }
}
```

**Response Contract**:
- **Success**: Opens settings UI with Qdrant section focused
- **Error**: Shows error message with fallback option to open settings file
- **Timeout**: 5000ms maximum execution time

## Tree Data Provider Contracts

### CollectionsTreeProvider.getChildren()

Returns tree items for collections view, including configuration link when appropriate.

**Method Signature**:
```typescript
getChildren(element?: TreeItem): ProviderResult<TreeItem[]>
```

**Request Contract**:
- `element`: undefined (root level) or ConfigurationLinkItem

**Response Contract**:
```typescript
interface TreeItemResponse {
  items: TreeItem[];
  conditions: {
    hasCollections: boolean;
    canAccessSettings: boolean;
    configLinkVisible: boolean;
  };
}
```

**Behavior Contracts**:
- **When collections exist**: Returns collection tree items only
- **When no collections**: Returns configuration link item + empty state message
- **When settings inaccessible**: Returns error state item with manual instructions

## Configuration Access Contracts

### vscode.workspace.getConfiguration()

Retrieves Qdrant configuration from workspace settings.

**Configuration Schema**:
```json
{
  "qdrant": {
    "connection": {
      "url": {
        "type": "string",
        "default": "file:///tmp/qdrant.db",
        "description": "Qdrant database URL or file path"
      }
    }
  }
}
```

**Validation Contract**:
```typescript
interface ConfigurationValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

## Settings Navigation Contracts

### workbench.action.openSettings

VSCode built-in command for opening settings UI.

**Parameters**:
- `query?: string` - Settings search query (e.g., "qdrant")

**Success Contract**:
- Settings UI opens with focus on matching settings
- Returns `Promise<void>` on successful open

**Error Contract**:
- Throws exception when settings UI cannot be opened
- Error types: PermissionDenied, UINotAvailable, ExtensionContextInvalid

## Integration Test Contracts

### Configuration Link Visibility Test

**Test Scenario**: Verify configuration link appears when no collections available

**Setup Contract**:
```typescript
interface TestSetup {
  mockCollections: Collection[] = [];
  mockSettingsAccess: boolean = true;
  expectedLinkVisible: boolean = true;
}
```

**Assertion Contract**:
```typescript
interface TestAssertions {
  linkItemExists: boolean;
  linkCommandRegistered: boolean;
  linkTooltipContains: string = "Configure Qdrant";
}
```

### Settings Navigation Test

**Test Scenario**: Verify clicking configuration link opens settings

**Execution Contract**:
```typescript
interface TestExecution {
  commandExecuted: 'qdrant.openConfig';
  vscodeCommandCalled: 'workbench.action.openSettings';
  settingsQuery: 'qdrant';
}
```

**Verification Contract**:
```typescript
interface TestVerification {
  settingsOpened: boolean;
  correctSectionFocused: boolean;
  noErrorsThrown: boolean;
}
```</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/007-configuration-ux-the/contracts/vscode-api-contracts.md