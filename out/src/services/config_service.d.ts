import { type SearchConfig } from '../models/search_config';
import { type SearchParameters } from '../models/search_parameters';
/**
 * Service for managing VS Code configuration settings for Qdrant.
 */
export declare class ConfigService {
    private static readonly CONFIG_SECTION;
    /**
     * Get the current Qdrant configuration from VS Code settings.
     */
    getConfiguration(): SearchConfig;
    /**
     * Update the Qdrant configuration in VS Code settings.
     */
    updateConfiguration(updates: Partial<SearchConfig>): Promise<boolean>;
    /**
     * Get default search parameters from VS Code settings.
     */
    getDefaultSearchParameters(): SearchParameters;
    /**
     * Update default search parameters in VS Code settings.
     */
    updateSearchParameters(parameters: Partial<SearchParameters>): Promise<{
        success: boolean;
        validatedParameters: SearchParameters;
    }>;
    /**
     * Validate a configuration object.
     */
    validateConfiguration(config: Partial<SearchConfig>): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Get default configuration values.
     */
    getDefaultConfiguration(): SearchConfig;
    /**
     * Reset configuration to defaults.
     */
    resetToDefaults(): Promise<void>;
}
//# sourceMappingURL=config_service.d.ts.map