import * as vscode from 'vscode';

/**
 * Command Result
 *
 * Result returned by command execution with success status and metadata
 */
export interface CommandResult {
  /** Whether the command executed successfully */
  success: boolean;

  /** Method used to open settings ('ui' or 'file') */
  method: 'ui' | 'file';

  /** Error if command failed */
  error?: string;

  /** Additional metadata */
  metadata?: {
    /** Timestamp of execution */
    executedAt?: Date;

    /** VSCode version */
    vscodeVersion?: string;

    /** Whether fallback was used */
    usedFallback?: boolean;
  };
}

/**
 * Command identifier for opening Qdrant configuration
 */
export const OPEN_CONFIG_COMMAND_ID = 'qdrant.openConfig';

/**
 * Registers the open configuration command with VSCode
 */
export function registerOpenConfigCommand(context: vscode.ExtensionContext): vscode.Disposable {
  const command = vscode.commands.registerCommand(OPEN_CONFIG_COMMAND_ID, executeOpenConfigCommand);

  context.subscriptions.push(command);
  return command;
}

/**
 * Executes the open configuration command
 */
export async function executeOpenConfigCommand(): Promise<CommandResult> {
  const startTime = new Date();

  try {
    // First attempt: Open VSCode settings UI
    await vscode.commands.executeCommand('workbench.action.openSettings', 'qdrant');

    return {
      success: true,
      method: 'ui',
      metadata: {
        executedAt: startTime,
        vscodeVersion: vscode.version,
        usedFallback: false,
      },
    };
  } catch (error) {
    // Settings UI failed, attempt fallback to settings file
    return await handleSettingsUIFailure(error, startTime);
  }
}

/**
 * Handles failure to open settings UI with fallback options
 */
async function handleSettingsUIFailure(
  originalError: unknown,
  startTime: Date,
): Promise<CommandResult> {
  try {
    // Show user-friendly error message with fallback option
    const userChoice = await vscode.window.showErrorMessage(
      'Could not open settings UI. Opening settings file instead.',
      'Open Settings File',
    );

    if (userChoice === 'Open Settings File') {
      // Attempt to open settings file as fallback
      const success = await openSettingsFile();

      if (success) {
        return {
          success: true,
          method: 'file',
          metadata: {
            executedAt: startTime,
            vscodeVersion: vscode.version,
            usedFallback: true,
          },
        };
      } else {
        // File opening also failed
        return {
          success: false,
          method: 'file',
          error: 'Failed to open settings file',
          metadata: {
            executedAt: startTime,
            vscodeVersion: vscode.version,
            usedFallback: true,
          },
        };
      }
    } else {
      // User declined fallback
      return {
        success: false,
        method: 'ui',
        error: getErrorMessage(originalError),
        metadata: {
          executedAt: startTime,
          vscodeVersion: vscode.version,
          usedFallback: false,
        },
      };
    }
  } catch (fallbackError) {
    // Even the error handling UI failed
    return {
      success: false,
      method: 'ui',
      error: `Settings access failed: ${getErrorMessage(originalError)}. Fallback UI error: ${getErrorMessage(fallbackError)}`,
      metadata: {
        executedAt: startTime,
        vscodeVersion: vscode.version,
        usedFallback: true,
      },
    };
  }
}

/**
 * Attempts to open the settings file as fallback
 */
async function openSettingsFile(): Promise<boolean> {
  try {
    // Find settings files in workspace
    const settingsFiles = await vscode.workspace.findFiles(
      '**/.vscode/settings.json',
      '**/node_modules/**',
      5,
    );

    if (settingsFiles.length > 0) {
      // Open the first settings file found
      const settingsUri = settingsFiles[0];
      await vscode.commands.executeCommand('vscode.open', settingsUri);
      return true;
    }

    // No settings file found, try to create one
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const settingsUri = vscode.Uri.joinPath(workspaceFolders[0].uri, '.vscode', 'settings.json');

      // Check if file exists
      try {
        await vscode.workspace.fs.stat(settingsUri);
        // File exists, open it
        await vscode.commands.executeCommand('vscode.open', settingsUri);
        return true;
      } catch {
        // File doesn't exist, create it with basic structure
        const initialContent = `{
  // Qdrant Configuration
  // Uncomment and configure the settings below
  // "qdrant.host": "localhost",
  // "qdrant.port": 6333,
  // "qdrant.apiKey": "",
  // "qdrant.useHttps": false
}`;
        await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(initialContent, 'utf8'));
        await vscode.commands.executeCommand('vscode.open', settingsUri);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Failed to open settings file:', error);
    return false;
  }
}

/**
 * Extracts error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * Convenience function to execute the open config command
 */
export async function openQdrantConfig(): Promise<CommandResult> {
  return executeOpenConfigCommand();
}
