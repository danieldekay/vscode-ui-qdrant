import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { DatabaseFile, FilePermissions } from '../types/databaseFile';
import { createDatabaseFile } from '../types/databaseFile';
import {
  createInvalidResult,
  createValidationError,
  createValidationWarning,
  createValidResult,
  FileSystemCheck,
  type FileValidationResult,
  type ValidationError,
  ValidationErrorCode,
  type ValidationMetadata,
  ValidationRule,
  type ValidationWarning,
  ValidationWarningCode,
} from '../types/fileValidation';

/**
 * Service for validating Qdrant database files
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a utility class with static methods
export class FileService {
  /**
   * Validates a Qdrant database file at the given path
   * @param fileUri - VS Code URI pointing to the file to validate
   * @returns Promise resolving to validation result
   */
  static async validateQdrantFile(fileUri: vscode.Uri): Promise<FileValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const rulesChecked: ValidationRule[] = [];
    const fsChecks: FileSystemCheck[] = [];

    try {
      // Create database file object
      const databaseFile = createDatabaseFile(fileUri);

      // 1. Check if path is valid
      rulesChecked.push(ValidationRule.VALID_PATH);
      if (!FileService.isValidFilePath(fileUri)) {
        errors.push(
          createValidationError(
            ValidationErrorCode.INVALID_PATH,
            'Invalid file path provided',
            `Path: ${fileUri.fsPath}`,
          ),
        );
      }

      // 2. Check if file exists
      rulesChecked.push(ValidationRule.FILE_EXISTS);
      fsChecks.push(FileSystemCheck.STAT_CHECK);
      const stat = await FileService.safeStat(fileUri);
      if (!stat) {
        errors.push(
          createValidationError(
            ValidationErrorCode.FILE_NOT_FOUND,
            'File does not exist',
            `Path: ${fileUri.fsPath}`,
          ),
        );
        return FileService.createResult(
          databaseFile,
          errors,
          warnings,
          rulesChecked,
          fsChecks,
          startTime,
        );
      }

      // Update file metadata
      databaseFile.size = stat.size;
      databaseFile.lastModified = stat.mtime;
      databaseFile.exists = true;

      // 3. Check file permissions
      rulesChecked.push(ValidationRule.SUFFICIENT_PERMISSIONS);
      fsChecks.push(FileSystemCheck.PERMISSION_CHECK);
      const permissions = await FileService.checkPermissions(fileUri);
      databaseFile.permissions = permissions;

      if (!permissions.readable) {
        errors.push(
          createValidationError(
            ValidationErrorCode.FILE_NOT_READABLE,
            'File is not readable',
            'Check file permissions',
          ),
        );
      }

      if (!permissions.writable) {
        warnings.push(
          createValidationWarning(
            ValidationWarningCode.SLOW_ACCESS_TIME,
            'File is not writable',
            'Some operations may fail',
          ),
        );
      }

      // 4. Check file size
      rulesChecked.push(ValidationRule.REASONABLE_SIZE);
      if (stat.size === 0) {
        errors.push(
          createValidationError(
            ValidationErrorCode.INVALID_FILE_FORMAT,
            'File is empty',
            'Qdrant database files must contain data',
          ),
        );
      } else if (stat.size > 10 * 1024 * 1024 * 1024) {
        // 10GB
        warnings.push(
          createValidationWarning(
            ValidationWarningCode.FILE_SIZE_LARGE,
            'File is very large',
            `Size: ${(stat.size / (1024 * 1024 * 1024)).toFixed(2)} GB`,
            'Large files may impact performance',
          ),
        );
      }

      // 5. Basic format validation (check file extension and basic structure)
      rulesChecked.push(ValidationRule.VALID_FORMAT);
      fsChecks.push(FileSystemCheck.FORMAT_DETECTION);
      if (!FileService.hasValidExtension(fileUri)) {
        warnings.push(
          createValidationWarning(
            ValidationWarningCode.MISSING_METADATA,
            'File does not have standard Qdrant extension',
            `Expected .db or similar, got: ${path.extname(fileUri.fsPath)}`,
            'Ensure this is a valid Qdrant database file',
          ),
        );
      }

      // 6. Integrity check (basic - can be enhanced later)
      rulesChecked.push(ValidationRule.NOT_CORRUPTED);
      fsChecks.push(FileSystemCheck.INTEGRITY_CHECK);
      // For now, just check if we can read the first few bytes
      try {
        const header = await FileService.readFileHeader(fileUri, 64);
        if (header.length === 0) {
          errors.push(
            createValidationError(
              ValidationErrorCode.CORRUPTED_DATABASE,
              'Cannot read file header',
              'File may be corrupted or inaccessible',
            ),
          );
        }
      } catch (error) {
        errors.push(
          createValidationError(
            ValidationErrorCode.CORRUPTED_DATABASE,
            'Failed to read file header',
            error instanceof Error ? error.message : 'Unknown error',
          ),
        );
      }

      return FileService.createResult(
        databaseFile,
        errors,
        warnings,
        rulesChecked,
        fsChecks,
        startTime,
      );
    } catch (error) {
      // Handle unexpected errors
      const unexpectedError = createValidationError(
        ValidationErrorCode.UNKNOWN_ERROR,
        'Unexpected error during validation',
        error instanceof Error ? error.message : 'Unknown error',
      );
      const databaseFile = createDatabaseFile(fileUri);
      return FileService.createResult(
        databaseFile,
        [unexpectedError],
        warnings,
        rulesChecked,
        fsChecks,
        startTime,
      );
    }
  }

  /**
   * Creates a validation result from components
   */
  private static createResult(
    file: DatabaseFile,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    rulesChecked: ValidationRule[],
    fsChecks: FileSystemCheck[],
    startTime: number,
  ): FileValidationResult {
    const metadata: ValidationMetadata = {
      validatedAt: Date.now(),
      duration: Date.now() - startTime,
      rulesChecked,
      fsChecks,
    };

    if (errors.length > 0) {
      return createInvalidResult(file, errors, warnings, metadata);
    } else {
      return createValidResult(file, metadata);
    }
  }

  /**
   * Checks if the file path is valid
   */
  private static isValidFilePath(uri: vscode.Uri): boolean {
    try {
      const fsPath = uri.fsPath;
      return fsPath.length > 0 && path.isAbsolute(fsPath);
    } catch {
      return false;
    }
  }

  /**
   * Safely gets file statistics using VS Code workspace.fs
   */
  private static async safeStat(uri: vscode.Uri): Promise<vscode.FileStat | null> {
    try {
      return await vscode.workspace.fs.stat(uri);
    } catch {
      return null;
    }
  }

  /**
   * Checks file permissions
   */
  private static async checkPermissions(uri: vscode.Uri): Promise<FilePermissions> {
    const fsPath = uri.fsPath;
    let readable = false;
    let writable = false;
    const executable = false;

    try {
      // Check readability
      await fs.promises.access(fsPath, fs.constants.R_OK);
      readable = true;
    } catch {
      readable = false;
    }

    try {
      // Check writability
      await fs.promises.access(fsPath, fs.constants.W_OK);
      writable = true;
    } catch {
      writable = false;
    }

    // Executable permission is rarely needed for database files

    return { readable, writable, executable };
  }

  /**
   * Checks if file has a valid Qdrant database extension
   */
  private static hasValidExtension(uri: vscode.Uri): boolean {
    const ext = path.extname(uri.fsPath).toLowerCase();
    // Qdrant typically uses .db or no extension, but we'll be permissive
    return ext === '.db' || ext === '' || ext === '.sqlite' || ext === '.sqlite3';
  }

  /**
   * Enhanced validation with improved error messaging and quick actions
   * @param filePath - Absolute path to the file to validate
   * @returns Promise resolving to enhanced validation result
   */
  static async validateQdrantFileEnhanced(
    filePath: string,
  ): Promise<import('../types/enhancedValidation').EnhancedValidationResult> {
    const startTime = Date.now();
    const fileUri = vscode.Uri.file(filePath);

    // First perform basic validation
    const basicResult = await FileService.validateQdrantFile(fileUri);

    // Enhanced error processing
    // For now, create simple implementations until modules are available
    const quickActions: any[] = [];

    // Create layered error messages
    let layeredMessages: any;
    if (basicResult.errors.length > 0) {
      layeredMessages = {
        simple: 'Database validation failed',
        detailed: basicResult.errors[0].message,
        technical: `Validation error: ${basicResult.errors[0].code}`,
      };
    } else {
      layeredMessages = {
        simple: 'Database file is valid',
        detailed: 'All validation checks passed successfully',
        technical: `Validation completed in ${Date.now() - startTime}ms`,
      };
    } // Generate suggestions based on errors and warnings
    const suggestions = basicResult.errors.map((error) => ({
      suggestionId: `error-${error.code}`,
      title: 'Fix validation error',
      description: error.suggestion || 'See error details for more information',
      actionType: 'FILE_SYSTEM',
      priority: 'HIGH',
      estimatedEffort: 'LOW',
      prerequisites: [],
      relatedActions: [],
    }));

    return {
      basicResult,
      simpleMessage: layeredMessages.simple,
      technicalDetails: layeredMessages.technical,
      remediationSuggestions: suggestions as any,
      quickActions,
      validationLevel: 'COMPREHENSIVE' as any,
      performanceMetrics: {
        validationDuration: Date.now() - startTime,
        bytesRead: 0,
        checksPerformed: basicResult.metadata.rulesChecked.length,
        memoryUsage: 0,
      },
    };
  }

  /**
   * Reads the first N bytes of a file for header validation
   */
  private static async readFileHeader(uri: vscode.Uri, bytes: number): Promise<Uint8Array> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      return content.slice(0, Math.min(bytes, content.length));
    } catch {
      return new Uint8Array(0);
    }
  }
}
