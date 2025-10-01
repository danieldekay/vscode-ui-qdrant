"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsTreeProvider = exports.ConfigurationLinkTreeItem = exports.CollectionTreeItem = void 0;
exports.getCollectionsTreeProvider = getCollectionsTreeProvider;
exports.registerCollectionsTreeProvider = registerCollectionsTreeProvider;
const vscode = __importStar(require("vscode"));
const collections_state_1 = require("../types/collections-state");
const configuration_link_state_1 = require("../types/configuration-link-state");
/**
 * Tree item representing a Qdrant collection
 */
class CollectionTreeItem extends vscode.TreeItem {
    collection;
    collapsibleState;
    constructor(collection, collapsibleState = vscode
        .TreeItemCollapsibleState.None) {
        super(collection.name, collapsibleState);
        this.collection = collection;
        this.collapsibleState = collapsibleState;
        this.tooltip = this.getTooltip();
        this.description = this.getDescription();
        this.iconPath = this.getIcon();
        this.contextValue = 'collection';
    }
    getTooltip() {
        const status = this.collection.status === 'green'
            ? 'Healthy'
            : this.collection.status === 'yellow'
                ? 'Warning'
                : 'Error';
        return `${this.collection.name} (${this.collection.vectors_count} vectors, ${status})`;
    }
    getDescription() {
        return `${this.collection.vectors_count} vectors`;
    }
    getIcon() {
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
exports.CollectionTreeItem = CollectionTreeItem;
/**
 * Tree item representing a configuration link
 */
class ConfigurationLinkTreeItem extends vscode.TreeItem {
    configData;
    collapsibleState;
    constructor(configData, collapsibleState = vscode
        .TreeItemCollapsibleState.None) {
        super(configData.label, collapsibleState);
        this.configData = configData;
        this.collapsibleState = collapsibleState;
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
    getIcon() {
        switch (this.configData.state) {
            case configuration_link_state_1.ConfigurationLinkState.INVALID_CONFIG:
                return new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'));
            case configuration_link_state_1.ConfigurationLinkState.CONNECTION_FAILED:
                return new vscode.ThemeIcon('warning', new vscode.ThemeColor('charts.yellow'));
            case configuration_link_state_1.ConfigurationLinkState.CONNECTING:
                return new vscode.ThemeIcon('sync~spin', new vscode.ThemeColor('charts.blue'));
            default:
                return new vscode.ThemeIcon('settings-gear');
        }
    }
}
exports.ConfigurationLinkTreeItem = ConfigurationLinkTreeItem;
/**
 * Tree Data Provider for Qdrant Collections
 *
 * Provides a tree view of Qdrant collections with configuration link support.
 * Shows collections when available, or configuration link when no collections exist.
 */
class CollectionsTreeProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    collectionsState;
    configLinkData;
    constructor() {
        this.collectionsState = (0, collections_state_1.createInitialCollectionsState)();
        this.configLinkData = (0, configuration_link_state_1.createConfigurationLinkData)(configuration_link_state_1.ConfigurationLinkState.NO_COLLECTIONS);
    }
    /**
     * Refresh the tree data
     */
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    /**
     * Update collections state and refresh
     */
    updateCollectionsState(state) {
        this.collectionsState = state;
        this.updateConfigurationLinkState();
        this.refresh();
    }
    /**
     * Update configuration link state based on collections state
     */
    updateConfigurationLinkState() {
        if ((0, collections_state_1.hasCollections)(this.collectionsState)) {
            // Collections exist, hide config link
            this.configLinkData = (0, configuration_link_state_1.createConfigurationLinkData)(configuration_link_state_1.ConfigurationLinkState.COLLECTIONS_AVAILABLE);
        }
        else {
            // No collections, determine config link state
            let configState = configuration_link_state_1.ConfigurationLinkState.NO_COLLECTIONS;
            if (this.collectionsState.type === collections_state_1.CollectionsStateType.ERROR) {
                configState = configuration_link_state_1.ConfigurationLinkState.CONNECTION_FAILED;
            }
            else if (this.collectionsState.type === collections_state_1.CollectionsStateType.LOADING) {
                configState = configuration_link_state_1.ConfigurationLinkState.CONNECTING;
            }
            this.configLinkData = (0, configuration_link_state_1.createConfigurationLinkData)(configState, {
                collectionCount: this.collectionsState.totalCount,
                connectionStatus: this.collectionsState.metadata?.connectionStatus || 'disconnected',
                lastError: this.collectionsState.error?.message,
            });
        }
    }
    /**
     * Get tree item representation
     */
    getTreeItem(element) {
        return element;
    }
    /**
     * Get children of an element (flat structure)
     */
    async getChildren(element) {
        // This is a flat structure - no children for any element
        if (element) {
            return [];
        }
        // Root level - return collections or config link
        if ((0, collections_state_1.hasCollections)(this.collectionsState)) {
            // Return collection items
            return this.collectionsState.collections.map((collection) => new CollectionTreeItem(collection));
        }
        else if ((0, configuration_link_state_1.isConfigurationLinkVisible)(this.configLinkData)) {
            // Return configuration link
            return [new ConfigurationLinkTreeItem(this.configLinkData)];
        }
        // No collections and config link not visible
        return [];
    }
    /**
     * Get the current collections state
     */
    getCollectionsState() {
        return this.collectionsState;
    }
    /**
     * Get the current configuration link data
     */
    getConfigurationLinkData() {
        return this.configLinkData;
    }
    /**
     * Set collections data
     */
    setCollections(collections, loadDuration) {
        this.collectionsState = (0, collections_state_1.createLoadedCollectionsState)(collections, loadDuration);
        this.updateConfigurationLinkState();
        this.refresh();
    }
    /**
     * Set loading state
     */
    setLoading() {
        this.collectionsState = (0, collections_state_1.createLoadingCollectionsState)(this.collectionsState);
        this.updateConfigurationLinkState();
        this.refresh();
    }
    /**
     * Set error state
     */
    setError(error) {
        this.collectionsState = (0, collections_state_1.createErrorCollectionsState)(error, this.collectionsState.collections);
        this.updateConfigurationLinkState();
        this.refresh();
    }
    /**
     * Clear all collections
     */
    clearCollections() {
        this.collectionsState = (0, collections_state_1.createInitialCollectionsState)();
        this.updateConfigurationLinkState();
        this.refresh();
    }
    /**
     * Check if configuration link should be shown
     */
    shouldShowConfigurationLink() {
        return (0, configuration_link_state_1.isConfigurationLinkVisible)(this.configLinkData);
    }
    /**
     * Get collection by name
     */
    getCollectionByName(name) {
        return this.collectionsState.collections.find((col) => col.name === name);
    }
    /**
     * Get all collections
     */
    getAllCollections() {
        return this.collectionsState.collections;
    }
}
exports.CollectionsTreeProvider = CollectionsTreeProvider;
/**
 * Global instance of the collections tree provider
 */
let collectionsTreeProvider;
/**
 * Get or create the global collections tree provider instance
 */
function getCollectionsTreeProvider() {
    if (!collectionsTreeProvider) {
        collectionsTreeProvider = new CollectionsTreeProvider();
    }
    return collectionsTreeProvider;
}
/**
 * Register the collections tree provider with VSCode
 */
function registerCollectionsTreeProvider(context) {
    const provider = getCollectionsTreeProvider();
    const disposable = vscode.window.registerTreeDataProvider('qdrant-collections', provider);
    context.subscriptions.push(disposable);
    return disposable;
}
//# sourceMappingURL=collections-tree-provider.js.map