import type { ValidationError, ValidationWarning } from '../types/fileValidation';
import type { ConnectionError } from '../types/qdrantConfig';
/**
 * Handles file-related errors and displays appropriate user notifications
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 */
export declare function handleFileError(error: unknown, context?: string): void;
/**
 * Handles validation errors with appropriate user feedback
 * @param errors - Array of validation errors
 * @param warnings - Array of validation warnings
 */
export declare function handleValidationErrors(errors: ValidationError[], warnings?: ValidationWarning[]): void;
/**
 * Handles connection errors with appropriate user feedback
 * @param error - Connection error details
 */
export declare function handleConnectionError(error: ConnectionError): void;
/**
 * Shows detailed validation results in a VS Code information message or webview
 * @param errors - Validation errors
 * @param warnings - Validation warnings
 */
export declare function showValidationDetails(errors: ValidationError[], warnings?: ValidationWarning[]): void;
/**
 * Shows detailed connection error information
 * @param error - Connection error details
 */
export declare function showConnectionErrorDetails(error: ConnectionError): void;
/**
 * Formats an unknown error into a user-friendly string
 * @param error - The error to format
 * @param context - Additional context
 * @returns Formatted error message
 */
export declare function formatFileError(error: unknown, context?: string): string;
/**
 * Logs an error to the VS Code output channel
 * @param error - Error to log
 * @param context - Additional context
 */
export declare function logError(error: unknown, context?: string): void;
/**
 * Creates a user-friendly error message from a technical error
 * @param technicalError - Technical error details
 * @returns User-friendly error message
 */
export declare function createUserFriendlyMessage(technicalError: string): string;
/**
 * Determines if an error is recoverable and the operation can be retried
 * @param error - The error to check
 * @returns true if the error is recoverable
 */
export declare function isRecoverableError(error: unknown): boolean;
//# sourceMappingURL=errorHandling.d.ts.map