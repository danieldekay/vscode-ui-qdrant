import type { QuickAction } from './enhancedValidation';
import { ActionCategory } from './enhancedValidation';

/**
 * Quick action factory for creating common remediation actions
 */
export interface QuickActionFactory {
  /** Create action to fix file permissions */
  createFixPermissionsAction(filePath: string): QuickAction;
  /** Create action to open containing folder */
  createOpenFolderAction(filePath: string): QuickAction;
  /** Create action to open VS Code settings */
  createOpenSettingsAction(settingsPath?: string): QuickAction;
  /** Create action to retry validation */
  createRetryValidationAction(): QuickAction;
  /** Create action to show technical details */
  createShowDetailsAction(): QuickAction;
  /** Create action to browse for different file */
  createBrowseFileAction(): QuickAction;
}

/**
 * Common quick actions with predefined configurations
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a utility class with static methods for quick actions
export class StandardQuickActions {
  /**
   * Create a fix permissions quick action
   */
  static fixPermissions(filePath: string): QuickAction {
    return {
      actionId: 'fix-permissions',
      label: 'Fix Permissions',
      description: 'Attempt to fix file permissions',
      actionCategory: ActionCategory.FILE_OPERATIONS,
      vsCodeCommand: 'vscode.openExternal',
      commandArgs: [filePath],
      requiresConfirmation: true,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create an open folder quick action
   */
  static openFolder(filePath: string): QuickAction {
    return {
      actionId: 'open-folder',
      label: 'Open Folder',
      description: 'Open containing folder in file explorer',
      actionCategory: ActionCategory.FILE_OPERATIONS,
      vsCodeCommand: 'revealFileInOS',
      commandArgs: [filePath],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 100,
    };
  }

  /**
   * Create an open settings quick action
   */
  static openSettings(settingsKey = 'qdrant'): QuickAction {
    return {
      actionId: 'open-settings',
      label: 'Open Settings',
      description: 'Open VS Code settings for Qdrant extension',
      actionCategory: ActionCategory.VS_CODE_OPERATIONS,
      vsCodeCommand: 'workbench.action.openSettings',
      commandArgs: [settingsKey],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 200,
    };
  }

  /**
   * Create a retry validation quick action
   */
  static retryValidation(): QuickAction {
    return {
      actionId: 'retry-validation',
      label: 'Try Again',
      description: 'Retry the validation process',
      actionCategory: ActionCategory.VS_CODE_OPERATIONS,
      vsCodeCommand: 'qdrant.retryValidation',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 500,
    };
  }

  /**
   * Create a browse file quick action
   */
  static browseFile(): QuickAction {
    return {
      actionId: 'browse-file',
      label: 'Browse for File',
      description: 'Select a different database file',
      actionCategory: ActionCategory.VS_CODE_OPERATIONS,
      vsCodeCommand: 'qdrant.selectLocalDbFile',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create a show technical details quick action
   */
  static showTechnicalDetails(): QuickAction {
    return {
      actionId: 'show-details',
      label: 'Show Technical Details',
      description: 'Display technical error information',
      actionCategory: ActionCategory.GUIDANCE_OPERATIONS,
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create a restart Qdrant service quick action
   */
  static restartQdrantService(): QuickAction {
    return {
      actionId: 'restart-qdrant',
      label: 'Restart Qdrant',
      description: 'Restart the Qdrant service',
      actionCategory: ActionCategory.QDRANT_OPERATIONS,
      vsCodeCommand: 'qdrant.restart',
      commandArgs: [],
      requiresConfirmation: true,
      isDestructive: false,
      estimatedDuration: 2000,
    };
  }

  /**
   * Create a connect to database quick action
   */
  static connectToDatabase(filePath: string): QuickAction {
    return {
      actionId: 'connect-database',
      label: 'Connect Now',
      description: 'Connect to this Qdrant database',
      actionCategory: ActionCategory.QDRANT_OPERATIONS,
      vsCodeCommand: 'qdrant.connect',
      commandArgs: [filePath],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 1000,
    };
  }
}

/**
 * Quick action context for generating appropriate actions based on error types
 */
export interface QuickActionContext {
  /** The file path that failed validation */
  filePath?: string;
  /** The type of validation error */
  errorType: string;
  /** Whether the error is recoverable */
  isRecoverable: boolean;
  /** Additional context for action generation */
  additionalContext?: Record<string, unknown>;
}

/**
 * Factory for generating context-appropriate quick actions
 */
export class ContextualQuickActionFactory implements QuickActionFactory {
  createFixPermissionsAction(filePath: string): QuickAction {
    return StandardQuickActions.fixPermissions(filePath);
  }

  createOpenFolderAction(filePath: string): QuickAction {
    return StandardQuickActions.openFolder(filePath);
  }

  createOpenSettingsAction(settingsPath?: string): QuickAction {
    return StandardQuickActions.openSettings(settingsPath);
  }

  createRetryValidationAction(): QuickAction {
    return StandardQuickActions.retryValidation();
  }

  createShowDetailsAction(): QuickAction {
    return StandardQuickActions.showTechnicalDetails();
  }

  createBrowseFileAction(): QuickAction {
    return StandardQuickActions.browseFile();
  }

  /**
   * Generate appropriate quick actions based on context
   */
  generateActionsForContext(context: QuickActionContext): QuickAction[] {
    const actions: QuickAction[] = [];

    switch (context.errorType) {
      case 'FILE_NOT_FOUND':
        actions.push(this.createRetryValidationAction());
        actions.push(this.createBrowseFileAction());
        if (context.filePath) {
          actions.push(this.createOpenFolderAction(context.filePath));
        }
        break;

      case 'ACCESS_DENIED':
      case 'PERMISSION_DENIED':
        if (context.filePath) {
          actions.push(this.createFixPermissionsAction(context.filePath));
          actions.push(this.createOpenFolderAction(context.filePath));
        }
        actions.push(this.createRetryValidationAction());
        break;

      case 'INVALID_FORMAT':
      case 'CORRUPTED_DATABASE':
        actions.push(this.createShowDetailsAction());
        actions.push(this.createBrowseFileAction());
        if (context.filePath) {
          actions.push(this.createOpenFolderAction(context.filePath));
        }
        break;

      case 'CONNECTION_FAILED':
        actions.push(StandardQuickActions.restartQdrantService());
        actions.push(this.createRetryValidationAction());
        actions.push(this.createOpenSettingsAction());
        break;

      default:
        actions.push(this.createRetryValidationAction());
        actions.push(this.createShowDetailsAction());
        break;
    }

    return actions;
  }
}
