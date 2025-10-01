"use strict";
/**
 * Common types and enums used across the Qdrant VS Code extension
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSeverity = exports.FileOperation = exports.LogLevel = exports.DEFAULT_TIMEOUTS = void 0;
exports.success = success;
exports.failure = failure;
exports.isSuccess = isSuccess;
exports.isFailure = isFailure;
/**
 * Success result factory
 */
function success(data) {
    return { success: true, data };
}
/**
 * Error result factory
 */
function failure(error) {
    return { success: false, error };
}
/**
 * Type guard for successful results
 */
function isSuccess(result) {
    return result.success && result.data !== undefined;
}
/**
 * Type guard for failed results
 */
function isFailure(result) {
    return !result.success && result.error !== undefined;
}
/**
 * Default timeout configurations
 */
exports.DEFAULT_TIMEOUTS = {
    FILE_OPERATION: 5000, // 5 seconds
    DATABASE_CONNECTION: 10000, // 10 seconds
    VALIDATION: 3000, // 3 seconds
    CONFIG_UPDATE: 2000, // 2 seconds
};
/**
 * Logging levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * File operation types
 */
var FileOperation;
(function (FileOperation) {
    FileOperation["READ"] = "read";
    FileOperation["WRITE"] = "write";
    FileOperation["DELETE"] = "delete";
    FileOperation["RENAME"] = "rename";
    FileOperation["COPY"] = "copy";
    FileOperation["STAT"] = "stat";
})(FileOperation || (exports.FileOperation = FileOperation = {}));
/**
 * Validation severity levels
 */
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["ERROR"] = "error";
    ValidationSeverity["WARNING"] = "warning";
    ValidationSeverity["INFO"] = "info";
})(ValidationSeverity || (exports.ValidationSeverity = ValidationSeverity = {}));
//# sourceMappingURL=common.js.map