import * as vscode from 'vscode';
import type { CollectionsState } from '../types/collections-state';
import {
  CollectionsStateType,
  createErrorCollectionsState,
  createInitialCollectionsState,
  createLoadedCollectionsState,
  createLoadingCollectionsState,
  hasCollections,
} from '../types/collections-state';
import type { ConfigurationLinkData } from '../types/configuration-link-state';
import {
  ConfigurationLinkState,
  createConfigurationLinkData,
  isConfigurationLinkVisible,
} from '../types/configuration-link-state';
import type { CollectionInfo } from '../types/qdrant';

/**
 * Tree item representing a Qdrant collection
 */
export class CollectionTreeItem extends vscode.TreeItem {
  constructor(
    public readonly collection: CollectionInfo,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None,
  ) {
    super(collection.name, collapsibleState);

    this.tooltip = this.getTooltip();
    this.description = this.getDescription();
    this.iconPath = this.getIcon();
    this.contextValue = 'collection';
  }

  private getTooltip(): string {
    const status =
      this.collection.status === 'green'
        ? 'Healthy'
        : this.collection.status === 'yellow'
          ? 'Warning'
          : 'Error';
    return `${this.collection.name} (${this.collection.vectors_count} vectors, ${status})`;
  }

  private getDescription(): string {
    return `${this.collection.vectors_count} vectors`;
  }

  private getIcon(): vscode.ThemeIcon {
    switch (this.collection.status) {
      case 'green':
        return new vscode.ThemeIcon('database', new vscode.ThemeColor('charts.green'));
      case 'yellow':
        return new vscode.ThemeIcon('warning', new vscode.ThemeColor('charts.yellow'));
      case 'red':
        return new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'));
      default:
        return new vscode.ThemeIcon('database');
    }
  }
}

/**
 * Tree item representing a configuration link
 */
export class ConfigurationLinkTreeItem extends vscode.TreeItem {
  constructor(
    public readonly configData: ConfigurationLinkData,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None,
  ) {
    super(configData.label, collapsibleState);

    this.tooltip = configData.tooltip;
    this.iconPath = this.getIcon();
    this.command = configData.clickable
      ? {
          command: configData.command,
          title: 'Open Configuration',
          arguments: [],
        }
      : undefined;
    this.contextValue = 'configuration-link';
  }

  private getIcon(): vscode.ThemeIcon {
    switch (this.configData.state) {
      case ConfigurationLinkState.INVALID_CONFIG:
        return new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'));
      case ConfigurationLinkState.CONNECTION_FAILED:
        return new vscode.ThemeIcon('warning', new vscode.ThemeColor('charts.yellow'));
      case ConfigurationLinkState.CONNECTING:
        return new vscode.ThemeIcon('sync~spin', new vscode.ThemeColor('charts.blue'));
      default:
        return new vscode.ThemeIcon('settings-gear');
    }
  }
}

/**
 * Tree Data Provider for Qdrant Collections
 *
 * Provides a tree view of Qdrant collections with configuration link support.
 * Shows collections when available, or configuration link when no collections exist.
 */
export class CollectionsTreeProvider
  implements vscode.TreeDataProvider<CollectionTreeItem | ConfigurationLinkTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    CollectionTreeItem | ConfigurationLinkTreeItem | undefined | null | void
  > = new vscode.EventEmitter<
    CollectionTreeItem | ConfigurationLinkTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<
    CollectionTreeItem | ConfigurationLinkTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private collectionsState: CollectionsState;
  private configLinkData: ConfigurationLinkData;

  constructor() {
    this.collectionsState = createInitialCollectionsState();
    this.configLinkData = createConfigurationLinkData(ConfigurationLinkState.NO_COLLECTIONS);
  }

  /**
   * Refresh the tree data
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Update collections state and refresh
   */
  updateCollectionsState(state: CollectionsState): void {
    this.collectionsState = state;
    this.updateConfigurationLinkState();
    this.refresh();
  }

  /**
   * Update configuration link state based on collections state
   */
  private updateConfigurationLinkState(): void {
    if (hasCollections(this.collectionsState)) {
      // Collections exist, hide config link
      this.configLinkData = createConfigurationLinkData(
        ConfigurationLinkState.COLLECTIONS_AVAILABLE,
      );
    } else {
      // No collections, determine config link state
      let configState = ConfigurationLinkState.NO_COLLECTIONS;

      if (this.collectionsState.type === CollectionsStateType.ERROR) {
        configState = ConfigurationLinkState.CONNECTION_FAILED;
      } else if (this.collectionsState.type === CollectionsStateType.LOADING) {
        configState = ConfigurationLinkState.CONNECTING;
      }

      this.configLinkData = createConfigurationLinkData(configState, {
        collectionCount: this.collectionsState.totalCount,
        connectionStatus: this.collectionsState.metadata?.connectionStatus || 'disconnected',
        lastError: this.collectionsState.error?.message,
      });
    }
  }

  /**
   * Get tree item representation
   */
  getTreeItem(element: CollectionTreeItem | ConfigurationLinkTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children of an element (flat structure)
   */
  async getChildren(
    element?: CollectionTreeItem | ConfigurationLinkTreeItem,
  ): Promise<(CollectionTreeItem | ConfigurationLinkTreeItem)[]> {
    // This is a flat structure - no children for any element
    if (element) {
      return [];
    }

    // Root level - return collections or config link
    if (hasCollections(this.collectionsState)) {
      // Return collection items
      return this.collectionsState.collections.map(
        (collection) => new CollectionTreeItem(collection),
      );
    } else if (isConfigurationLinkVisible(this.configLinkData)) {
      // Return configuration link
      return [new ConfigurationLinkTreeItem(this.configLinkData)];
    }

    // No collections and config link not visible
    return [];
  }

  /**
   * Get the current collections state
   */
  getCollectionsState(): CollectionsState {
    return this.collectionsState;
  }

  /**
   * Get the current configuration link data
   */
  getConfigurationLinkData(): ConfigurationLinkData {
    return this.configLinkData;
  }

  /**
   * Set collections data
   */
  setCollections(collections: CollectionInfo[], loadDuration?: number): void {
    this.collectionsState = createLoadedCollectionsState(collections, loadDuration);
    this.updateConfigurationLinkState();
    this.refresh();
  }

  /**
   * Set loading state
   */
  setLoading(): void {
    this.collectionsState = createLoadingCollectionsState(this.collectionsState);
    this.updateConfigurationLinkState();
    this.refresh();
  }

  /**
   * Set error state
   */
  setError(error: Error): void {
    this.collectionsState = createErrorCollectionsState(error, this.collectionsState.collections);
    this.updateConfigurationLinkState();
    this.refresh();
  }

  /**
   * Clear all collections
   */
  clearCollections(): void {
    this.collectionsState = createInitialCollectionsState();
    this.updateConfigurationLinkState();
    this.refresh();
  }

  /**
   * Check if configuration link should be shown
   */
  shouldShowConfigurationLink(): boolean {
    return isConfigurationLinkVisible(this.configLinkData);
  }

  /**
   * Get collection by name
   */
  getCollectionByName(name: string): CollectionInfo | undefined {
    return this.collectionsState.collections.find((col) => col.name === name);
  }

  /**
   * Get all collections
   */
  getAllCollections(): CollectionInfo[] {
    return this.collectionsState.collections;
  }
}

/**
 * Global instance of the collections tree provider
 */
let collectionsTreeProvider: CollectionsTreeProvider | undefined;

/**
 * Get or create the global collections tree provider instance
 */
export function getCollectionsTreeProvider(): CollectionsTreeProvider {
  if (!collectionsTreeProvider) {
    collectionsTreeProvider = new CollectionsTreeProvider();
  }
  return collectionsTreeProvider;
}

/**
 * Register the collections tree provider with VSCode
 */
export function registerCollectionsTreeProvider(
  context: vscode.ExtensionContext,
): vscode.Disposable {
  const provider = getCollectionsTreeProvider();
  const disposable = vscode.window.registerTreeDataProvider('qdrant-collections', provider);
  context.subscriptions.push(disposable);
  return disposable;
}
