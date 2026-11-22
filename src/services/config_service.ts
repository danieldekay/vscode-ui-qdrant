import * as vscode from 'vscode';
import {
  DEFAULT_SEARCH_CONFIG,
  type SearchConfig,
  validateSearchConfig,
} from '../models/search_config';
import {
  DEFAULT_SEARCH_PARAMETERS,
  type SearchParameters,
  validateSearchParameters,
} from '../models/search_parameters';
import type { QdrantConfiguration } from '../types/qdrant-configuration';

/**
 * Service for managing VS Code configuration settings for Qdrant.
 */
export class ConfigService {
  private static readonly CONFIG_SECTION = 'qdrant';

  /**
   * Get the current Qdrant configuration from VS Code settings.
   */
  public getConfiguration(): QdrantConfiguration {
    const config = vscode.workspace.getConfiguration('qdrant');

    return {
      url: config.get<string>('connection.url') || 'http://localhost:6333',
      databasePath: config.get<string>('localDbPath') || '',
      host: config.get<string>('connection.url') || 'http://localhost:6333',
      port: config.get<number>('connection.port') || 6333,
      apiKey: config.get<string>('connection.apiKey'),
      timeout: config.get<number>('connection.timeout') || 5000,
      collection: config.get<string>('search.defaultCollection') || 'default',
      useHttps: false,
      retryCount: 3,
      enabled: true,
      name: 'Default Configuration',
      defaultParameters: {
        resultLimit: config.get<number>('search.defaultParameters.resultLimit') || 10,
        similarityThreshold:
          config.get<number>('search.defaultParameters.similarityThreshold') || 0.7,
        includePayload: config.get<boolean>('search.defaultParameters.includePayload') ?? true,
        includeVector: config.get<boolean>('search.defaultParameters.includeVector') ?? false,
      },
    };
  }

  /**
   * Update the Qdrant configuration in VS Code settings.
   */
  async updateConfiguration(updates: Partial<SearchConfig>): Promise<boolean> {
    try {
      const currentConfig = this.getConfiguration();
      const newConfig = { ...currentConfig, ...updates };

      if (!validateSearchConfig(newConfig)) {
        return false;
      }

      const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);

      // Update each setting
      if (updates.host !== undefined) {
        await config.update('connection.url', updates.host, vscode.ConfigurationTarget.Workspace);
      }
      if (updates.port !== undefined) {
        await config.update('connection.port', updates.port, vscode.ConfigurationTarget.Workspace);
      }
      if (updates.apiKey !== undefined) {
        await config.update(
          'connection.apiKey',
          updates.apiKey,
          vscode.ConfigurationTarget.Workspace,
        );
      }
      if (updates.collection !== undefined) {
        await config.update(
          'collection.default',
          updates.collection,
          vscode.ConfigurationTarget.Workspace,
        );
      }
      if (updates.timeout !== undefined) {
        await config.update(
          'connection.timeout',
          updates.timeout,
          vscode.ConfigurationTarget.Workspace,
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to update configuration:', error);
      return false;
    }
  }

  /**
   * Get default search parameters from VS Code settings.
   */
  getDefaultSearchParameters(): SearchParameters {
    const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);

    const params: SearchParameters = {
      similarityThreshold: config.get(
        'search.default.scoreThreshold',
        DEFAULT_SEARCH_PARAMETERS.similarityThreshold,
      ),
      resultLimit: config.get('search.default.limit', DEFAULT_SEARCH_PARAMETERS.resultLimit),
      includePayload: config.get(
        'search.default.withPayload',
        DEFAULT_SEARCH_PARAMETERS.includePayload,
      ),
      includeVector: config.get(
        'search.default.withVector',
        DEFAULT_SEARCH_PARAMETERS.includeVector,
      ),
    };

    return params;
  }

  /**
   * Update default search parameters in VS Code settings.
   */
  async updateSearchParameters(
    parameters: Partial<SearchParameters>,
  ): Promise<{ success: boolean; validatedParameters: SearchParameters }> {
    try {
      const currentParams = this.getDefaultSearchParameters();
      const newParams = { ...currentParams, ...parameters };

      if (!validateSearchParameters(newParams)) {
        return {
          success: false,
          validatedParameters: currentParams,
        };
      }

      const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);

      // Update each parameter
      if (parameters.similarityThreshold !== undefined) {
        await config.update(
          'search.default.scoreThreshold',
          parameters.similarityThreshold,
          vscode.ConfigurationTarget.Workspace,
        );
      }
      if (parameters.resultLimit !== undefined) {
        await config.update(
          'search.default.limit',
          parameters.resultLimit,
          vscode.ConfigurationTarget.Workspace,
        );
      }
      if (parameters.includePayload !== undefined) {
        await config.update(
          'search.default.withPayload',
          parameters.includePayload,
          vscode.ConfigurationTarget.Workspace,
        );
      }
      if (parameters.includeVector !== undefined) {
        await config.update(
          'search.default.withVector',
          parameters.includeVector,
          vscode.ConfigurationTarget.Workspace,
        );
      }

      return {
        success: true,
        validatedParameters: newParams,
      };
    } catch (error) {
      console.error('Failed to update search parameters:', error);
      return {
        success: false,
        validatedParameters: this.getDefaultSearchParameters(),
      };
    }
  }

  /**
   * Validate a configuration object.
   */
  validateConfiguration(config: Partial<SearchConfig>): { valid: boolean; errors?: string[] } {
    const fullConfig = { ...this.getConfiguration(), ...config };

    if (validateSearchConfig(fullConfig)) {
      return { valid: true };
    }

    // Basic validation - could be enhanced
    const errors: string[] = [];

    if (config.host && (typeof config.host !== 'string' || config.host.trim() === '')) {
      errors.push('Invalid host format');
    }

    if (
      config.port &&
      (typeof config.port !== 'number' || config.port < 1 || config.port > 65535)
    ) {
      errors.push('Port must be between 1 and 65535');
    }

    if (
      config.collection &&
      (typeof config.collection !== 'string' || config.collection.trim() === '')
    ) {
      errors.push('Collection name cannot be empty');
    }

    if (config.timeout && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
      errors.push('Timeout must be a positive number');
    }

    return { valid: false, errors };
  }

  /**
   * Get default configuration values.
   */
  getDefaultConfiguration(): SearchConfig {
    return { ...DEFAULT_SEARCH_CONFIG };
  }

  /**
   * Reset configuration to defaults.
   */
  async resetToDefaults(): Promise<void> {
    const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);

    await config.update('connection.url', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('connection.port', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('connection.apiKey', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('connection.timeout', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('collection.default', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('search.default.limit', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update(
      'search.default.scoreThreshold',
      undefined,
      vscode.ConfigurationTarget.Workspace,
    );
    await config.update(
      'search.default.withPayload',
      undefined,
      vscode.ConfigurationTarget.Workspace,
    );
    await config.update(
      'search.default.withVector',
      undefined,
      vscode.ConfigurationTarget.Workspace,
    );
  }
}
