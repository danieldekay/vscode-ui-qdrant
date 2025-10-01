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
exports.OPEN_CONFIG_COMMAND_ID = void 0;
exports.registerOpenConfigCommand = registerOpenConfigCommand;
exports.executeOpenConfigCommand = executeOpenConfigCommand;
exports.openQdrantConfig = openQdrantConfig;
const vscode = __importStar(require("vscode"));
/**
 * Command identifier for opening Qdrant configuration
 */
exports.OPEN_CONFIG_COMMAND_ID = 'qdrant.openConfig';
/**
 * Registers the open configuration command with VSCode
 */
function registerOpenConfigCommand(context) {
    const command = vscode.commands.registerCommand(exports.OPEN_CONFIG_COMMAND_ID, executeOpenConfigCommand);
    context.subscriptions.push(command);
    return command;
}
/**
 * Executes the open configuration command
 */
async function executeOpenConfigCommand() {
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
    }
    catch (error) {
        // Settings UI failed, attempt fallback to settings file
        return await handleSettingsUIFailure(error, startTime);
    }
}
/**
 * Handles failure to open settings UI with fallback options
 */
async function handleSettingsUIFailure(originalError, startTime) {
    try {
        // Show user-friendly error message with fallback option
        const userChoice = await vscode.window.showErrorMessage('Could not open settings UI. Opening settings file instead.', 'Open Settings File');
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
            }
            else {
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
        }
        else {
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
    }
    catch (fallbackError) {
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
async function openSettingsFile() {
    try {
        // Find settings files in workspace
        const settingsFiles = await vscode.workspace.findFiles('**/.vscode/settings.json', '**/node_modules/**', 5);
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
            }
            catch {
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
    }
    catch (error) {
        console.error('Failed to open settings file:', error);
        return false;
    }
}
/**
 * Extracts error message from unknown error
 */
function getErrorMessage(error) {
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
async function openQdrantConfig() {
    return executeOpenConfigCommand();
}
//# sourceMappingURL=open-config.js.map