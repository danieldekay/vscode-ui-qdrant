"use strict";
/**
 * Comprehensive Qdrant Configuration
 *
 * Complete configuration interface for Qdrant connections with validation
 * and utility functions for configuration management in VSCode.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationSource = exports.DEFAULT_QDRANT_CONFIGURATION = void 0;
exports.createQdrantConfiguration = createQdrantConfiguration;
exports.validateQdrantConfiguration = validateQdrantConfiguration;
exports.mergeConfigurations = mergeConfigurations;
exports.configurationToUrl = configurationToUrl;
exports.configurationToConnectionOptions = configurationToConnectionOptions;
exports.areConfigurationsEqual = areConfigurationsEqual;
exports.sanitizeConfiguration = sanitizeConfiguration;
exports.getConfigurationDescription = getConfigurationDescription;
/**
 * Default Qdrant configuration values
 */
exports.DEFAULT_QDRANT_CONFIGURATION = {
    host: 'localhost',
    port: 6333,
    apiKey: '',
    useHttps: false,
    timeout: 5000,
    retryCount: 3,
    enabled: true,
    name: 'Default Configuration',
};
/**
 * Configuration source information
 */
var ConfigurationSource;
(function (ConfigurationSource) {
    /** Configuration from VSCode workspace settings */
    ConfigurationSource["WORKSPACE"] = "workspace";
    /** Configuration from VSCode global settings */
    ConfigurationSource["GLOBAL"] = "global";
    /** Configuration from environment variables */
    ConfigurationSource["ENVIRONMENT"] = "environment";
    /** Configuration from a file */
    ConfigurationSource["FILE"] = "file";
    /** Default configuration */
    ConfigurationSource["DEFAULT"] = "default";
})(ConfigurationSource || (exports.ConfigurationSource = ConfigurationSource = {}));
/**
 * Creates a QdrantConfiguration from partial data with defaults
 */
function createQdrantConfiguration(partial) {
    return {
        ...exports.DEFAULT_QDRANT_CONFIGURATION,
        ...partial,
    };
}
/**
 * Validates a QdrantConfiguration
 */
function validateQdrantConfiguration(config) {
    const errors = [];
    const warnings = [];
    // Host validation
    if (!config.host || typeof config.host !== 'string' || config.host.trim().length === 0) {
        errors.push('Host is required and must be a non-empty string');
    }
    else if (!/^[\w.-]+$/.test(config.host)) {
        errors.push('Host contains invalid characters (only letters, numbers, dots, hyphens, and underscores allowed)');
    }
    else if (config.host.length > 253) {
        errors.push('Host name is too long (maximum 253 characters)');
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
    else if (config.port < 1024 && config.port !== 6333) {
        warnings.push('Using a port below 1024 may require administrator privileges');
    }
    // API key validation
    if (config.apiKey !== undefined && typeof config.apiKey !== 'string') {
        errors.push('API key must be a string');
    }
    // HTTPS validation
    if (config.useHttps !== undefined && typeof config.useHttps !== 'boolean') {
        errors.push('useHttps must be a boolean');
    }
    // Timeout validation
    if (config.timeout !== undefined) {
        if (typeof config.timeout !== 'number' || !Number.isInteger(config.timeout)) {
            errors.push('Timeout must be an integer');
        }
        else if (config.timeout <= 0) {
            errors.push('Timeout must be a positive number');
        }
        else if (config.timeout > 300000) {
            // 5 minutes
            warnings.push('Timeout is very high (over 5 minutes)');
        }
        else if (config.timeout < 1000) {
            // 1 second
            warnings.push('Timeout is very low (under 1 second)');
        }
    }
    // Retry count validation
    if (config.retryCount !== undefined) {
        if (typeof config.retryCount !== 'number' || !Number.isInteger(config.retryCount)) {
            errors.push('Retry count must be an integer');
        }
        else if (config.retryCount < 0) {
            errors.push('Retry count cannot be negative');
        }
        else if (config.retryCount > 10) {
            errors.push('Retry count cannot exceed 10');
        }
        else if (config.retryCount > 5) {
            warnings.push('High retry count may cause delays');
        }
    }
    // Enabled validation
    if (config.enabled !== undefined && typeof config.enabled !== 'boolean') {
        errors.push('Enabled must be a boolean');
    }
    // Name validation
    if (config.name !== undefined) {
        if (typeof config.name !== 'string') {
            errors.push('Configuration name must be a string');
        }
        else if (config.name.trim().length === 0) {
            errors.push('Configuration name cannot be empty');
        }
        else if (config.name.length > 100) {
            errors.push('Configuration name is too long (maximum 100 characters)');
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Merges multiple configuration sources with priority
 */
function mergeConfigurations(configs) {
    // Priority order: workspace > global > environment > file > default
    const priorityOrder = [
        ConfigurationSource.WORKSPACE,
        ConfigurationSource.GLOBAL,
        ConfigurationSource.ENVIRONMENT,
        ConfigurationSource.FILE,
        ConfigurationSource.DEFAULT,
    ];
    const sortedConfigs = configs.sort((a, b) => {
        const aPriority = priorityOrder.indexOf(a.source);
        const bPriority = priorityOrder.indexOf(b.source);
        return aPriority - bPriority;
    });
    let merged = { ...exports.DEFAULT_QDRANT_CONFIGURATION };
    for (const sourcedConfig of sortedConfigs) {
        merged = { ...merged, ...sourcedConfig.config };
    }
    return merged;
}
/**
 * Converts QdrantConfiguration to URL format
 */
function configurationToUrl(config) {
    const protocol = config.useHttps ? 'https' : 'http';
    return `${protocol}://${config.host}:${config.port}`;
}
/**
 * Converts QdrantConfiguration to connection options
 */
function configurationToConnectionOptions(config) {
    return {
        url: configurationToUrl(config),
        apiKey: config.apiKey || undefined,
        timeout: config.timeout || exports.DEFAULT_QDRANT_CONFIGURATION.timeout,
        retryCount: config.retryCount || exports.DEFAULT_QDRANT_CONFIGURATION.retryCount,
    };
}
/**
 * Checks if two configurations are equivalent
 */
function areConfigurationsEqual(config1, config2) {
    const keys = [
        'host',
        'port',
        'apiKey',
        'useHttps',
        'timeout',
        'retryCount',
        'enabled',
        'name',
    ];
    for (const key of keys) {
        if (config1[key] !== config2[key]) {
            return false;
        }
    }
    return true;
}
function sanitizeConfiguration(config) {
    const { apiKey: _apiKey, ...sanitized } = config;
    return sanitized;
}
/**
 * Gets a user-friendly description of the configuration
 */
function getConfigurationDescription(config) {
    const name = config.name || 'Unnamed Configuration';
    const url = configurationToUrl(config);
    const auth = config.apiKey ? ' (with authentication)' : '';
    return `${name}: ${url}${auth}`;
}
//# sourceMappingURL=qdrant-configuration.js.map