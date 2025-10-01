import * as vscode from 'vscode';
import type { ValidationError, ValidationWarning } from '../types/fileValidation';
import type { ConnectionError } from '../types/qdrantConfig';

/**
 * Handles file-related errors and displays appropriate user notifications
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 */
export function handleFileError(error: unknown, context?: string): void {
  const errorMessage = formatFileError(error, context);

  vscode.window
    .showErrorMessage(
      `Qdrant Database Error: ${errorMessage}`,
      'Retry',
      'Open Settings',
      'View Logs',
    )
    .then((selection) => {
      switch (selection) {
        case 'Retry':
          // Could emit an event to retry the operation
          vscode.commands.executeCommand('qdrant.retryLastOperation');
          break;
        case 'Open Settings':
          vscode.commands.executeCommand('workbench.action.openSettings', 'qdrant');
          break;
        case 'View Logs':
          vscode.commands.executeCommand('qdrant.showLogs');
          break;
      }
    });
}

/**
 * Handles validation errors with appropriate user feedback
 * @param errors - Array of validation errors
 * @param warnings - Array of validation warnings
 */
export function handleValidationErrors(
  errors: ValidationError[],
  warnings: ValidationWarning[] = [],
): void {
  if (errors.length > 0) {
    // Show the first error as a notification
    const primaryError = errors[0];
    const errorMessage = `${primaryError.message}${primaryError.suggestion ? ` ${primaryError.suggestion}` : ''}`;

    vscode.window
      .showErrorMessage(`Database Validation Failed: ${errorMessage}`, 'Show Details', 'Retry')
      .then((selection) => {
        if (selection === 'Show Details') {
          showValidationDetails(errors, warnings);
        } else if (selection === 'Retry') {
          vscode.commands.executeCommand('qdrant.retryValidation');
        }
      });
  } else if (warnings.length > 0) {
    // Show warnings as information
    const warningMessage = `Database validation completed with ${warnings.length} warning(s)`;
    vscode.window.showWarningMessage(warningMessage, 'Show Details').then((selection) => {
      if (selection === 'Show Details') {
        showValidationDetails([], warnings);
      }
    });
  }
}

/**
 * Handles connection errors with appropriate user feedback
 * @param error - Connection error details
 */
export function handleConnectionError(error: ConnectionError): void {
  const message = `${error.message}${error.recoveryAction ? ` ${error.recoveryAction}` : ''}`;

  vscode.window
    .showErrorMessage(
      `Connection Failed: ${message}`,
      ...(error.recoverable ? ['Retry'] : []),
      'Show Details',
      'Open Settings',
    )
    .then((selection) => {
      switch (selection) {
        case 'Retry':
          vscode.commands.executeCommand('qdrant.retryConnection');
          break;
        case 'Show Details':
          showConnectionErrorDetails(error);
          break;
        case 'Open Settings':
          vscode.commands.executeCommand('workbench.action.openSettings', 'qdrant');
          break;
      }
    });
}

/**
 * Shows detailed validation results in a VS Code information message or webview
 * @param errors - Validation errors
 * @param warnings - Validation warnings
 */
export function showValidationDetails(
  errors: ValidationError[],
  warnings: ValidationWarning[] = [],
): void {
  const details: string[] = [];

  if (errors.length > 0) {
    details.push('**Errors:**');
    errors.forEach((error, index) => {
      details.push(`${index + 1}. ${error.message}`);
      if (error.details) details.push(`   ${error.details}`);
      if (error.suggestion) details.push(`   Suggestion: ${error.suggestion}`);
    });
  }

  if (warnings.length > 0) {
    if (details.length > 0) details.push('');
    details.push('**Warnings:**');
    warnings.forEach((warning, index) => {
      details.push(`${index + 1}. ${warning.message}`);
      if (warning.details) details.push(`   ${warning.details}`);
      if (warning.suggestion) details.push(`   Suggestion: ${warning.suggestion}`);
    });
  }

  const content = details.join('\n');

  // Show in information message if short, otherwise in output channel
  if (content.length < 1000) {
    vscode.window.showInformationMessage('Validation Details', {
      detail: content,
      modal: false,
    });
  } else {
    const channel = vscode.window.createOutputChannel('Qdrant Validation');
    channel.clear();
    channel.appendLine('Validation Results:');
    channel.appendLine(content);
    channel.show();
  }
}

/**
 * Shows detailed connection error information
 * @param error - Connection error details
 */
export function showConnectionErrorDetails(error: ConnectionError): void {
  const details = [
    `Error Code: ${error.code}`,
    `Message: ${error.message}`,
    `Timestamp: ${new Date(error.timestamp).toLocaleString()}`,
    `Recoverable: ${error.recoverable ? 'Yes' : 'No'}`,
  ];

  if (error.details) {
    details.push(`Details: ${error.details}`);
  }

  if (error.recoveryAction) {
    details.push(`Recovery Action: ${error.recoveryAction}`);
  }

  const content = details.join('\n');

  vscode.window.showInformationMessage('Connection Error Details', {
    detail: content,
    modal: false,
  });
}

/**
 * Formats an unknown error into a user-friendly string
 * @param error - The error to format
 * @param context - Additional context
 * @returns Formatted error message
 */
export function formatFileError(error: unknown, context?: string): string {
  let message = 'Unknown error occurred';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    // Try to extract message from error object
    const errorObj = error as any;
    message = errorObj.message || errorObj.toString() || 'Object thrown as error';
  }

  if (context) {
    message = `${context}: ${message}`;
  }

  return message;
}

/**
 * Logs an error to the VS Code output channel
 * @param error - Error to log
 * @param context - Additional context
 */
export function logError(error: unknown, context?: string): void {
  const channel = vscode.window.createOutputChannel('Qdrant Extension');
  const timestamp = new Date().toISOString();
  const message = formatFileError(error, context);

  channel.appendLine(`[${timestamp}] ERROR: ${message}`);

  // Also log to console for debugging
  console.error('[Qdrant Extension]', message, error);
}

/**
 * Creates a user-friendly error message from a technical error
 * @param technicalError - Technical error details
 * @returns User-friendly error message
 */
export function createUserFriendlyMessage(technicalError: string): string {
  // Map technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    ENOENT: 'File or directory not found',
    EACCES: 'Permission denied - cannot access the file',
    EISDIR: 'Expected a file but found a directory',
    ENOTDIR: 'Expected a directory but found a file',
    EMFILE: 'Too many open files',
    ENFILE: 'File system limit reached',
    EROFS: 'File system is read-only',
    ENOSPC: 'No space left on device',
    ECONNREFUSED: 'Connection refused by server',
    ECONNRESET: 'Connection reset by server',
    ETIMEDOUT: 'Connection timed out',
    ENOTFOUND: 'Host not found',
  };

  return errorMappings[technicalError] || technicalError;
}

/**
 * Determines if an error is recoverable and the operation can be retried
 * @param error - The error to check
 * @returns true if the error is recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network-related errors are often recoverable
    if (
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('network') ||
      message.includes('temporary')
    ) {
      return true;
    }

    // Permission errors might be recoverable if user can fix them
    if (message.includes('permission') || message.includes('access')) {
      return true;
    }

    // File not found might be recoverable if path changes
    if (message.includes('not found') || message.includes('enoent')) {
      return true;
    }
  }

  return false;
}
