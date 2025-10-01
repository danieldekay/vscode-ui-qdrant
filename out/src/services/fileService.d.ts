import * as vscode from 'vscode';
import { type FileValidationResult } from '../types/fileValidation';
/**
 * Service for validating Qdrant database files
 */
export declare class FileService {
    /**
     * Validates a Qdrant database file at the given path
     * @param fileUri - VS Code URI pointing to the file to validate
     * @returns Promise resolving to validation result
     */
    static validateQdrantFile(fileUri: vscode.Uri): Promise<FileValidationResult>;
    /**
     * Creates a validation result from components
     */
    private static createResult;
    /**
     * Checks if the file path is valid
     */
    private static isValidFilePath;
    /**
     * Safely gets file statistics using VS Code workspace.fs
     */
    private static safeStat;
    /**
     * Checks file permissions
     */
    private static checkPermissions;
    /**
     * Checks if file has a valid Qdrant database extension
     */
    private static hasValidExtension;
    /**
     * Reads the first N bytes of a file for header validation
     */
    private static readFileHeader;
}
//# sourceMappingURL=fileService.d.ts.map