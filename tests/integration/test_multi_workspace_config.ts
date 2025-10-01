import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';

/**
 * Integration Tests: Multi-Workspace Configuration
 *
 * Tests the complete behavior when working with multiple workspace folders,
 * ensuring configuration is properly isolated and managed per workspace.
 * This verifies that settings changes in one workspace don't affect others.
 */

describe('Multi-Workspace Configuration - Integration Test', () => {
  let mockVSCodeAPI: any;
  let mockConfigurationService: any;
  let mockWorkspaceManager: any;
  let activeWorkspace: string;
  let workspaceConfigurations: { [workspace: string]: any };
  let configurationChangeEvents: any[];

  beforeEach(() => {
    activeWorkspace = 'workspace1';
    workspaceConfigurations = {
      workspace1: { host: 'localhost', port: 6333, apiKey: '', useHttps: false },
      workspace2: { host: 'qdrant.example.com', port: 8080, apiKey: 'key2', useHttps: true },
      workspace3: {
        host: 'staging.qdrant.com',
        port: 6334,
        apiKey: 'staging-key',
        useHttps: false,
      },
    };
    configurationChangeEvents = [];

    // Mock VSCode API with multi-workspace support
    mockVSCodeAPI = {
      workspace: {
        workspaceFolders: [
          { name: 'workspace1', uri: { fsPath: '/path/to/workspace1' } },
          { name: 'workspace2', uri: { fsPath: '/path/to/workspace2' } },
          { name: 'workspace3', uri: { fsPath: '/path/to/workspace3' } },
        ],
        getConfiguration: (section?: string, scope?: any) => {
          const workspace = scope?.name || activeWorkspace;
          if (section === 'qdrant') {
            return {
              get: (key: string) => {
                return (
                  workspaceConfigurations[workspace]?.[key] ||
                  workspaceConfigurations[activeWorkspace]?.[key]
                );
              },
              update: async (key: string, value: any, targetScope?: any) => {
                const targetWorkspace = targetScope?.name || scope?.name || activeWorkspace;
                if (!workspaceConfigurations[targetWorkspace]) {
                  workspaceConfigurations[targetWorkspace] = {};
                }
                workspaceConfigurations[targetWorkspace][key] = value;

                // Trigger configuration change event
                configurationChangeEvents.push({
                  affectsConfiguration: (section: string, scope?: any) => {
                    return section === 'qdrant' && (!scope || scope.name === targetWorkspace);
                  },
                  scope: { name: targetWorkspace },
                });

                await mockConfigurationService.handleConfigurationChange(
                  configurationChangeEvents[configurationChangeEvents.length - 1],
                );
              },
              inspect: (key: string) => {
                const workspace = scope?.name || activeWorkspace;
                return {
                  workspaceValue: workspaceConfigurations[workspace]?.[key],
                  globalValue: undefined,
                  defaultValue:
                    key === 'host'
                      ? 'localhost'
                      : key === 'port'
                        ? 6333
                        : key === 'apiKey'
                          ? ''
                          : false,
                };
              },
            };
          }
          return {
            get: () => undefined,
            update: async () => {},
            inspect: () => ({
              workspaceValue: undefined,
              globalValue: undefined,
              defaultValue: undefined,
            }),
          };
        },
        onDidChangeConfiguration: (_callback: () => void) => {
          // Store callback for manual triggering
          mockVSCodeAPI.workspace._configCallback = _callback;
          return { dispose: () => {} };
        },
        _configCallback: null,
      },
      window: {
        showInformationMessage: async (_message: string) => {
          return Promise.resolve();
        },
        showWarningMessage: async (_message: string) => {
          return Promise.resolve();
        },
        showErrorMessage: async (_message: string) => {
          return Promise.resolve();
        },
      },
      commands: {
        executeCommand: async (command: string) => {
          if (command === 'qdrant.refreshCollections') {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
      },
    };

    // Mock configuration service with workspace isolation
    mockConfigurationService = {
      workspaceConfigs: new Map(),

      validateConfiguration: (config: any) => {
        const errors: string[] = [];
        if (!config.host || typeof config.host !== 'string') {
          errors.push('Invalid host');
        }
        if (!config.port || typeof config.port !== 'number') {
          errors.push('Invalid port');
        }
        return { isValid: errors.length === 0, errors };
      },

      applyConfiguration: async (config: any, workspace: string) => {
        const validation = mockConfigurationService.validateConfiguration(config);
        if (validation.isValid) {
          mockConfigurationService.workspaceConfigs.set(workspace, { ...config });
          return { success: true, workspace };
        }
        return { success: false, errors: validation.errors, workspace };
      },

      getConfiguration: (workspace: string) => {
        return (
          mockConfigurationService.workspaceConfigs.get(workspace) ||
          workspaceConfigurations[workspace]
        );
      },

      handleConfigurationChange: async (event: any) => {
        if (event.affectsConfiguration('qdrant', event.scope)) {
          const workspace = event.scope.name;
          const newConfig = {
            host: mockVSCodeAPI.workspace.getConfiguration('qdrant', event.scope).get('host'),
            port: mockVSCodeAPI.workspace.getConfiguration('qdrant', event.scope).get('port'),
            apiKey: mockVSCodeAPI.workspace.getConfiguration('qdrant', event.scope).get('apiKey'),
            useHttps: mockVSCodeAPI.workspace
              .getConfiguration('qdrant', event.scope)
              .get('useHttps'),
          };

          await mockConfigurationService.applyConfiguration(newConfig, workspace);
        }
      },

      getAllWorkspaceConfigurations: () => {
        const result: { [workspace: string]: any } = {};
        for (const workspace of Object.keys(workspaceConfigurations)) {
          result[workspace] = mockConfigurationService.getConfiguration(workspace);
        }
        return result;
      },
    };

    // Mock workspace manager for multi-workspace operations
    mockWorkspaceManager = {
      getActiveWorkspace: () => activeWorkspace,

      setActiveWorkspace: (workspace: string) => {
        activeWorkspace = workspace;
      },

      getWorkspaceConfiguration: (workspace: string) => {
        return mockConfigurationService.getConfiguration(workspace);
      },

      updateWorkspaceConfiguration: async (workspace: string, config: any) => {
        return await mockConfigurationService.applyConfiguration(config, workspace);
      },

      validateWorkspaceIsolation: () => {
        // Check that configurations are properly isolated
        const configs = mockConfigurationService.getAllWorkspaceConfigurations();
        const workspaces = Object.keys(configs);
        for (let i = 0; i < workspaces.length; i++) {
          for (let j = i + 1; j < workspaces.length; j++) {
            const config1 = configs[workspaces[i]];
            const config2 = configs[workspaces[j]];
            if (
              JSON.stringify(config1) === JSON.stringify(config2) &&
              workspaces[i] !== workspaces[j]
            ) {
              return false; // Configurations should be different
            }
          }
        }
        return true;
      },
    };
  });

  afterEach(() => {
    activeWorkspace = 'workspace1';
    workspaceConfigurations = {};
    configurationChangeEvents = [];
  });

  it('should maintain separate configurations for each workspace', async () => {
    // Given: Multiple workspaces with different configurations

    // When: Configurations are applied to different workspaces
    await mockWorkspaceManager.updateWorkspaceConfiguration('workspace1', {
      host: 'localhost',
      port: 6333,
      apiKey: 'key1',
      useHttps: false,
    });
    await mockWorkspaceManager.updateWorkspaceConfiguration('workspace2', {
      host: 'remote.qdrant.com',
      port: 8080,
      apiKey: 'key2',
      useHttps: true,
    });

    // Then: Each workspace should maintain its own configuration
    const config1 = mockWorkspaceManager.getWorkspaceConfiguration('workspace1');
    const config2 = mockWorkspaceManager.getWorkspaceConfiguration('workspace2');

    expect(config1.host).to.equal('localhost');
    expect(config1.port).to.equal(6333);
    expect(config1.apiKey).to.equal('key1');
    expect(config1.useHttps).to.equal(false);

    expect(config2.host).to.equal('remote.qdrant.com');
    expect(config2.port).to.equal(8080);
    expect(config2.apiKey).to.equal('key2');
    expect(config2.useHttps).to.equal(true);
  });

  it('should isolate configuration changes to the correct workspace', async () => {
    // Given: Initial configurations for all workspaces

    // When: Configuration is changed in one workspace
    await mockVSCodeAPI.workspace
      .getConfiguration('qdrant', { name: 'workspace1' })
      .update('host', 'new-host-1');

    // Then: Only that workspace's configuration should change
    const config1 = mockWorkspaceManager.getWorkspaceConfiguration('workspace1');
    const config2 = mockWorkspaceManager.getWorkspaceConfiguration('workspace2');
    const config3 = mockWorkspaceManager.getWorkspaceConfiguration('workspace3');

    expect(config1.host).to.equal('new-host-1');
    expect(config2.host).to.equal('qdrant.example.com'); // Unchanged
    expect(config3.host).to.equal('staging.qdrant.com'); // Unchanged
  });

  it('should handle workspace-specific configuration inspection', async () => {
    // Given: Different configurations per workspace

    // When: Configuration is inspected for specific workspaces
    const inspect1 = mockVSCodeAPI.workspace
      .getConfiguration('qdrant', { name: 'workspace1' })
      .inspect('host');
    const inspect2 = mockVSCodeAPI.workspace
      .getConfiguration('qdrant', { name: 'workspace2' })
      .inspect('port');

    // Then: Should return workspace-specific values
    expect(inspect1.workspaceValue).to.equal('localhost');
    expect(inspect2.workspaceValue).to.equal(8080);
  });

  it('should validate configurations independently per workspace', async () => {
    // Given: Valid config for workspace1, invalid for workspace2

    // When: Configurations are validated
    const result1 = await mockWorkspaceManager.updateWorkspaceConfiguration('workspace1', {
      host: 'valid.host',
      port: 6333,
    });
    const result2 = await mockWorkspaceManager.updateWorkspaceConfiguration('workspace2', {
      host: '',
      port: 'invalid',
    });

    // Then: Valid workspace should succeed, invalid should fail
    expect(result1.success).to.be.true;
    expect(result2.success).to.be.false;
    expect(result2.errors).to.include('Invalid host');
    expect(result2.errors).to.include('Invalid port');
  });

  it('should track configuration changes per workspace', async () => {
    // Given: Multiple workspaces

    // When: Configuration changes occur in different workspaces
    await mockVSCodeAPI.workspace
      .getConfiguration('qdrant', { name: 'workspace1' })
      .update('port', 7000);
    await mockVSCodeAPI.workspace
      .getConfiguration('qdrant', { name: 'workspace2' })
      .update('host', 'updated.qdrant.com');

    // Then: Change events should be tracked separately
    expect(configurationChangeEvents).to.have.length(2);
    expect(configurationChangeEvents[0].scope.name).to.equal('workspace1');
    expect(configurationChangeEvents[1].scope.name).to.equal('workspace2');
  });

  it('should provide active workspace context', async () => {
    // Given: Active workspace is set

    // When: Active workspace changes
    mockWorkspaceManager.setActiveWorkspace('workspace2');

    // Then: Should return correct active workspace
    expect(mockWorkspaceManager.getActiveWorkspace()).to.equal('workspace2');

    // And configuration access should use active workspace
    const activeConfig = mockConfigurationService.getConfiguration(
      mockWorkspaceManager.getActiveWorkspace(),
    );
    expect(activeConfig.host).to.equal('qdrant.example.com');
  });

  it('should handle workspace addition and removal', async () => {
    // Given: Initial workspaces

    // When: A new workspace is added
    workspaceConfigurations.workspace4 = { host: 'new.workspace', port: 6335 };
    mockVSCodeAPI.workspace.workspaceFolders.push({
      name: 'workspace4',
      uri: { fsPath: '/path/to/workspace4' },
    });

    // Then: New workspace should be manageable
    const newConfig = mockWorkspaceManager.getWorkspaceConfiguration('workspace4');
    expect(newConfig.host).to.equal('new.workspace');
    expect(newConfig.port).to.equal(6335);

    // And isolation should still be maintained
    expect(mockWorkspaceManager.validateWorkspaceIsolation()).to.be.true;
  });

  it('should gracefully handle missing workspace configurations', async () => {
    // Given: A workspace without configuration

    // When: Configuration is requested for non-existent workspace
    const config = mockWorkspaceManager.getWorkspaceConfiguration('nonexistent');

    // Then: Should return undefined or default without crashing
    expect(config).to.be.undefined;
  });

  it('should maintain configuration integrity across workspace switches', async () => {
    // Given: Configurations in multiple workspaces

    // When: Active workspace is switched multiple times
    mockWorkspaceManager.setActiveWorkspace('workspace1');
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('apiKey', 'switched-key1');

    mockWorkspaceManager.setActiveWorkspace('workspace2');
    await mockVSCodeAPI.workspace.getConfiguration('qdrant').update('apiKey', 'switched-key2');

    mockWorkspaceManager.setActiveWorkspace('workspace1');
    const finalConfig1 = mockWorkspaceManager.getWorkspaceConfiguration('workspace1');
    const finalConfig2 = mockWorkspaceManager.getWorkspaceConfiguration('workspace2');

    // Then: Configurations should remain correct
    expect(finalConfig1.apiKey).to.equal('switched-key1');
    expect(finalConfig2.apiKey).to.equal('switched-key2');
  });
});
