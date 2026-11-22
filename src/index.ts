import * as vscode from 'vscode';
import { registerOpenConfigCommand } from './commands/open_config';
import { selectLocalDbFile } from './commands/selectDbFile';
import { selectLocalDbFileEnhanced } from './commands/selectLocalDbFileEnhanced';
import { ConfigService } from './services/config_service';
import { type IQdrantService, QdrantService } from './services/qdrant-service';
import {
  QdrantAuthenticationError,
  QdrantCollectionError,
  QdrantConnectionError,
  QdrantError,
  QdrantValidationError,
} from './types/errors';

/**
 * Global Qdrant service instance
 */
let qdrantService: IQdrantService;

/**
 * Get the global Qdrant service instance
 */
export function getQdrantService(): IQdrantService {
  return qdrantService;
}

/**
 * Global config service instance
 */
let configService: ConfigService;

/**
 * Connect to Qdrant using VS Code configuration
 */
async function connectToQdrant(): Promise<void> {
  const config = vscode.workspace.getConfiguration('qdrant');

  const qdrantConfig = {
    url: config.get('connection.url', 'file:///tmp/qdrant.db'),
    apiKey: config.get('connection.apiKey', ''),
    timeout: config.get('connection.timeout', 30000),
  };

  await qdrantService.connect(qdrantConfig);
}

/**
 * Handle errors and show appropriate VS Code notifications
 */
function handleQdrantError(error: unknown, operation: string): void {
  if (error instanceof QdrantConnectionError) {
    vscode.window
      .showErrorMessage(`Qdrant Connection Failed: ${error.message}`, 'Retry Connection')
      .then((selection) => {
        if (selection === 'Retry Connection') {
          vscode.commands.executeCommand('qdrant.connect');
        }
      });
  } else if (error instanceof QdrantAuthenticationError) {
    vscode.window
      .showErrorMessage(`Qdrant Authentication Failed: ${error.message}`, 'Update API Key')
      .then((selection) => {
        if (selection === 'Update API Key') {
          vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'qdrant.connection.apiKey',
          );
        }
      });
  } else if (error instanceof QdrantValidationError) {
    vscode.window.showWarningMessage(`Qdrant Validation Error: ${error.message}`);
  } else if (error instanceof QdrantCollectionError) {
    vscode.window.showErrorMessage(`Qdrant Collection Error: ${error.message}`);
  } else if (error instanceof QdrantError) {
    vscode.window.showErrorMessage(`Qdrant Error: ${error.message}`);
  } else {
    vscode.window.showErrorMessage(
      `Unexpected error during ${operation}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Activates the VSCode UI Qdrant extension
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('VSCode UI Qdrant extension is now active!');

  // Initialize Qdrant service
  qdrantService = new QdrantService();

  // Initialize config service
  configService = new ConfigService();

  // Auto-connect if configured
  const autoConnect = vscode.workspace.getConfiguration('qdrant').get('ui.autoConnect', false);
  if (autoConnect) {
    try {
      await connectToQdrant();
    } catch (error) {
      // Auto-connect failed, but don't prevent extension activation
      console.warn('Auto-connect failed:', error);
      // Don't show error notification for auto-connect failures to avoid spam
    }
  }

  // Check VS Code version compatibility
  const vscodeVersion = vscode.version;
  if (!isVersionCompatible(vscodeVersion)) {
    throw new Error(
      `VS Code version ${vscodeVersion} is not supported. Minimum required version is 1.74.0`,
    );
  }

  // Check dependencies
  const dependencyStatus = checkDependencies();
  if (!dependencyStatus.allPresent) {
    // Show warnings for missing optional dependencies but continue activation
    dependencyStatus.warnings.forEach((warning) => {
      vscode.window.showWarningMessage(`Qdrant Extension: ${warning}`);
    });
  }

  // Register commands
  registerCommands(context);

  // Create status bar item
  createStatusBarItem(context);

  // Initialize tree views
  initializeTreeViews(context);

  console.log('Qdrant extension activated successfully');
}

/**
 * Deactivates the VSCode UI Qdrant extension
 */
export function deactivate() {
  console.log('VSCode UI Qdrant extension deactivated');
}

/**
 * Check if VS Code version is compatible
 */
export function isVersionCompatible(version: string): boolean {
  const minVersion = '1.74.0';

  // Parse version strings into arrays of numbers
  const parseVersion = (v: string): number[] => {
    return v.split('.').map(Number);
  };

  const current = parseVersion(version);
  const minimum = parseVersion(minVersion);

  // Compare version components
  for (let i = 0; i < Math.max(current.length, minimum.length); i++) {
    const currentPart = current[i] || 0;
    const minimumPart = minimum[i] || 0;

    if (currentPart > minimumPart) {
      return true;
    }
    if (currentPart < minimumPart) {
      return false;
    }
  }

  return true; // versions are equal
}

/**
 * Check for required and optional dependencies
 */
function checkDependencies() {
  const warnings: string[] = [];
  const allPresent = true;

  // For now, assume all dependencies are present
  // TODO: Add actual dependency checks when needed

  return { allPresent, warnings };
}

/**
 * Register all Qdrant commands
 */
function registerCommands(context: vscode.ExtensionContext) {
  // Register Qdrant: Open Search command
  const openSearchCommand = vscode.commands.registerCommand('qdrant.openSearch', () => {
    vscode.window.showInformationMessage('Qdrant: Open Search - Not yet implemented');
  });

  // Register Qdrant: Open Collections command
  const openCollectionsCommand = vscode.commands.registerCommand('qdrant.openCollections', () => {
    vscode.window.showInformationMessage('Qdrant: Open Collections - Not yet implemented');
  });

  // Register Qdrant: Connect command
  const connectCommand = vscode.commands.registerCommand('qdrant.connect', async () => {
    try {
      await connectToQdrant();
      vscode.window.showInformationMessage('Successfully connected to Qdrant');

      // Refresh tree view to show collections
      vscode.commands.executeCommand('qdrantCollections.refresh');
    } catch (error) {
      handleQdrantError(error, 'connection');
    }
  });

  // Register Qdrant: Select Local Database File command
  const selectLocalDbFileCommand = vscode.commands.registerCommand(
    'qdrant.selectLocalDbFile',
    selectLocalDbFile,
  );

  // Register Qdrant: Select Local Database File Enhanced command
  const selectLocalDbFileEnhancedCommand = vscode.commands.registerCommand(
    'qdrant.selectLocalDbFileEnhanced',
    selectLocalDbFileEnhanced,
  );

  // Register Qdrant: Disconnect command
  const disconnectCommand = vscode.commands.registerCommand('qdrant.disconnect', async () => {
    try {
      await qdrantService.disconnect();
      vscode.window.showInformationMessage('Disconnected from Qdrant');

      // Refresh tree view
      vscode.commands.executeCommand('qdrantCollections.refresh');
    } catch (error) {
      handleQdrantError(error, 'disconnection');
    }
  });

  // Register Qdrant: Open Config command
  const openConfigCommand = registerOpenConfigCommand(context, configService);

  // Add all commands to subscriptions
  context.subscriptions.push(
    openSearchCommand,
    openCollectionsCommand,
    connectCommand,
    selectLocalDbFileCommand,
    selectLocalDbFileEnhancedCommand,
    disconnectCommand,
    openConfigCommand,
  );
}

/**
 * Create status bar item for Qdrant
 */
function createStatusBarItem(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = 'Qdrant';
  statusBarItem.tooltip = 'Qdrant Vector Database';
  statusBarItem.command = 'qdrant.openSearch';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
}

/**
 * Tree data provider for Qdrant collections
 */
class QdrantCollectionsProvider implements vscode.TreeDataProvider<QdrantCollectionItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    QdrantCollectionItem | undefined | null | void
  > = new vscode.EventEmitter<QdrantCollectionItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<QdrantCollectionItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private qdrantService: IQdrantService) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: QdrantCollectionItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: QdrantCollectionItem): Promise<QdrantCollectionItem[]> {
    if (!element) {
      // Root level - return collections
      try {
        console.log(
          'QdrantCollectionsProvider: getChildren called, qdrantService exists:',
          !!this.qdrantService,
        );
        if (this.qdrantService?.isConnected()) {
          console.log('QdrantCollectionsProvider: Service is connected, listing collections');
          const collections = await this.qdrantService.listCollections();
          console.log('QdrantCollectionsProvider: Found collections:', collections);
          return collections.map(
            (name: string) =>
              new QdrantCollectionItem(
                name,
                `Collection: ${name}`,
                vscode.TreeItemCollapsibleState.None,
              ),
          );
        } else {
          console.log('QdrantCollectionsProvider: Service not connected');
          return [
            new QdrantCollectionItem(
              'Not connected',
              'Use "Qdrant: Connect" to connect to a server',
              vscode.TreeItemCollapsibleState.None,
            ),
          ];
        }
      } catch (error) {
        console.error('QdrantCollectionsProvider: Error loading collections:', error);
        return [
          new QdrantCollectionItem(
            'Connection error',
            `Failed to load collections: ${error instanceof Error ? error.message : 'Unknown error'}`,
            vscode.TreeItemCollapsibleState.None,
          ),
        ];
      }
    }
    return [];
  }
}

/**
 * Tree item for Qdrant collections
 */
class QdrantCollectionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
  }
}

/**
 * Initialize tree views for Qdrant collections
 */
function initializeTreeViews(context: vscode.ExtensionContext) {
  console.log('Qdrant: Initializing tree views');

  // Create tree data provider for collections
  const collectionsProvider = new QdrantCollectionsProvider(qdrantService);
  console.log('Qdrant: Created collections provider');

  // Register the tree view
  const collectionsView = vscode.window.registerTreeDataProvider(
    'qdrantCollections',
    collectionsProvider,
  );
  console.log('Qdrant: Registered tree data provider');

  // Register refresh command for the tree view
  const refreshCommand = vscode.commands.registerCommand('qdrantCollections.refresh', () => {
    console.log('Qdrant: Refresh command called');
    collectionsProvider.refresh();
  });
  console.log('Qdrant: Registered refresh command');

  context.subscriptions.push(collectionsView, refreshCommand);
  console.log('Qdrant: Tree views initialized successfully');
}
