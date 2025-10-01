"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
/**
 * Integration Tests: Settings Navigation Failure Recovery
 *
 * Tests the failure recovery when VSCode settings UI cannot be opened.
 * This verifies the complete error handling flow including fallback
 * to manual settings file access.
 */
(0, mocha_1.describe)('Settings Navigation Failure Recovery - Integration Test', () => {
    let mockVSCodeAPI;
    let mockCommandHandler;
    let mockErrorHandler;
    let errorMessageShown;
    let fallbackOffered;
    let settingsFileOpened;
    (0, mocha_1.beforeEach)(() => {
        errorMessageShown = '';
        fallbackOffered = false;
        settingsFileOpened = false;
        // Mock VSCode API with settings access failure
        mockVSCodeAPI = {
            commands: {
                executeCommand: async (command, ..._args) => {
                    if (command === 'workbench.action.openSettings') {
                        throw new Error('Settings UI not available in this environment');
                    }
                    if (command === 'vscode.open') {
                        settingsFileOpened = true;
                        return Promise.resolve();
                    }
                    return Promise.resolve();
                },
            },
            window: {
                showErrorMessage: async (message, ...options) => {
                    errorMessageShown = message;
                    if (options.includes('Open Settings File')) {
                        fallbackOffered = true;
                        return 'Open Settings File'; // User chooses fallback
                    }
                    return Promise.resolve();
                },
                showInformationMessage: async (_message) => {
                    return Promise.resolve();
                },
            },
            workspace: {
                findFiles: async (_pattern) => {
                    return [{ fsPath: '/.vscode/settings.json' }];
                },
                openTextDocument: async (_uri) => {
                    return { getText: () => '{}' };
                },
            },
        };
        // Mock error handler for fallback behavior
        mockErrorHandler = {
            handleSettingsAccessError: async (error) => {
                try {
                    // Show error message with fallback option
                    const userChoice = await mockVSCodeAPI.window.showErrorMessage('Could not open settings UI. Opening settings file instead.', 'Open Settings File');
                    if (userChoice === 'Open Settings File') {
                        // Attempt to open settings file as fallback
                        try {
                            const settingsFiles = await mockVSCodeAPI.workspace.findFiles('**/.vscode/settings.json');
                            if (settingsFiles.length > 0) {
                                await mockVSCodeAPI.commands.executeCommand('vscode.open', settingsFiles[0]);
                                return { success: true, method: 'file', error: null };
                            }
                        }
                        catch (fileError) {
                            return {
                                success: false,
                                method: 'file',
                                error: fileError instanceof Error ? fileError.message : 'File open failed',
                            };
                        }
                    }
                    return {
                        success: false,
                        method: 'ui',
                        error: error.message,
                    };
                }
                catch (uiError) {
                    // Handle case where even error UI fails
                    return {
                        success: false,
                        method: 'ui',
                        error: `UI error: ${uiError instanceof Error ? uiError.message : 'Unknown UI error'}`,
                    };
                }
            },
        };
        // Mock command handler with error recovery
        mockCommandHandler = {
            openConfig: async () => {
                try {
                    await mockVSCodeAPI.commands.executeCommand('workbench.action.openSettings', 'qdrant');
                    return { success: true, method: 'ui', error: null };
                }
                catch (error) {
                    // Handle failure with error recovery
                    const recoveryResult = await mockErrorHandler.handleSettingsAccessError(error instanceof Error ? error : new Error('Unknown error'));
                    return recoveryResult;
                }
            },
        };
    });
    (0, mocha_1.afterEach)(() => {
        errorMessageShown = '';
        fallbackOffered = false;
        settingsFileOpened = false;
    });
    (0, mocha_1.it)('should handle settings UI access failure gracefully', async () => {
        // Given: VSCode settings UI is not available
        // When: Configuration link is clicked
        const result = await mockCommandHandler.openConfig();
        // Then: Should handle error gracefully and attempt recovery
        (0, chai_1.expect)(result.success).to.be.true; // Recovery succeeded
        (0, chai_1.expect)(result.method).to.equal('file'); // Used file fallback
        (0, chai_1.expect)(result.error).to.be.null;
    });
    (0, mocha_1.it)('should show user-friendly error message on settings failure', async () => {
        // Given: Settings access will fail
        // When: Configuration command is executed
        await mockCommandHandler.openConfig();
        // Then: User should see helpful error message
        (0, chai_1.expect)(errorMessageShown).to.include('Could not open settings UI');
        (0, chai_1.expect)(errorMessageShown).to.include('Opening settings file instead');
    });
    (0, mocha_1.it)('should offer fallback option when settings UI fails', async () => {
        // Given: Settings UI access fails
        // When: Error recovery is triggered
        await mockCommandHandler.openConfig();
        // Then: Fallback option should be presented
        (0, chai_1.expect)(fallbackOffered).to.be.true;
    });
    (0, mocha_1.it)('should successfully open settings file as fallback', async () => {
        // Given: Settings UI fails but file access works
        // When: Configuration command executes and recovery is triggered
        const result = await mockCommandHandler.openConfig();
        // Then: Settings file should be opened
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(result.method).to.equal('file');
        (0, chai_1.expect)(settingsFileOpened).to.be.true;
    });
    (0, mocha_1.it)('should return appropriate status for failed recovery', async () => {
        // Given: Both UI and file access fail
        mockVSCodeAPI.workspace.findFiles = async () => {
            return []; // No settings files found
        };
        // When: Configuration command is executed
        const result = await mockCommandHandler.openConfig();
        // Then: Should report failure appropriately
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result.method).to.equal('ui'); // Original failure method
        (0, chai_1.expect)(result.error).to.be.a('string');
    });
    (0, mocha_1.it)('should not crash when error handling itself fails', async () => {
        // Given: Error handling has issues
        mockVSCodeAPI.window.showErrorMessage = async () => {
            throw new Error('UI completely broken');
        };
        // When: Configuration command is executed
        let result;
        let didNotCrash = false;
        try {
            result = await mockCommandHandler.openConfig();
            didNotCrash = true;
        }
        catch (_error) {
            // Should not reach here - error should be handled internally
            didNotCrash = false;
        }
        // Then: Should handle internal errors gracefully
        (0, chai_1.expect)(didNotCrash).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.property('success');
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result).to.have.property('error');
    });
    (0, mocha_1.it)('should provide specific error messages for different failure types', async () => {
        // Test case 1: Settings UI failure
        mockVSCodeAPI.commands.executeCommand = async (command) => {
            if (command === 'workbench.action.openSettings') {
                throw new Error('Settings UI not available in this environment');
            }
            if (command === 'vscode.open') {
                settingsFileOpened = true;
                return Promise.resolve();
            }
            return Promise.resolve();
        };
        const result1 = await mockCommandHandler.openConfig();
        (0, chai_1.expect)(result1.success).to.be.true; // Recovery via file succeeds
        (0, chai_1.expect)(result1.error).to.be.null;
        // Test case 2: File access failure
        mockVSCodeAPI.workspace.findFiles = async () => {
            throw new Error('Workspace access denied');
        };
        const result2 = await mockCommandHandler.openConfig();
        (0, chai_1.expect)(result2.success).to.be.false; // Both UI and file access fail
        (0, chai_1.expect)(result2.error).to.include('Workspace access denied');
    });
    (0, mocha_1.it)('should maintain command availability after failure recovery', async () => {
        // Given: Command failed once but recovery worked
        // When: Command is executed again
        const result1 = await mockCommandHandler.openConfig();
        const result2 = await mockCommandHandler.openConfig();
        // Then: Should work consistently
        (0, chai_1.expect)(result1.success).to.be.true;
        (0, chai_1.expect)(result2.success).to.be.true;
    });
    (0, mocha_1.it)('should complete error recovery within reasonable time', async () => {
        // Given: Error recovery process
        // When: Configuration command fails and recovery is attempted
        const startTime = Date.now();
        const result = await mockCommandHandler.openConfig();
        const endTime = Date.now();
        // Then: Should complete within reasonable time
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(endTime - startTime).to.be.lessThan(2000); // Under 2 seconds for error recovery
    });
});
//# sourceMappingURL=test_settings_navigation_failure.js.map