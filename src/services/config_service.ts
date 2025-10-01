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

/**
 * Service for managing VS Code configuration settings for Qdrant.
 */
export class ConfigService {
  private static readonly CONFIG_SECTION = 'qdrant';

  /**
   * Get the current Qdrant configuration from VS Code settings.
   */
  getConfiguration(): SearchConfig {
    const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);

    const searchConfig: SearchConfig = {
      host: config.get('connection.url', DEFAULT_SEARCH_CONFIG.host),
      port: config.get('connection.port', DEFAULT_SEARCH_CONFIG.port) || DEFAULT_SEARCH_CONFIG.port,
      apiKey: config.get('connection.apiKey', DEFAULT_SEARCH_CONFIG.apiKey),
      collection: config.get('collection.default', DEFAULT_SEARCH_CONFIG.collection),
      timeout: config.get('connection.timeout', DEFAULT_SEARCH_CONFIG.timeout),
    };

    // Handle file:// URLs for local mode
    if (searchConfig.host.startsWith('file://')) {
      // For local file mode, we don't need host/port
      searchConfig.host = 'localhost';
      searchConfig.port = 6333; // Default port, will be ignored for local mode
    }

    return searchConfig;
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
