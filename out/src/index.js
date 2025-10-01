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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const client_1 = require("./qdrant/client");
/**
 * Global Qdrant client instance
 */
let qdrantClient;
/**
 * Activates the VSCode UI Qdrant extension
 */
function activate(context) {
    console.log('VSCode UI Qdrant extension is now active!');
    // Initialize Qdrant client
    qdrantClient = new client_1.QdrantClient();
    // Check VS Code version compatibility
    const vscodeVersion = vscode.version;
    if (!isVersionCompatible(vscodeVersion)) {
        throw new Error(`VS Code version ${vscodeVersion} is not supported. Minimum required version is 1.74.0`);
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
function deactivate() {
    console.log('VSCode UI Qdrant extension deactivated');
}
/**
 * Check if VS Code version is compatible
 */
function isVersionCompatible(version) {
    const minVersion = '1.74.0';
    return version >= minVersion;
}
/**
 * Check for required and optional dependencies
 */
function checkDependencies() {
    const warnings = [];
    const allPresent = true;
    // For now, assume all dependencies are present
    // TODO: Add actual dependency checks when needed
    return { allPresent, warnings };
}
/**
 * Register all Qdrant commands
 */
function registerCommands(context) {
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
            // Get connection configuration from user
            const url = await vscode.window.showInputBox({
                prompt: 'Enter Qdrant server URL',
                placeHolder: 'http://localhost:6333',
                value: 'http://localhost:6333',
            });
            if (!url) {
                return;
            }
            const apiKey = await vscode.window.showInputBox({
                prompt: 'Enter API key (optional)',
                placeHolder: 'Leave empty if not required',
            });
            // Connect to Qdrant
            await qdrantClient.connect({ url, apiKey });
            vscode.window.showInformationMessage('Successfully connected to Qdrant server');
            // Refresh tree view to show collections
            vscode.commands.executeCommand('qdrantCollections.refresh');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to connect to Qdrant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    // Register Qdrant: Disconnect command
    const disconnectCommand = vscode.commands.registerCommand('qdrant.disconnect', async () => {
        try {
            await qdrantClient.disconnect();
            vscode.window.showInformationMessage('Disconnected from Qdrant server');
            // Refresh tree view
            vscode.commands.executeCommand('qdrantCollections.refresh');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    // Add all commands to subscriptions
    context.subscriptions.push(openSearchCommand, openCollectionsCommand, connectCommand, disconnectCommand);
}
/**
 * Create status bar item for Qdrant
 */
function createStatusBarItem(context) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = 'Qdrant';
    statusBarItem.tooltip = 'Qdrant Vector Database';
    statusBarItem.command = 'qdrant.openSearch';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}
/**
 * Initialize tree views for Qdrant collections
 */
function initializeTreeViews(context) {
    // Create tree data provider for collections
    const collectionsProvider = new QdrantCollectionsProvider();
    // Register the tree view
    const collectionsView = vscode.window.registerTreeDataProvider('qdrantCollections', collectionsProvider);
    // Register refresh command for the tree view
    const refreshCommand = vscode.commands.registerCommand('qdrantCollections.refresh', () => {
        collectionsProvider.refresh();
    });
    context.subscriptions.push(collectionsView, refreshCommand);
}
/**
 * Tree data provider for Qdrant collections
 */
class QdrantCollectionsProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Root level - return collections
            try {
                if (qdrantClient.isConnected()) {
                    const collections = await qdrantClient.listCollections();
                    return collections.map(name => new QdrantCollectionItem(name, `Collection: ${name}`, vscode.TreeItemCollapsibleState.None));
                }
                else {
                    return [
                        new QdrantCollectionItem('Not connected', 'Use "Qdrant: Connect" to connect to a server', vscode.TreeItemCollapsibleState.None),
                    ];
                }
            }
            catch (error) {
                return [
                    new QdrantCollectionItem('Connection error', `Failed to load collections: ${error instanceof Error ? error.message : 'Unknown error'}`, vscode.TreeItemCollapsibleState.None),
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
    label;
    tooltip;
    collapsibleState;
    constructor(label, tooltip, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.tooltip = tooltip;
        this.collapsibleState = collapsibleState;
        this.tooltip = tooltip;
    }
}
//# sourceMappingURL=index.js.map