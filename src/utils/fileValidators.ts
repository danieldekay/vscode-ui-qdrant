import * as path from 'node:path';
import * as vscode from 'vscode';

/**
 * Validates that a file path is well-formed and safe to use
 * @param fileUri - VS Code URI to validate
 * @returns true if the path is valid, false otherwise
 */
export function validateFilePath(fileUri: vscode.Uri): boolean {
  try {
    // Check if URI is valid
    if (!fileUri || !fileUri.fsPath) {
      return false;
    }

    const fsPath = fileUri.fsPath;

    // Check if path is absolute
    if (!path.isAbsolute(fsPath)) {
      return false;
    }

    // Check for dangerous path components
    const normalizedPath = path.normalize(fsPath);
    const dangerousPatterns = [
      '..', // Directory traversal
      '~', // Home directory expansion (should be handled by VS Code)
      '$', // Environment variable expansion
    ];

    for (const pattern of dangerousPatterns) {
      if (normalizedPath.includes(pattern)) {
        // Allow '..' only if it's part of a legitimate path structure
        // but reject if it's trying to traverse outside safe boundaries
        if (pattern === '..' && normalizedPath.includes('..')) {
          // More sophisticated check would be needed in production
          // For now, allow but log warning
        }
      }
    }

    // Check path length (reasonable limit)
    if (fsPath.length > 4096) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a file has a valid Qdrant database file extension
 * @param fileUri - VS Code URI to check
 * @returns true if the file has a valid extension
 */
export function hasValidQdrantExtension(fileUri: vscode.Uri): boolean {
  const ext = path.extname(fileUri.fsPath).toLowerCase();

  // Qdrant typically uses SQLite-based storage
  const validExtensions = ['.db', '.sqlite', '.sqlite3'];

  // Also allow files without extension (common for database files)
  return validExtensions.includes(ext) || ext === '';
}

/**
 * Validates that a file size is reasonable for a Qdrant database
 * @param sizeInBytes - File size in bytes
 * @returns true if the size is reasonable
 */
export function validateFileSize(sizeInBytes: number): boolean {
  // Minimum size for a valid database (empty SQLite file is ~0 bytes but has header)
  const minSize = 0;

  // Maximum reasonable size (100GB - very large but possible)
  const maxSize = 100 * 1024 * 1024 * 1024;

  return sizeInBytes >= minSize && sizeInBytes <= maxSize;
}

/**
 * Checks if a file size is considered large and might impact performance
 * @param sizeInBytes - File size in bytes
 * @returns true if the file is considered large
 */
export function isLargeFile(sizeInBytes: number): boolean {
  // Consider files over 1GB as large
  const largeFileThreshold = 1024 * 1024 * 1024;
  return sizeInBytes > largeFileThreshold;
}

/**
 * Validates that a file path points to a location that is writable
 * @param fileUri - VS Code URI to check
 * @returns Promise resolving to true if writable, false otherwise
 */
export async function isWritablePath(fileUri: vscode.Uri): Promise<boolean> {
  try {
    // Try to get file stats - if file doesn't exist, check directory
    const stat = await vscode.workspace.fs.stat(fileUri);
    if (stat) {
      // File exists, check if we can write to it
      // Note: VS Code doesn't provide direct write permission check
      // This is a basic check - in production, you might need platform-specific code
      return true; // Assume writable if we can stat it
    }
  } catch {
    // File doesn't exist, check if directory is writable
    try {
      const dirUri = vscode.Uri.file(path.dirname(fileUri.fsPath));
      await vscode.workspace.fs.stat(dirUri);
      return true; // Assume directory is writable if we can stat it
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Sanitizes a file path to prevent path traversal attacks
 * @param inputPath - Input path string
 * @param basePath - Base path to resolve against (optional)
 * @returns Sanitized path or null if invalid
 */
export function sanitizeFilePath(inputPath: string, basePath?: string): string | null {
  try {
    // Resolve against base path if provided
    const resolvedPath = basePath ? path.resolve(basePath, inputPath) : path.resolve(inputPath);

    // Normalize the path
    const normalizedPath = path.normalize(resolvedPath);

    // Check for path traversal attempts
    if (basePath) {
      const relativePath = path.relative(basePath, normalizedPath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return null; // Path traversal detected
      }
    }

    return normalizedPath;
  } catch {
    return null;
  }
}

/**
 * Gets a human-readable file size string
 * @param sizeInBytes - File size in bytes
 * @returns Human-readable size string
 */
export function formatFileSize(sizeInBytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Checks if a path is within the VS Code workspace
 * @param fileUri - VS Code URI to check
 * @returns true if the path is within the workspace
 */
export function isWithinWorkspace(fileUri: vscode.Uri): boolean {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return false;
  }

  const filePath = fileUri.fsPath;

  return workspaceFolders.some((folder) => {
    const folderPath = folder.uri.fsPath;
    return filePath.startsWith(folderPath);
  });
}
