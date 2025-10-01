"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
/**
 * Integration Tests: Invalid Configuration Handling
 *
 * Tests the complete error handling flow when invalid configuration
 * is provided through various sources (settings UI, config files, etc.).
 * Ensures graceful degradation and helpful error messages.
 */
(0, mocha_1.describe)('Invalid Configuration Handling - Integration Test', () => {
    let mockVSCodeAPI;
    let mockConfigurationService;
    let mockErrorHandler;
    let errorMessages;
    let warningMessages;
    let infoMessages;
    let configurationAttempts;
    let fallbackApplied;
    (0, mocha_1.beforeEach)(() => {
        errorMessages = [];
        warningMessages = [];
        infoMessages = [];
        configurationAttempts = [];
        fallbackApplied = false;
        // Mock VSCode API with invalid configuration scenarios
        mockVSCodeAPI = {
            workspace: {
                getConfiguration: (section) => {
                    if (section === 'qdrant') {
                        return {
                            get: (key) => {
                                // Return invalid values for testing
                                const invalidConfigs = {
                                    host: 'invalid-host-123!@#',
                                    port: 'not-a-number',
                                    apiKey: 12345, // Should be string
                                    useHttps: 'yes', // Should be boolean
                                    timeout: -100, // Invalid timeout
                                    retryCount: 1000, // Too high
                                };
                                return invalidConfigs[key];
                            },
                        };
                    }
                    return {
                        get: () => undefined,
                    };
                },
                onDidChangeConfiguration: (_callback) => {
                    return { dispose: () => { } };
                },
            },
            window: {
                showErrorMessage: async (message, ..._options) => {
                    errorMessages.push(message);
                    return Promise.resolve();
                },
                showWarningMessage: async (message, ..._options) => {
                    warningMessages.push(message);
                    return Promise.resolve();
                },
                showInformationMessage: async (message, ..._options) => {
                    infoMessages.push(message);
                    return Promise.resolve();
                },
            },
            commands: {
                executeCommand: async (command) => {
                    if (command === 'qdrant.openConfig') {
                        // Simulate opening config command
                        return Promise.resolve();
                    }
                    return Promise.resolve();
                },
            },
        };
        // Mock configuration service with comprehensive validation
        mockConfigurationService = {
            validateConfiguration: (config) => {
                const errors = [];
                // Host validation
                if (!config.host || typeof config.host !== 'string' || config.host.trim().length === 0) {
                    errors.push('Host is required and must be a non-empty string');
                }
                else if (!/^[\w.-]+$/.test(config.host)) {
                    errors.push('Host contains invalid characters');
                }
                // Port validation
                if (config.port === undefined || config.port === null) {
                    errors.push('Port is required');
                }
                else if (typeof config.port !== 'number' || !Number.isInteger(config.port)) {
                    errors.push('Port must be an integer');
                }
                else if (config.port < 1 || config.port > 65535) {
                    errors.push('Port must be between 1 and 65535');
                }
                // API key validation (optional but must be string if provided)
                if (config.apiKey !== undefined && typeof config.apiKey !== 'string') {
                    errors.push('API key must be a string');
                }
                // HTTPS validation
                if (config.useHttps !== undefined && typeof config.useHttps !== 'boolean') {
                    errors.push('useHttps must be a boolean');
                }
                // Timeout validation
                if (config.timeout !== undefined) {
                    if (typeof config.timeout !== 'number' || config.timeout <= 0) {
                        errors.push('Timeout must be a positive number');
                    }
                }
                // Retry count validation
                if (config.retryCount !== undefined) {
                    if (typeof config.retryCount !== 'number' ||
                        !Number.isInteger(config.retryCount) ||
                        config.retryCount < 0 ||
                        config.retryCount > 10) {
                        errors.push('Retry count must be an integer between 0 and 10');
                    }
                }
                return {
                    isValid: errors.length === 0,
                    errors: errors,
                };
            },
            applyConfiguration: async (config) => {
                configurationAttempts.push(config);
                const validation = mockConfigurationService.validateConfiguration(config);
                if (validation.isValid) {
                    return { success: true, config: config, errors: [] };
                }
                else {
                    // Show validation errors
                    for (const error of validation.errors) {
                        await mockVSCodeAPI.window.showErrorMessage(`Configuration Error: ${error}`);
                    }
                    // Attempt to apply defaults for recoverable errors
                    const fallbackConfig = mockConfigurationService.applyFallbackDefaults(config, validation.errors);
                    if (fallbackConfig) {
                        fallbackApplied = true;
                        await mockVSCodeAPI.window.showWarningMessage('Applied configuration with fallback defaults');
                        return { success: true, config: fallbackConfig, errors: validation.errors };
                    }
                    return { success: false, config: null, errors: validation.errors };
                }
            },
            applyFallbackDefaults: (config, errors) => {
                const fallback = { ...config };
                // Apply defaults only for valid types with invalid values
                if (errors.some((e) => e.includes('Port must be between')) &&
                    typeof config.port === 'number') {
                    fallback.port = 6333;
                }
                // Removed fallbacks for type errors to ensure they fail validation
                // Re-validate after applying defaults
                const reValidation = mockConfigurationService.validateConfiguration(fallback);
                return reValidation.isValid ? fallback : null;
            },
            handleInvalidConfiguration: async (config, source) => {
                const result = await mockConfigurationService.applyConfiguration(config);
                if (!result.success) {
                    await mockVSCodeAPI.window.showErrorMessage(`Invalid configuration from ${source}. Please check your settings.`);
                    // Offer to open configuration
                    await mockVSCodeAPI.window.showInformationMessage('Would you like to open the configuration to fix these issues?', 'Open Configuration');
                }
                return result;
            },
        };
        // Mock error handler for invalid configuration scenarios
        mockErrorHandler = {
            handleConfigurationErrors: async (errors, source) => {
                for (const error of errors) {
                    await mockVSCodeAPI.window.showErrorMessage(`[${source}] ${error}`);
                }
                // Suggest corrective actions
                if (errors.some((e) => e.includes('Host'))) {
                    await mockVSCodeAPI.window.showInformationMessage('Host should be a valid hostname or IP address (e.g., localhost, qdrant.example.com)');
                }
                if (errors.some((e) => e.includes('Port'))) {
                    await mockVSCodeAPI.window.showInformationMessage('Port should be a number between 1 and 65535 (default: 6333)');
                }
            },
        };
    });
    (0, mocha_1.afterEach)(() => {
        errorMessages = [];
        warningMessages = [];
        infoMessages = [];
        configurationAttempts = [];
        fallbackApplied = false;
    });
    (0, mocha_1.it)('should detect invalid host configuration', async () => {
        // Given: Invalid host in configuration
        // When: Configuration with invalid host is applied
        const result = await mockConfigurationService.handleInvalidConfiguration({
            host: 'invalid-host-!@#',
            port: 6333,
        }, 'settings');
        // Then: Should detect and report host validation error
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result.errors).to.include('Host contains invalid characters');
        (0, chai_1.expect)(errorMessages).to.have.length.greaterThan(0);
        (0, chai_1.expect)(errorMessages.some((msg) => msg.includes('Host contains invalid characters'))).to.be
            .true;
    });
    (0, mocha_1.it)('should detect invalid port configuration', async () => {
        // Given: Invalid port values
        // When: Various invalid port configurations are tested
        const invalidPorts = ['not-a-number', -1, 0, 65536, 99999];
        for (const port of invalidPorts) {
            const result = await mockConfigurationService.applyConfiguration({
                host: 'localhost',
                port: port,
            });
            // Type errors fail, value errors succeed with fallbacks
            if (typeof port === 'number') {
                (0, chai_1.expect)(result.success).to.be.true; // Gets fallback for valid type, invalid value
            }
            else {
                (0, chai_1.expect)(result.success).to.be.false; // Fails for invalid type
            }
            (0, chai_1.expect)(result.errors.some((e) => e.includes('Port'))).to.be.true;
        }
    });
    (0, mocha_1.it)('should detect invalid data type configurations', async () => {
        // Given: Wrong data types for configuration values
        // When: Configuration with type mismatches is applied
        const result = await mockConfigurationService.applyConfiguration({
            host: 'localhost',
            port: 6333,
            apiKey: 12345, // Should be string
            useHttps: 'yes', // Should be boolean
        });
        // Then: Should detect type errors
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result.errors).to.include('API key must be a string');
        (0, chai_1.expect)(result.errors).to.include('useHttps must be a boolean');
    });
    (0, mocha_1.it)('should apply fallback defaults for recoverable errors', async () => {
        // Given: Configuration with recoverable errors (invalid values, not types)
        // When: Configuration with recoverable errors is applied
        const result = await mockConfigurationService.applyConfiguration({
            host: 'localhost',
            port: -1, // Invalid value but correct type, recoverable
        });
        // Then: Should apply fallbacks and succeed
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(fallbackApplied).to.be.true;
        (0, chai_1.expect)(result.config.port).to.equal(6333);
        (0, chai_1.expect)(warningMessages.some((msg) => msg.includes('fallback defaults'))).to.be.true;
    });
    (0, mocha_1.it)('should provide helpful error messages for different error types', async () => {
        // Given: Various types of configuration errors
        // When: Invalid configuration is processed
        await mockErrorHandler.handleConfigurationErrors([
            'Host contains invalid characters',
            'Port must be between 1 and 65535',
            'API key must be a string',
        ], 'user settings');
        // Then: Should show appropriate guidance messages
        (0, chai_1.expect)(infoMessages.some((msg) => msg.includes('hostname or IP address'))).to.be.true;
        (0, chai_1.expect)(infoMessages.some((msg) => msg.includes('Port should be a number'))).to.be.true;
    });
    (0, mocha_1.it)('should handle completely invalid configuration gracefully', async () => {
        // Given: Configuration that fails all validations
        // When: Completely invalid configuration is applied
        const result = await mockConfigurationService.applyConfiguration({
            host: '',
            port: 'invalid',
            apiKey: [],
            useHttps: null,
        });
        // Then: Should fail gracefully without crashing
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result.errors).to.have.length.greaterThan(0);
        (0, chai_1.expect)(result.config).to.be.null;
    });
    (0, mocha_1.it)('should validate configuration from different sources', async () => {
        // Given: Invalid configurations from different sources
        // When: Same invalid config is tested from different sources
        const invalidConfig = { host: '', port: -1 };
        const sources = ['settings UI', 'config file', 'environment variables'];
        for (const source of sources) {
            const result = await mockConfigurationService.handleInvalidConfiguration(invalidConfig, source);
            (0, chai_1.expect)(result.success).to.be.false;
            (0, chai_1.expect)(errorMessages.some((msg) => msg.includes(source))).to.be.true;
        }
    });
    (0, mocha_1.it)('should maintain configuration attempt history', async () => {
        // Given: Multiple configuration attempts
        // When: Several configuration attempts are made
        await mockConfigurationService.applyConfiguration({ host: 'localhost', port: 6333 });
        await mockConfigurationService.applyConfiguration({ host: 'invalid', port: 99999 });
        await mockConfigurationService.applyConfiguration({ host: 'qdrant.example.com', port: 8080 });
        // Then: Should track all attempts
        (0, chai_1.expect)(configurationAttempts).to.have.length(3);
        (0, chai_1.expect)(configurationAttempts[0].host).to.equal('localhost');
        (0, chai_1.expect)(configurationAttempts[1].host).to.equal('invalid');
        (0, chai_1.expect)(configurationAttempts[2].host).to.equal('qdrant.example.com');
    });
    (0, mocha_1.it)('should offer configuration help when validation fails', async () => {
        // Given: Invalid configuration
        // When: Configuration validation fails
        await mockConfigurationService.handleInvalidConfiguration({
            host: 'localhost',
            port: 'not-a-number',
        }, 'settings');
        // Then: Should offer to open configuration for fixing
        (0, chai_1.expect)(infoMessages.some((msg) => msg.includes('open the configuration'))).to.be.true;
    });
});
//# sourceMappingURL=test_invalid_config_handling.js.map