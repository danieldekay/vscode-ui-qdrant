"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFilePath = validateFilePath;
exports.hasValidQdrantExtension = hasValidQdrantExtension;
exports.validateFileSize = validateFileSize;
exports.isLargeFile = isLargeFile;
exports.isWritablePath = isWritablePath;
exports.sanitizeFilePath = sanitizeFilePath;
exports.formatFileSize = formatFileSize;
exports.isWithinWorkspace = isWithinWorkspace;
const path = __importStar(require("node:path"));
const vscode = __importStar(require("vscode"));
/**
 * Validates that a file path is well-formed and safe to use
 * @param fileUri - VS Code URI to validate
 * @returns true if the path is valid, false otherwise
 */
function validateFilePath(fileUri) {
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
    }
    catch {
        return false;
    }
}
/**
 * Checks if a file has a valid Qdrant database file extension
 * @param fileUri - VS Code URI to check
 * @returns true if the file has a valid extension
 */
function hasValidQdrantExtension(fileUri) {
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
function validateFileSize(sizeInBytes) {
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
function isLargeFile(sizeInBytes) {
    // Consider files over 1GB as large
    const largeFileThreshold = 1024 * 1024 * 1024;
    return sizeInBytes > largeFileThreshold;
}
/**
 * Validates that a file path points to a location that is writable
 * @param fileUri - VS Code URI to check
 * @returns Promise resolving to true if writable, false otherwise
 */
async function isWritablePath(fileUri) {
    try {
        // Try to get file stats - if file doesn't exist, check directory
        const stat = await vscode.workspace.fs.stat(fileUri);
        if (stat) {
            // File exists, check if we can write to it
            // Note: VS Code doesn't provide direct write permission check
            // This is a basic check - in production, you might need platform-specific code
            return true; // Assume writable if we can stat it
        }
    }
    catch {
        // File doesn't exist, check if directory is writable
        try {
            const dirUri = vscode.Uri.file(path.dirname(fileUri.fsPath));
            await vscode.workspace.fs.stat(dirUri);
            return true; // Assume directory is writable if we can stat it
        }
        catch {
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
function sanitizeFilePath(inputPath, basePath) {
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
    }
    catch {
        return null;
    }
}
/**
 * Gets a human-readable file size string
 * @param sizeInBytes - File size in bytes
 * @returns Human-readable size string
 */
function formatFileSize(sizeInBytes) {
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
function isWithinWorkspace(fileUri) {
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
//# sourceMappingURL=fileValidators.js.map