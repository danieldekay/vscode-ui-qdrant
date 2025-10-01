import type { SearchConfig } from '../models/search_config';
import type { SearchParameters } from '../models/search_parameters';
import type { ConfigService } from '../services/config_service';
/**
 * Configuration API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for configuration operations
 * within the VS Code extension context.
 */
export declare class ConfigEndpoint {
    private configService;
    constructor(configService: ConfigService);
    /**
     * Get current configuration.
     *
     * @returns Current search configuration
     */
    getConfiguration(): SearchConfig;
    /**
     * Update configuration.
     *
     * @param updates Configuration updates
     * @returns Success status
     */
    updateConfiguration(updates: Partial<SearchConfig>): Promise<boolean>;
    /**
     * Get default search parameters.
     *
     * @returns Default search parameters
     */
    getDefaultSearchParameters(): SearchParameters;
    /**
     * Update default search parameters.
     *
     * @param parameters New default parameters
     * @returns Update result
     */
    updateDefaultSearchParameters(parameters: Partial<SearchParameters>): Promise<{
        success: boolean;
        validatedParameters: SearchParameters;
    }>;
    /**
     * Validate configuration.
     *
     * @param config Configuration to validate
     * @returns Validation result
     */
    validateConfiguration(config: Partial<SearchConfig>): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Reset configuration to defaults.
     */
    resetToDefaults(): Promise<void>;
}
/**
 * Factory function to create config endpoint.
 */
export declare function createConfigEndpoint(configService: ConfigService): ConfigEndpoint;
//# sourceMappingURL=config_endpoint.d.ts.map