import * as vscode from 'vscode';
import { getQdrantService } from '../index';
import { DiscoveryService } from '../services/discoveryService';
import { FileService } from '../services/fileService';
import type { DatabaseDiscoveryResult } from '../types/discovery';
import type { EnhancedValidationResult } from '../types/enhancedValidation';
import { handleFileError } from '../utils/errorHandling';

/**
 * Enhanced command handler for selecting a local Qdrant database file
 * Includes auto-discovery functionality and improved error handling
 */
export async function selectLocalDbFileEnhanced(): Promise<void> {
  try {
    // Show initial selection options
    const option = await showSelectionOptions();
    if (!option) {
      // User cancelled
      return;
    }

    if (option === 'auto-discover') {
      await handleAutoDiscovery();
    } else if (option === 'manual-select') {
      await handleManualSelection();
    }
  } catch (error) {
    handleFileError(error, 'Failed to select database file');
  }
}

/**
 * Shows the initial selection options dialog
 */
async function showSelectionOptions(): Promise<string | undefined> {
  const items = [
    {
      label: '$(search) Auto-discover databases',
      detail: 'Automatically scan workspace for Qdrant databases',
      id: 'auto-discover',
    },
    {
      label: '$(folder-opened) Browse for file',
      detail: 'Manually select a database file',
      id: 'manual-select',
    },
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Choose how to select your Qdrant database',
    title: 'Select Qdrant Database',
  });

  return selected?.id;
}

/**
 * Handles auto-discovery workflow
 */
async function handleAutoDiscovery(): Promise<void> {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Discovering Qdrant databases...',
      cancellable: true,
    },
    async (progress, token) => {
      try {
        progress.report({ increment: 0, message: 'Scanning workspace...' });

        const discoveryService = new DiscoveryService();
        const workspaceFolders = vscode.workspace.workspaceFolders || [];

        const result = await discoveryService.discoverDatabases(
          workspaceFolders,
          {
            scanTimeout: 3000,
            maxDirectoryDepth: 3,
            includedFileExtensions: ['.db', '.sqlite', '.sqlite3', ''],
            excludedDirectories: [
              'node_modules',
              '.git',
              '.vscode',
              'dist',
              'out',
              'build',
              'cache',
              '.cache',
              'tmp',
              '.tmp',
              'temp',
              '.temp',
              'logs',
              '.logs',
              'log',
              '.log',
              '__pycache__',
              '.pytest_cache',
            ],
            enableProgressReporting: true,
            allowCancellation: true,
            validateDiscoveredFiles: true,
            groupByDirectory: true,
            detectQdrantFolders: true, // ✅ Folder detection enabled
          },
          token,
        );

        progress.report({ increment: 90, message: 'Processing results...' });

        if (result.discoveredFiles.length === 0) {
          // No databases found - offer manual selection
          await handleNoDiscoveryResults();
          return;
        }

        // Show discovered databases
        const selectedDb = await showDiscoveryResults(result);
        if (selectedDb) {
          await applyDatabaseSelection(selectedDb);
        }

        progress.report({ increment: 100, message: 'Complete' });
      } catch (error) {
        if (token.isCancellationRequested) {
          vscode.window.showInformationMessage('Discovery cancelled');
          return;
        }
        throw error;
      }
    },
  );
}

/**
 * Handles manual file selection workflow
 */
async function handleManualSelection(): Promise<void> {
  const fileUri = await showFilePicker();
  if (!fileUri) {
    return;
  }

  await validateAndApplySelection(fileUri);
}

/**
 * Shows discovered databases and lets user select one
 */
async function showDiscoveryResults(
  result: DatabaseDiscoveryResult,
): Promise<vscode.Uri | undefined> {
  const items = result.discoveredFiles.map((db) => {
    // Determine file type icon and description
    let icon = '$(database)';
    let typeDescription = 'Database File';

    // Check if this is from folder detection (name contains parentheses with actual file)
    if (db.name.includes('(') && db.name.includes(')')) {
      icon = '$(folder-library)';
      typeDescription = 'Qdrant Folder';
    } else if (db.name.toLowerCase().includes('qdrant')) {
      icon = '$(database)';
      typeDescription = 'Qdrant DB';
    } else {
      // Check if it's from a folder detection by looking at the path structure
      const pathParts = db.path.split('/');
      const parentDir = pathParts[pathParts.length - 2];
      if (parentDir?.toLowerCase().includes('qdrant')) {
        icon = '$(folder-library)';
        typeDescription = 'Qdrant Folder';
      }
    }

    // Format size for better readability
    let sizeDisplay = 'Unknown size';
    if (db.size) {
      if (db.size > 1024 * 1024) {
        sizeDisplay = `${Math.round((db.size / (1024 * 1024)) * 10) / 10}MB`;
      } else if (db.size > 1024) {
        sizeDisplay = `${Math.round(db.size / 1024)}KB`;
      } else {
        sizeDisplay = `${db.size}B`;
      }
    }

    // Get relative path for shorter display
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let displayPath = db.path;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspaceRoot = workspaceFolders[0].uri.fsPath;
      if (db.path.startsWith(workspaceRoot)) {
        displayPath = db.path.substring(workspaceRoot.length + 1);
      }
    }

    return {
      label: `${icon} ${db.name}`,
      detail: displayPath,
      description: `${typeDescription} • ${sizeDisplay}`,
      uri: vscode.Uri.file(db.path),
    };
  });

  // Add option to browse manually as separate type
  const manualOption = {
    label: '$(folder-opened) Browse for different file...',
    detail: 'Open file picker to select a different database',
    description: 'Manual selection',
  };

  const allItems = [...items, manualOption];

  // Count folders vs files for better display
  const folderCount = items.filter((item) => item.description?.includes('Folder')).length;
  const fileCount = items.length - folderCount;
  let titleSuffix = '';
  if (folderCount > 0 && fileCount > 0) {
    titleSuffix = ` (${folderCount} folders, ${fileCount} files)`;
  } else if (folderCount > 0) {
    titleSuffix = ` (${folderCount} Qdrant folders)`;
  } else {
    titleSuffix = ` (${fileCount} database files)`;
  }

  const selected = await vscode.window.showQuickPick(allItems, {
    placeHolder: 'Select a discovered database or browse manually',
    title: `Found ${result.discoveredFiles.length} Qdrant database(s)${titleSuffix} • Scan: ${result.scanDuration}ms`,
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (!selected) {
    return undefined;
  }

  // Check if it's the manual option
  if (selected === manualOption) {
    return await showFilePicker();
  }

  // It's one of the discovered files
  const dbItem = selected as (typeof items)[0];
  return dbItem.uri;
}

/**
 * Handles case when no databases were discovered
 */
async function handleNoDiscoveryResults(): Promise<void> {
  const option = await vscode.window.showInformationMessage(
    'No Qdrant databases found in workspace. Would you like to browse for a file manually?',
    'Browse Files',
    'Cancel',
  );

  if (option === 'Browse Files') {
    await handleManualSelection();
  }
}

/**
 * Validates and applies the selected database file
 */
async function validateAndApplySelection(fileUri: vscode.Uri): Promise<void> {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Validating Qdrant database file...',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0, message: 'Checking file...' });

      // Use enhanced validation
      const validationResult = await FileService.validateQdrantFileEnhanced(fileUri.fsPath);

      progress.report({ increment: 50, message: 'Validating...' });

      if (!validationResult.basicResult.isValid) {
        // Handle validation errors with enhanced error handling
        await handleEnhancedValidationErrors(validationResult);
        return;
      }

      await applyDatabaseSelection(fileUri);
      progress.report({ increment: 100, message: 'Complete' });
    },
  );
}

/**
 * Applies the database selection and updates configuration
 */
async function applyDatabaseSelection(fileUri: vscode.Uri): Promise<void> {
  // Get the global service instance and update local database path
  const qdrantService = getQdrantService();
  const configResult = await qdrantService.updateLocalDbPath(fileUri);

  if (configResult.success) {
    // Update the local database path and set connection URL to localhost server
    const config = vscode.workspace.getConfiguration('qdrant');
    const filePath = fileUri.fsPath;
    await config.update('localDbPath', filePath, vscode.ConfigurationTarget.Workspace);
    // Set connection URL to localhost Qdrant server (default)
    await config.update(
      'connection.url',
      'http://localhost:6333',
      vscode.ConfigurationTarget.Workspace,
    );

    // Success - show confirmation and refresh collections view
    const fileName = fileUri.path.split('/').pop() || 'database file';

    // Refresh the collections tree view to show available collections
    await vscode.commands.executeCommand('qdrantCollections.refresh');

    // Small delay to ensure connection is established before showing success
    setTimeout(() => {
      vscode.window
        .showInformationMessage(
          `Successfully connected to Qdrant database: ${fileName}`,
          'View Collections',
          'Open Configuration',
          'Close',
        )
        .then((selection) => {
          if (selection === 'View Collections') {
            // Focus on the collections view
            vscode.commands.executeCommand('qdrantCollections.focus');
          } else if (selection === 'Open Configuration') {
            // Open configuration panel to show the updated URL
            vscode.commands.executeCommand('qdrant.openConfig');
          }
        });
    }, 500);
  } else {
    // Configuration update failed
    handleFileError(configResult.error || new Error('Configuration update failed'));
  }
}

/**
 * Handles enhanced validation errors with quick actions
 */
async function handleEnhancedValidationErrors(result: EnhancedValidationResult): Promise<void> {
  // Get contextual quick actions
  const actions = result.quickActions;
  const actionLabels = actions.map((action) => action.label);

  // Show error with actions
  const selectedAction = await vscode.window.showErrorMessage(
    result.simpleMessage,
    { detail: result.technicalDetails, modal: false },
    ...actionLabels,
  );

  if (selectedAction) {
    // Execute the selected action
    const action = actions.find((a) => a.label === selectedAction);
    if (action) {
      await executeQuickAction(action);
    }
  }
}

/**
 * Executes a quick action
 */
async function executeQuickAction(action: any): Promise<void> {
  try {
    if (action.command) {
      await vscode.commands.executeCommand(action.command, ...(action.args || []));
    } else if (action.callback) {
      await action.callback();
    }
  } catch (error) {
    handleFileError(error, `Failed to execute action: ${action.label}`);
  }
}

/**
 * Shows a file picker dialog for selecting Qdrant database files
 * (Same as original but kept for consistency)
 */
async function showFilePicker(): Promise<vscode.Uri | undefined> {
  const filters = {
    'Qdrant Database Files': ['db', 'sqlite', 'sqlite3'],
    'All Files': ['*'],
  };

  const options: vscode.OpenDialogOptions = {
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    defaultUri: getDefaultDirectory(),
    filters,
    openLabel: 'Select Qdrant Database',
    title: 'Select Qdrant Database File',
  };

  const fileUris = await vscode.window.showOpenDialog(options);
  return fileUris && fileUris.length > 0 ? fileUris[0] : undefined;
}

/**
 * Gets the default directory for the file picker
 */
function getDefaultDirectory(): vscode.Uri | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri;
  }

  const config = vscode.workspace.getConfiguration('qdrant');
  const currentPath = config.get<vscode.Uri>('localDbPath');
  if (currentPath) {
    const path = require('node:path');
    const dirPath = path.dirname(currentPath.fsPath);
    return vscode.Uri.file(dirPath);
  }

  return undefined;
}
