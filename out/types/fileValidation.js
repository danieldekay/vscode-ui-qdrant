"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemCheck = exports.ValidationRule = exports.ValidationWarningCode = exports.ValidationErrorCode = void 0;
exports.createValidResult = createValidResult;
exports.createInvalidResult = createInvalidResult;
exports.createValidationError = createValidationError;
exports.createValidationWarning = createValidationWarning;
exports.isValidResult = isValidResult;
exports.hasWarnings = hasWarnings;
/**
 * Enumeration of possible validation error codes
 */
var ValidationErrorCode;
(function (ValidationErrorCode) {
    ValidationErrorCode["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
    ValidationErrorCode["FILE_NOT_READABLE"] = "FILE_NOT_READABLE";
    ValidationErrorCode["FILE_NOT_WRITABLE"] = "FILE_NOT_WRITABLE";
    ValidationErrorCode["INVALID_FILE_FORMAT"] = "INVALID_FILE_FORMAT";
    ValidationErrorCode["CORRUPTED_DATABASE"] = "CORRUPTED_DATABASE";
    ValidationErrorCode["INCOMPATIBLE_VERSION"] = "INCOMPATIBLE_VERSION";
    ValidationErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    ValidationErrorCode["FILE_TOO_LARGE"] = "FILE_TOO_LARGE";
    ValidationErrorCode["INVALID_PATH"] = "INVALID_PATH";
    ValidationErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ValidationErrorCode || (exports.ValidationErrorCode = ValidationErrorCode = {}));
/**
 * Enumeration of possible validation warning codes
 */
var ValidationWarningCode;
(function (ValidationWarningCode) {
    ValidationWarningCode["FILE_SIZE_LARGE"] = "FILE_SIZE_LARGE";
    ValidationWarningCode["OLD_DATABASE_VERSION"] = "OLD_DATABASE_VERSION";
    ValidationWarningCode["SLOW_ACCESS_TIME"] = "SLOW_ACCESS_TIME";
    ValidationWarningCode["UNOPTIMIZED_STORAGE"] = "UNOPTIMIZED_STORAGE";
    ValidationWarningCode["MISSING_METADATA"] = "MISSING_METADATA";
})(ValidationWarningCode || (exports.ValidationWarningCode = ValidationWarningCode = {}));
/**
 * Validation rules that can be checked
 */
var ValidationRule;
(function (ValidationRule) {
    ValidationRule["FILE_EXISTS"] = "FILE_EXISTS";
    ValidationRule["FILE_READABLE"] = "FILE_READABLE";
    ValidationRule["FILE_WRITABLE"] = "FILE_WRITABLE";
    ValidationRule["VALID_FORMAT"] = "VALID_FORMAT";
    ValidationRule["NOT_CORRUPTED"] = "NOT_CORRUPTED";
    ValidationRule["COMPATIBLE_VERSION"] = "COMPATIBLE_VERSION";
    ValidationRule["SUFFICIENT_PERMISSIONS"] = "SUFFICIENT_PERMISSIONS";
    ValidationRule["REASONABLE_SIZE"] = "REASONABLE_SIZE";
    ValidationRule["VALID_PATH"] = "VALID_PATH";
})(ValidationRule || (exports.ValidationRule = ValidationRule = {}));
/**
 * File system checks performed during validation
 */
var FileSystemCheck;
(function (FileSystemCheck) {
    FileSystemCheck["STAT_CHECK"] = "STAT_CHECK";
    FileSystemCheck["PERMISSION_CHECK"] = "PERMISSION_CHECK";
    FileSystemCheck["FORMAT_DETECTION"] = "FORMAT_DETECTION";
    FileSystemCheck["INTEGRITY_CHECK"] = "INTEGRITY_CHECK";
    FileSystemCheck["METADATA_EXTRACTION"] = "METADATA_EXTRACTION";
})(FileSystemCheck || (exports.FileSystemCheck = FileSystemCheck = {}));
/**
 * Factory function to create a successful validation result
 */
function createValidResult(file, metadata) {
    return {
        isValid: true,
        file,
        errors: [],
        warnings: [],
        metadata,
    };
}
/**
 * Factory function to create a failed validation result
 */
function createInvalidResult(file, errors, warnings = [], metadata) {
    return {
        isValid: false,
        file,
        errors,
        warnings,
        metadata,
    };
}
/**
 * Factory function to create a validation error
 */
function createValidationError(code, message, details, suggestion) {
    return {
        code,
        message,
        severity: 'error',
        details,
        suggestion,
    };
}
/**
 * Factory function to create a validation warning
 */
function createValidationWarning(code, message, details, suggestion) {
    return {
        code,
        message,
        severity: 'warning',
        details,
        suggestion,
    };
}
/**
 * Type guard to check if a result is valid
 */
function isValidResult(result) {
    return result.isValid && result.errors.length === 0;
}
/**
 * Type guard to check if a result has warnings
 */
function hasWarnings(result) {
    return result.warnings.length > 0;
}
//# sourceMappingURL=fileValidation.js.map