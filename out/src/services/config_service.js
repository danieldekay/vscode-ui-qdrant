"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const vscode = __importStar(require("vscode"));
const search_config_1 = require("../models/search_config");
const search_parameters_1 = require("../models/search_parameters");
/**
 * Service for managing VS Code configuration settings for Qdrant.
 */
class ConfigService {
    static CONFIG_SECTION = 'qdrant';
    /**
     * Get the current Qdrant configuration from VS Code settings.
     */
    getConfiguration() {
        const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);
        const searchConfig = {
            host: config.get('connection.url', search_config_1.DEFAULT_SEARCH_CONFIG.host),
            port: config.get('connection.port', search_config_1.DEFAULT_SEARCH_CONFIG.port) || search_config_1.DEFAULT_SEARCH_CONFIG.port,
            apiKey: config.get('connection.apiKey', search_config_1.DEFAULT_SEARCH_CONFIG.apiKey),
            collection: config.get('collection.default', search_config_1.DEFAULT_SEARCH_CONFIG.collection),
            timeout: config.get('connection.timeout', search_config_1.DEFAULT_SEARCH_CONFIG.timeout),
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
    async updateConfiguration(updates) {
        try {
            const currentConfig = this.getConfiguration();
            const newConfig = { ...currentConfig, ...updates };
            if (!(0, search_config_1.validateSearchConfig)(newConfig)) {
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
                await config.update('connection.apiKey', updates.apiKey, vscode.ConfigurationTarget.Workspace);
            }
            if (updates.collection !== undefined) {
                await config.update('collection.default', updates.collection, vscode.ConfigurationTarget.Workspace);
            }
            if (updates.timeout !== undefined) {
                await config.update('connection.timeout', updates.timeout, vscode.ConfigurationTarget.Workspace);
            }
            return true;
        }
        catch (error) {
            console.error('Failed to update configuration:', error);
            return false;
        }
    }
    /**
     * Get default search parameters from VS Code settings.
     */
    getDefaultSearchParameters() {
        const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);
        const params = {
            similarityThreshold: config.get('search.default.scoreThreshold', search_parameters_1.DEFAULT_SEARCH_PARAMETERS.similarityThreshold),
            resultLimit: config.get('search.default.limit', search_parameters_1.DEFAULT_SEARCH_PARAMETERS.resultLimit),
            includePayload: config.get('search.default.withPayload', search_parameters_1.DEFAULT_SEARCH_PARAMETERS.includePayload),
            includeVector: config.get('search.default.withVector', search_parameters_1.DEFAULT_SEARCH_PARAMETERS.includeVector),
        };
        return params;
    }
    /**
     * Update default search parameters in VS Code settings.
     */
    async updateSearchParameters(parameters) {
        try {
            const currentParams = this.getDefaultSearchParameters();
            const newParams = { ...currentParams, ...parameters };
            if (!(0, search_parameters_1.validateSearchParameters)(newParams)) {
                return {
                    success: false,
                    validatedParameters: currentParams,
                };
            }
            const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);
            // Update each parameter
            if (parameters.similarityThreshold !== undefined) {
                await config.update('search.default.scoreThreshold', parameters.similarityThreshold, vscode.ConfigurationTarget.Workspace);
            }
            if (parameters.resultLimit !== undefined) {
                await config.update('search.default.limit', parameters.resultLimit, vscode.ConfigurationTarget.Workspace);
            }
            if (parameters.includePayload !== undefined) {
                await config.update('search.default.withPayload', parameters.includePayload, vscode.ConfigurationTarget.Workspace);
            }
            if (parameters.includeVector !== undefined) {
                await config.update('search.default.withVector', parameters.includeVector, vscode.ConfigurationTarget.Workspace);
            }
            return {
                success: true,
                validatedParameters: newParams,
            };
        }
        catch (error) {
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
    validateConfiguration(config) {
        const fullConfig = { ...this.getConfiguration(), ...config };
        if ((0, search_config_1.validateSearchConfig)(fullConfig)) {
            return { valid: true };
        }
        // Basic validation - could be enhanced
        const errors = [];
        if (config.host && (typeof config.host !== 'string' || config.host.trim() === '')) {
            errors.push('Invalid host format');
        }
        if (config.port &&
            (typeof config.port !== 'number' || config.port < 1 || config.port > 65535)) {
            errors.push('Port must be between 1 and 65535');
        }
        if (config.collection &&
            (typeof config.collection !== 'string' || config.collection.trim() === '')) {
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
    getDefaultConfiguration() {
        return { ...search_config_1.DEFAULT_SEARCH_CONFIG };
    }
    /**
     * Reset configuration to defaults.
     */
    async resetToDefaults() {
        const config = vscode.workspace.getConfiguration(ConfigService.CONFIG_SECTION);
        await config.update('connection.url', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('connection.port', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('connection.apiKey', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('connection.timeout', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('collection.default', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('search.default.limit', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('search.default.scoreThreshold', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('search.default.withPayload', undefined, vscode.ConfigurationTarget.Workspace);
        await config.update('search.default.withVector', undefined, vscode.ConfigurationTarget.Workspace);
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config_service.js.map