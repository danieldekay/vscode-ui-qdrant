import * as vscode from 'vscode';
/**
 * Validates that a file path is well-formed and safe to use
 * @param fileUri - VS Code URI to validate
 * @returns true if the path is valid, false otherwise
 */
export declare function validateFilePath(fileUri: vscode.Uri): boolean;
/**
 * Checks if a file has a valid Qdrant database file extension
 * @param fileUri - VS Code URI to check
 * @returns true if the file has a valid extension
 */
export declare function hasValidQdrantExtension(fileUri: vscode.Uri): boolean;
/**
 * Validates that a file size is reasonable for a Qdrant database
 * @param sizeInBytes - File size in bytes
 * @returns true if the size is reasonable
 */
export declare function validateFileSize(sizeInBytes: number): boolean;
/**
 * Checks if a file size is considered large and might impact performance
 * @param sizeInBytes - File size in bytes
 * @returns true if the file is considered large
 */
export declare function isLargeFile(sizeInBytes: number): boolean;
/**
 * Validates that a file path points to a location that is writable
 * @param fileUri - VS Code URI to check
 * @returns Promise resolving to true if writable, false otherwise
 */
export declare function isWritablePath(fileUri: vscode.Uri): Promise<boolean>;
/**
 * Sanitizes a file path to prevent path traversal attacks
 * @param inputPath - Input path string
 * @param basePath - Base path to resolve against (optional)
 * @returns Sanitized path or null if invalid
 */
export declare function sanitizeFilePath(inputPath: string, basePath?: string): string | null;
/**
 * Gets a human-readable file size string
 * @param sizeInBytes - File size in bytes
 * @returns Human-readable size string
 */
export declare function formatFileSize(sizeInBytes: number): string;
/**
 * Checks if a path is within the VS Code workspace
 * @param fileUri - VS Code URI to check
 * @returns true if the path is within the workspace
 */
export declare function isWithinWorkspace(fileUri: vscode.Uri): boolean;
//# sourceMappingURL=fileValidators.d.ts.map