import type { DatabaseFile } from './databaseFile';
/**
 * Result of validating a Qdrant database file
 */
export interface FileValidationResult {
    /** Whether the file passed all validation checks */
    isValid: boolean;
    /** The database file that was validated */
    file: DatabaseFile;
    /** List of validation errors (empty if valid) */
    errors: ValidationError[];
    /** List of validation warnings (non-blocking issues) */
    warnings: ValidationWarning[];
    /** Validation metadata */
    metadata: ValidationMetadata;
}
/**
 * A validation error that prevents file usage
 */
export interface ValidationError {
    /** Error code for programmatic handling */
    code: ValidationErrorCode;
    /** Human-readable error message */
    message: string;
    /** Severity level */
    severity: 'error';
    /** Additional context or details */
    details?: string;
    /** Suggested fix if available */
    suggestion?: string;
}
/**
 * A validation warning that doesn't prevent file usage
 */
export interface ValidationWarning {
    /** Warning code for programmatic handling */
    code: ValidationWarningCode;
    /** Human-readable warning message */
    message: string;
    /** Severity level */
    severity: 'warning';
    /** Additional context or details */
    details?: string;
    /** Suggested improvement if available */
    suggestion?: string;
}
/**
 * Metadata about the validation process
 */
export interface ValidationMetadata {
    /** Timestamp when validation was performed */
    validatedAt: number;
    /** Time taken to perform validation (ms) */
    duration: number;
    /** Validation rules that were checked */
    rulesChecked: ValidationRule[];
    /** File system checks performed */
    fsChecks: FileSystemCheck[];
}
/**
 * Enumeration of possible validation error codes
 */
export declare enum ValidationErrorCode {
    FILE_NOT_FOUND = "FILE_NOT_FOUND",
    FILE_NOT_READABLE = "FILE_NOT_READABLE",
    FILE_NOT_WRITABLE = "FILE_NOT_WRITABLE",
    INVALID_FILE_FORMAT = "INVALID_FILE_FORMAT",
    CORRUPTED_DATABASE = "CORRUPTED_DATABASE",
    INCOMPATIBLE_VERSION = "INCOMPATIBLE_VERSION",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    FILE_TOO_LARGE = "FILE_TOO_LARGE",
    INVALID_PATH = "INVALID_PATH",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
/**
 * Enumeration of possible validation warning codes
 */
export declare enum ValidationWarningCode {
    FILE_SIZE_LARGE = "FILE_SIZE_LARGE",
    OLD_DATABASE_VERSION = "OLD_DATABASE_VERSION",
    SLOW_ACCESS_TIME = "SLOW_ACCESS_TIME",
    UNOPTIMIZED_STORAGE = "UNOPTIMIZED_STORAGE",
    MISSING_METADATA = "MISSING_METADATA"
}
/**
 * Validation rules that can be checked
 */
export declare enum ValidationRule {
    FILE_EXISTS = "FILE_EXISTS",
    FILE_READABLE = "FILE_READABLE",
    FILE_WRITABLE = "FILE_WRITABLE",
    VALID_FORMAT = "VALID_FORMAT",
    NOT_CORRUPTED = "NOT_CORRUPTED",
    COMPATIBLE_VERSION = "COMPATIBLE_VERSION",
    SUFFICIENT_PERMISSIONS = "SUFFICIENT_PERMISSIONS",
    REASONABLE_SIZE = "REASONABLE_SIZE",
    VALID_PATH = "VALID_PATH"
}
/**
 * File system checks performed during validation
 */
export declare enum FileSystemCheck {
    STAT_CHECK = "STAT_CHECK",
    PERMISSION_CHECK = "PERMISSION_CHECK",
    FORMAT_DETECTION = "FORMAT_DETECTION",
    INTEGRITY_CHECK = "INTEGRITY_CHECK",
    METADATA_EXTRACTION = "METADATA_EXTRACTION"
}
/**
 * Factory function to create a successful validation result
 */
export declare function createValidResult(file: DatabaseFile, metadata: ValidationMetadata): FileValidationResult;
/**
 * Factory function to create a failed validation result
 */
export declare function createInvalidResult(file: DatabaseFile, errors: ValidationError[], warnings: ValidationWarning[] | undefined, metadata: ValidationMetadata): FileValidationResult;
/**
 * Factory function to create a validation error
 */
export declare function createValidationError(code: ValidationErrorCode, message: string, details?: string, suggestion?: string): ValidationError;
/**
 * Factory function to create a validation warning
 */
export declare function createValidationWarning(code: ValidationWarningCode, message: string, details?: string, suggestion?: string): ValidationWarning;
/**
 * Type guard to check if a result is valid
 */
export declare function isValidResult(result: FileValidationResult): boolean;
/**
 * Type guard to check if a result has warnings
 */
export declare function hasWarnings(result: FileValidationResult): boolean;
//# sourceMappingURL=fileValidation.d.ts.map