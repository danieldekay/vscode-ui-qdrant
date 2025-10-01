import * as vscode from 'vscode';
import type { CollectionsState } from '../types/collections-state';
import type { ConfigurationLinkData } from '../types/configuration-link-state';
import type { CollectionInfo } from '../types/qdrant';
/**
 * Tree item representing a Qdrant collection
 */
export declare class CollectionTreeItem extends vscode.TreeItem {
    readonly collection: CollectionInfo;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    constructor(collection: CollectionInfo, collapsibleState?: vscode.TreeItemCollapsibleState);
    private getTooltip;
    private getDescription;
    private getIcon;
}
/**
 * Tree item representing a configuration link
 */
export declare class ConfigurationLinkTreeItem extends vscode.TreeItem {
    readonly configData: ConfigurationLinkData;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    constructor(configData: ConfigurationLinkData, collapsibleState?: vscode.TreeItemCollapsibleState);
    private getIcon;
}
/**
 * Tree Data Provider for Qdrant Collections
 *
 * Provides a tree view of Qdrant collections with configuration link support.
 * Shows collections when available, or configuration link when no collections exist.
 */
export declare class CollectionsTreeProvider implements vscode.TreeDataProvider<CollectionTreeItem | ConfigurationLinkTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<CollectionTreeItem | ConfigurationLinkTreeItem | undefined | null | void>;
    private collectionsState;
    private configLinkData;
    constructor();
    /**
     * Refresh the tree data
     */
    refresh(): void;
    /**
     * Update collections state and refresh
     */
    updateCollectionsState(state: CollectionsState): void;
    /**
     * Update configuration link state based on collections state
     */
    private updateConfigurationLinkState;
    /**
     * Get tree item representation
     */
    getTreeItem(element: CollectionTreeItem | ConfigurationLinkTreeItem): vscode.TreeItem;
    /**
     * Get children of an element (flat structure)
     */
    getChildren(element?: CollectionTreeItem | ConfigurationLinkTreeItem): Promise<(CollectionTreeItem | ConfigurationLinkTreeItem)[]>;
    /**
     * Get the current collections state
     */
    getCollectionsState(): CollectionsState;
    /**
     * Get the current configuration link data
     */
    getConfigurationLinkData(): ConfigurationLinkData;
    /**
     * Set collections data
     */
    setCollections(collections: CollectionInfo[], loadDuration?: number): void;
    /**
     * Set loading state
     */
    setLoading(): void;
    /**
     * Set error state
     */
    setError(error: Error): void;
    /**
     * Clear all collections
     */
    clearCollections(): void;
    /**
     * Check if configuration link should be shown
     */
    shouldShowConfigurationLink(): boolean;
    /**
     * Get collection by name
     */
    getCollectionByName(name: string): CollectionInfo | undefined;
    /**
     * Get all collections
     */
    getAllCollections(): CollectionInfo[];
}
/**
 * Get or create the global collections tree provider instance
 */
export declare function getCollectionsTreeProvider(): CollectionsTreeProvider;
/**
 * Register the collections tree provider with VSCode
 */
export declare function registerCollectionsTreeProvider(context: vscode.ExtensionContext): vscode.Disposable;
//# sourceMappingURL=collections-tree-provider.d.ts.map