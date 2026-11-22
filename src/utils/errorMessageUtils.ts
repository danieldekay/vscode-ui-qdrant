import type { LayeredMessages } from '../types/enhancedValidation';
import type { ValidationError } from '../types/fileValidation';
import { ValidationErrorCode } from '../types/fileValidation';

/**
 * Utility class for creating enhanced error messages with layered detail levels
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Utility class with static methods
export class ErrorMessageUtils {
  /**
   * Creates layered error messages from validation error
   * @param primaryError - The main validation error
   * @param filePath - The file path where the error occurred
   * @param allErrors - All validation errors for context
   * @returns Layered messages with simple, detailed, and technical levels
   */
  static createLayeredMessages(
    primaryError: ValidationError,
    filePath: string,
    allErrors: ValidationError[],
  ): LayeredMessages {
    const simple = ErrorMessageUtils.createSimpleMessage(primaryError);
    const detailed = ErrorMessageUtils.createDetailedMessage(primaryError, filePath, allErrors);
    const technical = ErrorMessageUtils.createTechnicalMessage(primaryError, filePath, allErrors);

    return {
      simple,
      detailed,
      technical,
    };
  }

  /**
   * Creates a user-friendly simple error message
   */
  private static createSimpleMessage(error: ValidationError): string {
    switch (error.code) {
      case ValidationErrorCode.FILE_NOT_FOUND:
        return 'Database file not found';

      case ValidationErrorCode.FILE_NOT_READABLE:
        return 'Cannot read database file';

      case ValidationErrorCode.INSUFFICIENT_PERMISSIONS:
        return 'Permission denied';

      case ValidationErrorCode.INVALID_FILE_FORMAT:
        return 'Invalid database format';

      case ValidationErrorCode.CORRUPTED_DATABASE:
        return 'Database appears corrupted';

      case ValidationErrorCode.INCOMPATIBLE_VERSION:
        return 'Unsupported database version';

      case ValidationErrorCode.FILE_TOO_LARGE:
        return 'File too large';

      case ValidationErrorCode.INVALID_PATH:
        return 'Invalid file path';

      case ValidationErrorCode.FILE_NOT_WRITABLE:
        return 'Cannot write to file';

      default:
        return 'Database validation failed';
    }
  }

  /**
   * Creates a detailed error message with context
   */
  private static createDetailedMessage(
    error: ValidationError,
    filePath: string,
    allErrors: ValidationError[],
  ): string {
    const simple = ErrorMessageUtils.createSimpleMessage(error);
    const contextInfo = ErrorMessageUtils.getErrorContext(error, filePath, allErrors);

    return `${simple}. ${contextInfo}`;
  }

  /**
   * Creates a technical error message with full details
   */
  private static createTechnicalMessage(
    error: ValidationError,
    filePath: string,
    allErrors: ValidationError[],
  ): string {
    const errorCount = allErrors.length;

    let technical = `Error Code: ${error.code}`;
    technical += `\nFile: ${filePath}`;
    technical += `\nError: ${error.message}`;

    if (error.details) {
      technical += `\nDetails: ${error.details}`;
    }

    if (error.suggestion) {
      technical += `\nSuggestion: ${error.suggestion}`;
    }

    if (errorCount > 1) {
      technical += `\n\nTotal Issues: ${errorCount} error${errorCount > 1 ? 's' : ''}`;
    }

    return technical;
  }

  /**
   * Gets contextual information for the error
   */
  private static getErrorContext(
    error: ValidationError,
    filePath: string,
    _allErrors: ValidationError[],
  ): string {
    switch (error.code) {
      case ValidationErrorCode.FILE_NOT_FOUND:
        return `The file "${filePath}" does not exist. Check the file path and try again.`;

      case ValidationErrorCode.FILE_NOT_READABLE:
        return 'The file exists but cannot be read. Check file permissions and try again.';

      case ValidationErrorCode.INSUFFICIENT_PERMISSIONS:
        return 'You do not have permission to access this file. Check file permissions.';

      case ValidationErrorCode.INVALID_FILE_FORMAT:
        return 'The file does not appear to be a valid Qdrant database file.';

      case ValidationErrorCode.CORRUPTED_DATABASE:
        return 'The database file appears to be corrupted or incomplete.';

      case ValidationErrorCode.INCOMPATIBLE_VERSION:
        return 'This version of Qdrant database is not supported by the current extension.';

      case ValidationErrorCode.FILE_TOO_LARGE:
        return 'The database file is too large to process efficiently.';

      case ValidationErrorCode.INVALID_PATH:
        return 'The specified file path is invalid or malformed.';

      case ValidationErrorCode.FILE_NOT_WRITABLE:
        return 'Cannot write to this file. Check file permissions and disk space.';

      default:
        return 'An unexpected error occurred during validation.';
    }
  }

  /**
   * Creates a summary message for multiple errors
   */
  static createSummaryMessage(errors: ValidationError[]): string {
    const errorCount = errors.length;

    if (errorCount === 0) {
      return 'No errors found.';
    }

    return `${errorCount} error${errorCount > 1 ? 's' : ''} found.`;
  }
}
