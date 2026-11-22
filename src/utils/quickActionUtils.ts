import * as vscode from 'vscode';
import { ActionCategory, type QuickAction } from '../types/enhancedValidation';

/**
 * Utility class for generating contextual quick actions for error remediation
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Utility class with static methods
export class QuickActionUtils {
  /**
   * Gets contextual quick actions based on error type and context
   * @param errorCode - The error code or type
   * @param filePath - The file path where the error occurred
   * @returns Array of quick actions appropriate for the error
   */
  static getContextualActions(errorCode: string, filePath: string): QuickAction[] {
    const actions: QuickAction[] = [];

    switch (errorCode) {
      case 'FILE_NOT_FOUND':
        actions.push(QuickActionUtils.createBrowseAction());
        actions.push(QuickActionUtils.createAutoDiscoverAction());
        break;

      case 'PERMISSION_DENIED':
      case 'FILE_NOT_READABLE':
        actions.push(QuickActionUtils.createFixPermissionsAction(filePath));
        actions.push(QuickActionUtils.createBrowseAction());
        break;

      case 'INVALID_FILE_FORMAT':
      case 'CORRUPTED_DATABASE':
        actions.push(QuickActionUtils.createOpenHelpAction());
        actions.push(QuickActionUtils.createShowDetailsAction());
        break;

      case 'MISSING_COLLECTIONS':
        actions.push(QuickActionUtils.createCreateCollectionsAction(filePath));
        actions.push(QuickActionUtils.createCreateSampleAction(filePath));
        break;

      case 'SUCCESS':
        // No actions needed for successful validation
        break;

      default:
        actions.push(QuickActionUtils.createRetryAction());
        actions.push(QuickActionUtils.createBrowseAction());
        break;
    }

    return actions;
  }

  /**
   * Gets quick actions adapted to workspace context
   */
  static getWorkspaceContextActions(
    errorCode: string,
    _workspaceFolder: vscode.WorkspaceFolder,
  ): QuickAction[] {
    const actions: QuickAction[] = [];

    if (errorCode === 'FILE_NOT_FOUND') {
      actions.push(QuickActionUtils.createAutoDiscoverAction());
      actions.push(QuickActionUtils.createBrowseAction());
    }

    return actions;
  }

  /**
   * Create a browse file action
   */
  private static createBrowseAction(): QuickAction {
    return {
      actionId: 'browse-file',
      label: 'Browse for file',
      description: 'Open file browser to select database',
      actionCategory: ActionCategory.FILE_OPERATIONS,
      vsCodeCommand: 'qdrant.selectLocalDbFileEnhanced',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create an auto-discover action
   */
  private static createAutoDiscoverAction(): QuickAction {
    return {
      actionId: 'auto-discover',
      label: 'Auto-discover databases',
      description: 'Scan workspace for Qdrant databases',
      actionCategory: ActionCategory.QDRANT_OPERATIONS,
      vsCodeCommand: 'qdrant.autoDiscoverDatabases',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 3000,
    };
  }

  /**
   * Create a fix permissions action
   */
  private static createFixPermissionsAction(filePath: string): QuickAction {
    return {
      actionId: 'fix-permissions',
      label: 'Fix permissions',
      description: 'Attempt to fix file permissions',
      actionCategory: ActionCategory.FILE_OPERATIONS,
      vsCodeCommand: 'qdrant.fixFilePermissions',
      commandArgs: [filePath],
      requiresConfirmation: true,
      isDestructive: false,
      estimatedDuration: 1000,
    };
  }

  /**
   * Create an open help action
   */
  private static createOpenHelpAction(): QuickAction {
    return {
      actionId: 'open-help',
      label: 'Learn about Qdrant format',
      description: 'View documentation about Qdrant database files',
      actionCategory: ActionCategory.GUIDANCE_OPERATIONS,
      vsCodeCommand: 'vscode.open',
      commandArgs: [vscode.Uri.parse('https://qdrant.tech/documentation/')],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create a show details action
   */
  private static createShowDetailsAction(): QuickAction {
    return {
      actionId: 'show-details',
      label: 'Show details',
      description: 'View technical error information',
      actionCategory: ActionCategory.GUIDANCE_OPERATIONS,
      vsCodeCommand: 'qdrant.showErrorDetails',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 0,
    };
  }

  /**
   * Create a create collections directory action
   */
  private static createCreateCollectionsAction(filePath: string): QuickAction {
    return {
      actionId: 'create-collections-dir',
      label: 'Create collections directory',
      description: 'Create the required collections folder',
      actionCategory: ActionCategory.FILE_OPERATIONS,
      vsCodeCommand: 'qdrant.createCollectionsDirectory',
      commandArgs: [require('path').dirname(filePath)],
      requiresConfirmation: true,
      isDestructive: false,
      estimatedDuration: 500,
    };
  }

  /**
   * Create a create sample collection action
   */
  private static createCreateSampleAction(filePath: string): QuickAction {
    return {
      actionId: 'create-sample-collection',
      label: 'Create sample collection',
      description: 'Add a sample collection to get started',
      actionCategory: ActionCategory.QDRANT_OPERATIONS,
      vsCodeCommand: 'qdrant.createSampleCollection',
      commandArgs: [require('path').dirname(filePath)],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 1000,
    };
  }

  /**
   * Create a retry action
   */
  private static createRetryAction(): QuickAction {
    return {
      actionId: 'retry',
      label: 'Try again',
      description: 'Retry the validation',
      actionCategory: ActionCategory.VS_CODE_OPERATIONS,
      vsCodeCommand: 'qdrant.validateFile',
      commandArgs: [],
      requiresConfirmation: false,
      isDestructive: false,
      estimatedDuration: 1000,
    };
  }
}
