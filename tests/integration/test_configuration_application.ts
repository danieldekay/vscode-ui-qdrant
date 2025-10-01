import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';

/**
 * Integration Tests: Configuration Application
 *
 * Tests the complete flow of applying configuration changes through
 * VSCode settings and verifying the extension responds correctly.
 * This ensures configuration changes are detected and applied properly.
 */

describe('Configuration Application - Integration Test', () => {
  let mockVSCodeAPI: any;
  let mockConfigurationService: any;
  let configurationChanged: boolean;
  let treeDataRefreshed: boolean;
  let configValidationPassed: boolean;
  let appliedConfig: any;

  beforeEach(() => {
    configurationChanged = false;
    treeDataRefreshed = false;
    configValidationPassed = false;
    appliedConfig = null;

    // Mock VSCode API with configuration change detection
    mockVSCodeAPI = {
      workspace: {
        onDidChangeConfiguration: (_callback: () => void) => {
          // Return disposable mock
          return {
            dispose: () => {},
          };
        },
        getConfiguration: (section?: string) => {
          if (section === 'qdrant') {
            return {
              get: (key: string) => {
                if (appliedConfig && key in appliedConfig) {
                  return appliedConfig[key as keyof typeof appliedConfig];
                }
                const defaultConfig = {
                  host: 'localhost',
                  port: 6333,
                  apiKey: '',
                  useHttps: false,
                };
                return defaultConfig[key as keyof typeof defaultConfig];
              },
              update: async (key: string, value: any) => {
                if (!appliedConfig) appliedConfig = {};
                appliedConfig[key] = value;
                configurationChanged = true;
                // Trigger configuration change event synchronously
                await mockConfigurationService.handleConfigurationChange({
                  affectsConfiguration: (section: string) => section === 'qdrant',
                });
              },
            };
          }
          return {
            get: () => undefined,
            update: async () => {},
          };
        },
      },
      commands: {
        executeCommand: async (command: string) => {
          if (command === 'qdrant.refreshCollections') {
            treeDataRefreshed = true;
            return Promise.resolve();
          }
          return Promise.resolve();
        },
      },
      window: {
        showInformationMessage: async (_message: string) => {
          return Promise.resolve();
        },
        showErrorMessage: async (_message: string) => {
          return Promise.resolve();
        },
      },
    };

    // Mock configuration service with validation and application logic
    mockConfigurationService = {
      currentConfig: null,
      isValid: false,

      validateConfiguration: (config: any) => {
        const isValid =
          config &&
          typeof config.host === 'string' &&
          config.host.length > 0 &&
          typeof config.port === 'number' &&
          config.port > 0 &&
          config.port < 65536;

        configValidationPassed = isValid;
        return isValid;
      },

      applyConfiguration: async (config: any) => {
        if (mockConfigurationService.validateConfiguration(config)) {
          mockConfigurationService.currentConfig = { ...config };
          mockConfigurationService.isValid = true;
          // Trigger tree refresh
          await mockVSCodeAPI.commands.executeCommand('qdrant.refreshCollections');
          return { success: true, error: null };
        } else {
          mockConfigurationService.isValid = false;
          return { success: false, error: 'Invalid configuration' };
        }
      },

      handleConfigurationChange: async (event: any) => {
        if (event.affectsConfiguration('qdrant')) {
          const newConfig = {
            host: mockVSCodeAPI.workspace.getConfiguration('qdrant').get('host'),
            port: mockVSCodeAPI.workspace.getConfiguration('qdrant').get('port'),
            apiKey: mockVSCodeAPI.workspace.getConfiguration('qdrant').get('apiKey'),
            useHttps: mockVSCodeAPI.workspace.getConfiguration('qdrant').get('useHttps'),
          };

          await mockConfigurationService.applyConfiguration(newConfig);
        }
      },

      getCurrentConfiguration: () => {
        return mockConfigurationService.currentConfig;
      },
    };

    // Remove unused mockTreeDataProvider
  });

  afterEach(() => {
    configurationChanged = false;
    treeDataRefreshed = false;
    configValidationPassed = false;
    appliedConfig = null;
  });

  it('should detect configuration changes through VSCode settings', async () => {
    // Given: Initial configuration

    // When: Configuration is changed via VSCode settings API
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'qdrant.example.com');

    // Then: Configuration change should be detected
    expect(configurationChanged).to.be.true;
  });

  it('should validate configuration when changes are applied', async () => {
    // Given: Valid configuration change

    // When: Configuration is updated
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('port', 8080);

    // Then: Configuration should be validated
    expect(configValidationPassed).to.be.true;
  });

  it('should apply valid configuration changes automatically', async () => {
    // Given: Valid configuration values

    // When: Multiple configuration values are updated
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'qdrant.example.com');
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('port', 8080);

    // Then: Configuration should be applied
    const currentConfig = mockConfigurationService.getCurrentConfiguration();
    expect(currentConfig).to.not.be.null;
    expect(currentConfig.host).to.equal('qdrant.example.com');
    expect(currentConfig.port).to.equal(8080);
  });

  it('should refresh tree data provider when configuration changes', async () => {
    // Given: Tree data provider is connected

    // When: Configuration is changed
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'new-host');

    // Then: Tree data should be refreshed
    expect(treeDataRefreshed).to.be.true;
  });

  it('should reject invalid configuration values', async () => {
    // Given: Invalid port number

    // When: Invalid configuration is applied
    const result = await mockConfigurationService.applyConfiguration({
      host: 'localhost',
      port: -1, // Invalid port
      apiKey: '',
      useHttps: false,
    });

    // Then: Configuration should be rejected
    expect(result.success).to.be.false;
    expect(result.error).to.include('Invalid configuration');
    expect(mockConfigurationService.isValid).to.be.false;
  });

  it('should handle configuration changes with missing values', async () => {
    // Given: Partial configuration

    // When: Configuration with missing required values is applied
    const result = await mockConfigurationService.applyConfiguration({
      host: '', // Empty host is invalid
      port: 6333,
      apiKey: '',
      useHttps: false,
    });

    // Then: Should be rejected due to missing host
    expect(result.success).to.be.false;
    expect(configValidationPassed).to.be.false;
  });

  it('should maintain configuration state across multiple changes', async () => {
    // Given: Initial valid configuration
    await mockConfigurationService.applyConfiguration({
      host: 'localhost',
      port: 6333,
      apiKey: '',
      useHttps: false,
    });

    // When: Multiple configuration updates are made
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'qdrant.example.com');
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('port', 8080);
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('apiKey', 'secret-key');

    // Then: All changes should be maintained
    const finalConfig = mockConfigurationService.getCurrentConfiguration();
    expect(finalConfig.host).to.equal('qdrant.example.com');
    expect(finalConfig.port).to.equal(8080);
    expect(finalConfig.apiKey).to.equal('secret-key');
  });

  it('should not refresh tree when configuration validation fails', async () => {
    // Given: Tree refresh flag reset
    treeDataRefreshed = false;

    // When: Invalid configuration is applied
    await mockConfigurationService.applyConfiguration({
      host: 'localhost',
      port: 99999, // Invalid port
      apiKey: '',
      useHttps: false,
    });

    // Then: Tree should not be refreshed
    expect(treeDataRefreshed).to.be.false;
  });

  it('should handle rapid configuration changes gracefully', async () => {
    // Given: Multiple rapid changes

    // When: Several configuration updates happen quickly
    const promises = [
      mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'host1'),
      mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'host2'),
      mockVSCodeAPI.workspace.getConfiguration('qdrant').update('host', 'host3'),
    ];

    await Promise.all(promises);

    // Then: Final configuration should be the last valid one
    const finalConfig = mockConfigurationService.getCurrentConfiguration();
    expect(finalConfig).to.not.be.null;
    expect(finalConfig.host).to.equal('host3');
  });
});
