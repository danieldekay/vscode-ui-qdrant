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
exports.selectLocalDbFile = selectLocalDbFile;
const vscode = __importStar(require("vscode"));
const fileService_1 = require("../services/fileService");
const qdrant_service_1 = require("../services/qdrant-service");
const errorHandling_1 = require("../utils/errorHandling");
/**
 * Command handler for selecting a local Qdrant database file
 * Opens a file picker dialog and updates the extension configuration
 */
async function selectLocalDbFile() {
    try {
        // Open file picker dialog
        const fileUri = await showFilePicker();
        if (!fileUri) {
            // User cancelled the dialog
            return;
        }
        // Show progress indication
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Validating Qdrant database file...',
            cancellable: false,
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Checking file...' });
            // Validate the selected file
            const validationResult = await fileService_1.FileService.validateQdrantFile(fileUri);
            progress.report({ increment: 50, message: 'Validating...' });
            if (!validationResult.isValid) {
                // Handle validation errors
                (0, errorHandling_1.handleValidationErrors)(validationResult.errors, validationResult.warnings);
                return;
            }
            progress.report({ increment: 75, message: 'Updating configuration...' });
            // Update configuration with the new database path
            const configResult = await qdrant_service_1.QdrantService.updateLocalDbPath(fileUri);
            progress.report({ increment: 100, message: 'Complete' });
            if (configResult.success) {
                // Success - show confirmation
                const fileName = fileUri.path.split('/').pop() || 'database file';
                vscode.window
                    .showInformationMessage(`Successfully connected to Qdrant database: ${fileName}`, 'View Collections', 'Close')
                    .then((selection) => {
                    if (selection === 'View Collections') {
                        vscode.commands.executeCommand('qdrant.showCollections');
                    }
                });
            }
            else {
                // Configuration update failed
                (0, errorHandling_1.handleFileError)(configResult.error || new Error('Configuration update failed'));
            }
        });
    }
    catch (error) {
        // Handle unexpected errors
        (0, errorHandling_1.handleFileError)(error, 'Failed to select database file');
    }
}
/**
 * Shows a file picker dialog for selecting Qdrant database files
 * @returns Promise resolving to the selected file URI, or undefined if cancelled
 */
async function showFilePicker() {
    const filters = {
        'Qdrant Database Files': ['db', 'sqlite', 'sqlite3'],
        'All Files': ['*'],
    };
    const options = {
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
function getDefaultDirectory() {
    // Try to get the current workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri;
    }
    // Fall back to current configuration value if it exists
    const config = vscode.workspace.getConfiguration('qdrant');
    const currentPath = config.get('localDbPath');
    if (currentPath) {
        // Return the directory containing the current file
        const path = require('node:path');
        const dirPath = path.dirname(currentPath.fsPath);
        return vscode.Uri.file(dirPath);
    }
    // Final fallback - let VS Code decide
    return undefined;
}
//# sourceMappingURL=selectDbFile.js.map