"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEndpoint = void 0;
exports.createConfigEndpoint = createConfigEndpoint;
/**
 * Configuration API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for configuration operations
 * within the VS Code extension context.
 */
class ConfigEndpoint {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    /**
     * Get current configuration.
     *
     * @returns Current search configuration
     */
    getConfiguration() {
        return this.configService.getConfiguration();
    }
    /**
     * Update configuration.
     *
     * @param updates Configuration updates
     * @returns Success status
     */
    async updateConfiguration(updates) {
        return this.configService.updateConfiguration(updates);
    }
    /**
     * Get default search parameters.
     *
     * @returns Default search parameters
     */
    getDefaultSearchParameters() {
        return this.configService.getDefaultSearchParameters();
    }
    /**
     * Update default search parameters.
     *
     * @param parameters New default parameters
     * @returns Update result
     */
    async updateDefaultSearchParameters(parameters) {
        return this.configService.updateSearchParameters(parameters);
    }
    /**
     * Validate configuration.
     *
     * @param config Configuration to validate
     * @returns Validation result
     */
    validateConfiguration(config) {
        return this.configService.validateConfiguration(config);
    }
    /**
     * Reset configuration to defaults.
     */
    async resetToDefaults() {
        return this.configService.resetToDefaults();
    }
}
exports.ConfigEndpoint = ConfigEndpoint;
/**
 * Factory function to create config endpoint.
 */
function createConfigEndpoint(configService) {
    return new ConfigEndpoint(configService);
}
//# sourceMappingURL=config_endpoint.js.map