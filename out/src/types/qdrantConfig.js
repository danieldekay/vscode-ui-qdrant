"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigChangeType = exports.ConnectionErrorCode = exports.ConnectionStatus = void 0;
exports.createDefaultConfig = createDefaultConfig;
exports.createConnectedConfig = createConnectedConfig;
exports.createErrorConfig = createErrorConfig;
exports.createConnectionError = createConnectionError;
exports.isConnected = isConnected;
exports.hasError = hasError;
exports.hasValidPath = hasValidPath;
/**
 * Status of the Qdrant database connection
 */
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["DISCONNECTED"] = "disconnected";
    ConnectionStatus["CONNECTING"] = "connecting";
    ConnectionStatus["CONNECTED"] = "connected";
    ConnectionStatus["ERROR"] = "error";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
/**
 * Enumeration of possible connection error codes
 */
var ConnectionErrorCode;
(function (ConnectionErrorCode) {
    ConnectionErrorCode["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
    ConnectionErrorCode["FILE_NOT_READABLE"] = "FILE_NOT_READABLE";
    ConnectionErrorCode["INVALID_DATABASE"] = "INVALID_DATABASE";
    ConnectionErrorCode["CORRUPTED_DATABASE"] = "CORRUPTED_DATABASE";
    ConnectionErrorCode["INCOMPATIBLE_VERSION"] = "INCOMPATIBLE_VERSION";
    ConnectionErrorCode["CONNECTION_TIMEOUT"] = "CONNECTION_TIMEOUT";
    ConnectionErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ConnectionErrorCode["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    ConnectionErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ConnectionErrorCode || (exports.ConnectionErrorCode = ConnectionErrorCode = {}));
/**
 * Types of configuration changes
 */
var ConfigChangeType;
(function (ConfigChangeType) {
    ConfigChangeType["PATH_CHANGED"] = "path_changed";
    ConfigChangeType["CONNECTED"] = "connected";
    ConfigChangeType["DISCONNECTED"] = "disconnected";
    ConfigChangeType["CONNECTION_ERROR"] = "connection_error";
    ConfigChangeType["RECONNECTED"] = "reconnected";
})(ConfigChangeType || (exports.ConfigChangeType = ConfigChangeType = {}));
/**
 * Factory function to create default Qdrant configuration
 */
function createDefaultConfig() {
    return {
        connectionStatus: ConnectionStatus.DISCONNECTED,
    };
}
/**
 * Factory function to create connected configuration
 */
function createConnectedConfig(localDbPath, connectionDetails) {
    return {
        localDbPath,
        connectionStatus: ConnectionStatus.CONNECTED,
        connectionDetails,
        lastConnectedAt: Date.now(),
    };
}
/**
 * Factory function to create error configuration
 */
function createErrorConfig(localDbPath, error) {
    return {
        localDbPath,
        connectionStatus: ConnectionStatus.ERROR,
        connectionError: error,
    };
}
/**
 * Factory function to create a connection error
 */
function createConnectionError(code, message, details, recoverable = true, recoveryAction) {
    return {
        code,
        message,
        details,
        timestamp: Date.now(),
        recoverable,
        recoveryAction,
    };
}
/**
 * Type guard to check if configuration is connected
 */
function isConnected(config) {
    return config.connectionStatus === ConnectionStatus.CONNECTED;
}
/**
 * Type guard to check if configuration has an error
 */
function hasError(config) {
    return config.connectionStatus === ConnectionStatus.ERROR;
}
/**
 * Type guard to check if configuration has a valid database path
 */
function hasValidPath(config) {
    return config.localDbPath !== undefined;
}
//# sourceMappingURL=qdrantConfig.js.map