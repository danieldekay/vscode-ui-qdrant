import * as vscode from 'vscode';
import { FileService } from '../services/fileService';
import { QdrantService } from '../services/qdrant-service';
import { handleFileError, handleValidationErrors } from '../utils/errorHandling';

/**
 * Command handler for selecting a local Qdrant database file
 * Opens a file picker dialog and updates the extension configuration
 */
export async function selectLocalDbFile(): Promise<void> {
  try {
    // Open file picker dialog
    const fileUri = await showFilePicker();
    if (!fileUri) {
      // User cancelled the dialog
      return;
    }

    // Show progress indication
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Validating Qdrant database file...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: 'Checking file...' });

        // Validate the selected file
        const validationResult = await FileService.validateQdrantFile(fileUri);

        progress.report({ increment: 50, message: 'Validating...' });

        if (!validationResult.isValid) {
          // Handle validation errors
          handleValidationErrors(validationResult.errors, validationResult.warnings);
          return;
        }

        progress.report({ increment: 75, message: 'Updating configuration...' });

        // Update configuration with the new database path
        const configResult = await QdrantService.updateLocalDbPath(fileUri);

        progress.report({ increment: 100, message: 'Complete' });

        if (configResult.success) {
          // Success - show confirmation
          const fileName = fileUri.path.split('/').pop() || 'database file';
          vscode.window
            .showInformationMessage(
              `Successfully connected to Qdrant database: ${fileName}`,
              'View Collections',
              'Close',
            )
            .then((selection) => {
              if (selection === 'View Collections') {
                vscode.commands.executeCommand('qdrant.showCollections');
              }
            });
        } else {
          // Configuration update failed
          handleFileError(configResult.error || new Error('Configuration update failed'));
        }
      },
    );
  } catch (error) {
    // Handle unexpected errors
    handleFileError(error, 'Failed to select database file');
  }
}

/**
 * Shows a file picker dialog for selecting Qdrant database files
 * @returns Promise resolving to the selected file URI, or undefined if cancelled
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
 * Prefers the current workspace folder, falls back to user home
 * @returns Default directory URI
 */
function getDefaultDirectory(): vscode.Uri | undefined {
  // Try to get the current workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri;
  }

  // Fall back to current configuration value if it exists
  const config = vscode.workspace.getConfiguration('qdrant');
  const currentPath = config.get<vscode.Uri>('localDbPath');
  if (currentPath) {
    // Return the directory containing the current file
    const path = require('node:path');
    const dirPath = path.dirname(currentPath.fsPath);
    return vscode.Uri.file(dirPath);
  }

  // Final fallback - let VS Code decide
  return undefined;
}
