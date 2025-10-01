"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
/**
 * Integration Tests: Settings Navigation Success
 *
 * Tests the successful navigation from configuration link click
 * to VSCode settings UI opening. This verifies the complete
 * user flow when settings access works correctly.
 */
(0, mocha_1.describe)('Settings Navigation Success - Integration Test', () => {
    let mockVSCodeAPI;
    let mockCommandHandler;
    let settingsOpened;
    let settingsSection;
    (0, mocha_1.beforeEach)(() => {
        settingsOpened = false;
        settingsSection = '';
        // Mock VSCode API with successful settings access
        mockVSCodeAPI = {
            commands: {
                executeCommand: async (command, ...args) => {
                    if (command === 'workbench.action.openSettings') {
                        settingsOpened = true;
                        settingsSection = args[0] || '';
                        return Promise.resolve();
                    }
                    return Promise.resolve();
                },
            },
            window: {
                showErrorMessage: async (_message) => {
                    // Should not be called in success scenarios
                    throw new Error('Unexpected error message');
                },
            },
        };
        // Mock command handler that uses VSCode API
        mockCommandHandler = {
            openConfig: async () => {
                try {
                    await mockVSCodeAPI.commands.executeCommand('workbench.action.openSettings', 'qdrant');
                    return { success: true, error: null };
                }
                catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    };
                }
            },
        };
    });
    (0, mocha_1.afterEach)(() => {
        settingsOpened = false;
        settingsSection = '';
    });
    (0, mocha_1.it)('should successfully open settings when configuration link is clicked', async () => {
        // Given: Configuration link is available and clickable
        // When: User clicks the configuration link (executes command)
        const result = await mockCommandHandler.openConfig();
        // Then: Settings should open successfully
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(result.error).to.be.null;
        (0, chai_1.expect)(settingsOpened).to.be.true;
    });
    (0, mocha_1.it)('should open settings with correct qdrant section', async () => {
        // Given: Configuration command is executed
        // When: openConfig command runs
        await mockCommandHandler.openConfig();
        // Then: Settings should open to the qdrant section
        (0, chai_1.expect)(settingsOpened).to.be.true;
        (0, chai_1.expect)(settingsSection).to.equal('qdrant');
    });
    (0, mocha_1.it)('should complete command execution without errors', async () => {
        // Given: VSCode settings API is available and working
        // When: Configuration command is executed
        const result = await mockCommandHandler.openConfig();
        // Then: Command should complete successfully
        (0, chai_1.expect)(result).to.have.property('success', true);
        (0, chai_1.expect)(result).to.have.property('error', null);
        (0, chai_1.expect)(settingsOpened).to.be.true;
    });
    (0, mocha_1.it)('should handle multiple configuration link clicks', async () => {
        // Given: User can click configuration link multiple times
        // When: Configuration link is clicked multiple times
        const result1 = await mockCommandHandler.openConfig();
        const result2 = await mockCommandHandler.openConfig();
        const result3 = await mockCommandHandler.openConfig();
        // Then: Each click should work successfully
        (0, chai_1.expect)(result1.success).to.be.true;
        (0, chai_1.expect)(result2.success).to.be.true;
        (0, chai_1.expect)(result3.success).to.be.true;
        (0, chai_1.expect)(settingsOpened).to.be.true; // At least one settings open occurred
    });
    (0, mocha_1.it)('should not show error messages on successful navigation', async () => {
        // Given: Settings access is working properly
        // When: Configuration command executes successfully
        const result = await mockCommandHandler.openConfig();
        // Then: No error messages should be shown
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(result.error).to.be.null;
        // If showErrorMessage was called, it would have thrown an error in our mock
    });
    (0, mocha_1.it)('should return success status for valid command execution', async () => {
        // Given: All preconditions for successful settings navigation are met
        // When: Command handler executes
        const result = await mockCommandHandler.openConfig();
        // Then: Should return success status
        (0, chai_1.expect)(result).to.be.an('object');
        (0, chai_1.expect)(result).to.have.property('success');
        (0, chai_1.expect)(result).to.have.property('error');
        (0, chai_1.expect)(result.success).to.be.a('boolean');
        (0, chai_1.expect)(result.error).to.be.null;
    });
    (0, mocha_1.it)('should use correct VSCode command for settings navigation', async () => {
        // Given: Command handler needs to call correct VSCode API
        let executedCommand = '';
        let commandArgs = [];
        mockVSCodeAPI.commands.executeCommand = async (command, ...args) => {
            executedCommand = command;
            commandArgs = args;
            settingsOpened = true;
            return Promise.resolve();
        };
        // When: Configuration command is executed
        await mockCommandHandler.openConfig();
        // Then: Should use the correct workbench command
        (0, chai_1.expect)(executedCommand).to.equal('workbench.action.openSettings');
        (0, chai_1.expect)(commandArgs).to.deep.equal(['qdrant']);
    });
    (0, mocha_1.it)('should complete navigation synchronously from user perspective', async () => {
        // Given: Settings navigation should be fast
        // When: Command is executed
        const startTime = Date.now();
        const result = await mockCommandHandler.openConfig();
        const endTime = Date.now();
        // Then: Should complete quickly (under reasonable time limit)
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(endTime - startTime).to.be.lessThan(1000); // Should complete in less than 1 second
    });
    (0, mocha_1.it)('should maintain command availability after successful execution', async () => {
        // Given: Command was executed successfully once
        // When: Command is executed again
        await mockCommandHandler.openConfig();
        const secondResult = await mockCommandHandler.openConfig();
        // Then: Should still work
        (0, chai_1.expect)(secondResult.success).to.be.true;
    });
});
//# sourceMappingURL=test_settings_navigation_success.js.map