"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SEARCH_CONFIG = void 0;
exports.validateSearchConfig = validateSearchConfig;
/**
 * Default values for SearchConfig
 */
exports.DEFAULT_SEARCH_CONFIG = {
    host: 'localhost',
    port: 6333,
    collection: 'default',
    timeout: 30000,
};
/**
 * Validation rules for SearchConfig
 */
function validateSearchConfig(config) {
    // host must be a valid hostname or IP address
    if (!config.host || typeof config.host !== 'string' || config.host.trim() === '') {
        return false;
    }
    // port must be between 1 and 65535
    if (typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
        return false;
    }
    // collection must be a non-empty string
    if (!config.collection ||
        typeof config.collection !== 'string' ||
        config.collection.trim() === '') {
        return false;
    }
    // timeout must be > 0
    if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        return false;
    }
    // apiKey is optional but if present must be a string
    if (config.apiKey !== undefined && typeof config.apiKey !== 'string') {
        return false;
    }
    return true;
}
//# sourceMappingURL=search_config.js.map