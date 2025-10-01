import type { SearchConfig } from '../models/search_config';
import type { SearchParameters } from '../models/search_parameters';
import type { ConfigService } from '../services/config_service';

/**
 * Configuration API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for configuration operations
 * within the VS Code extension context.
 */
export class ConfigEndpoint {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  /**
   * Get current configuration.
   *
   * @returns Current search configuration
   */
  getConfiguration(): SearchConfig {
    return this.configService.getConfiguration();
  }

  /**
   * Update configuration.
   *
   * @param updates Configuration updates
   * @returns Success status
   */
  async updateConfiguration(updates: Partial<SearchConfig>): Promise<boolean> {
    return this.configService.updateConfiguration(updates);
  }

  /**
   * Get default search parameters.
   *
   * @returns Default search parameters
   */
  getDefaultSearchParameters(): SearchParameters {
    return this.configService.getDefaultSearchParameters();
  }

  /**
   * Update default search parameters.
   *
   * @param parameters New default parameters
   * @returns Update result
   */
  async updateDefaultSearchParameters(parameters: Partial<SearchParameters>) {
    return this.configService.updateSearchParameters(parameters);
  }

  /**
   * Validate configuration.
   *
   * @param config Configuration to validate
   * @returns Validation result
   */
  validateConfiguration(config: Partial<SearchConfig>) {
    return this.configService.validateConfiguration(config);
  }

  /**
   * Reset configuration to defaults.
   */
  async resetToDefaults(): Promise<void> {
    return this.configService.resetToDefaults();
  }
}

/**
 * Factory function to create config endpoint.
 */
export function createConfigEndpoint(configService: ConfigService): ConfigEndpoint {
  return new ConfigEndpoint(configService);
}
