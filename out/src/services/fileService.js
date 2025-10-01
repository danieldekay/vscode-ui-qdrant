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
exports.FileService = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const vscode = __importStar(require("vscode"));
const databaseFile_1 = require("../types/databaseFile");
const fileValidation_1 = require("../types/fileValidation");
/**
 * Service for validating Qdrant database files
 */
class FileService {
    /**
     * Validates a Qdrant database file at the given path
     * @param fileUri - VS Code URI pointing to the file to validate
     * @returns Promise resolving to validation result
     */
    static async validateQdrantFile(fileUri) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        const rulesChecked = [];
        const fsChecks = [];
        try {
            // Create database file object
            const databaseFile = (0, databaseFile_1.createDatabaseFile)(fileUri);
            // 1. Check if path is valid
            rulesChecked.push(fileValidation_1.ValidationRule.VALID_PATH);
            if (!FileService.isValidFilePath(fileUri)) {
                errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.INVALID_PATH, 'Invalid file path provided', `Path: ${fileUri.fsPath}`));
            }
            // 2. Check if file exists
            rulesChecked.push(fileValidation_1.ValidationRule.FILE_EXISTS);
            fsChecks.push(fileValidation_1.FileSystemCheck.STAT_CHECK);
            const stat = await FileService.safeStat(fileUri);
            if (!stat) {
                errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.FILE_NOT_FOUND, 'File does not exist', `Path: ${fileUri.fsPath}`));
                return FileService.createResult(databaseFile, errors, warnings, rulesChecked, fsChecks, startTime);
            }
            // Update file metadata
            databaseFile.size = stat.size;
            databaseFile.lastModified = stat.mtime;
            databaseFile.exists = true;
            // 3. Check file permissions
            rulesChecked.push(fileValidation_1.ValidationRule.SUFFICIENT_PERMISSIONS);
            fsChecks.push(fileValidation_1.FileSystemCheck.PERMISSION_CHECK);
            const permissions = await FileService.checkPermissions(fileUri);
            databaseFile.permissions = permissions;
            if (!permissions.readable) {
                errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.FILE_NOT_READABLE, 'File is not readable', 'Check file permissions'));
            }
            if (!permissions.writable) {
                warnings.push((0, fileValidation_1.createValidationWarning)(fileValidation_1.ValidationWarningCode.SLOW_ACCESS_TIME, 'File is not writable', 'Some operations may fail'));
            }
            // 4. Check file size
            rulesChecked.push(fileValidation_1.ValidationRule.REASONABLE_SIZE);
            if (stat.size === 0) {
                errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.INVALID_FILE_FORMAT, 'File is empty', 'Qdrant database files must contain data'));
            }
            else if (stat.size > 10 * 1024 * 1024 * 1024) {
                // 10GB
                warnings.push((0, fileValidation_1.createValidationWarning)(fileValidation_1.ValidationWarningCode.FILE_SIZE_LARGE, 'File is very large', `Size: ${(stat.size / (1024 * 1024 * 1024)).toFixed(2)} GB`, 'Large files may impact performance'));
            }
            // 5. Basic format validation (check file extension and basic structure)
            rulesChecked.push(fileValidation_1.ValidationRule.VALID_FORMAT);
            fsChecks.push(fileValidation_1.FileSystemCheck.FORMAT_DETECTION);
            if (!FileService.hasValidExtension(fileUri)) {
                warnings.push((0, fileValidation_1.createValidationWarning)(fileValidation_1.ValidationWarningCode.MISSING_METADATA, 'File does not have standard Qdrant extension', `Expected .db or similar, got: ${path.extname(fileUri.fsPath)}`, 'Ensure this is a valid Qdrant database file'));
            }
            // 6. Integrity check (basic - can be enhanced later)
            rulesChecked.push(fileValidation_1.ValidationRule.NOT_CORRUPTED);
            fsChecks.push(fileValidation_1.FileSystemCheck.INTEGRITY_CHECK);
            // For now, just check if we can read the first few bytes
            try {
                const header = await FileService.readFileHeader(fileUri, 64);
                if (header.length === 0) {
                    errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.CORRUPTED_DATABASE, 'Cannot read file header', 'File may be corrupted or inaccessible'));
                }
            }
            catch (error) {
                errors.push((0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.CORRUPTED_DATABASE, 'Failed to read file header', error instanceof Error ? error.message : 'Unknown error'));
            }
            return FileService.createResult(databaseFile, errors, warnings, rulesChecked, fsChecks, startTime);
        }
        catch (error) {
            // Handle unexpected errors
            const unexpectedError = (0, fileValidation_1.createValidationError)(fileValidation_1.ValidationErrorCode.UNKNOWN_ERROR, 'Unexpected error during validation', error instanceof Error ? error.message : 'Unknown error');
            const databaseFile = (0, databaseFile_1.createDatabaseFile)(fileUri);
            return FileService.createResult(databaseFile, [unexpectedError], warnings, rulesChecked, fsChecks, startTime);
        }
    }
    /**
     * Creates a validation result from components
     */
    static createResult(file, errors, warnings, rulesChecked, fsChecks, startTime) {
        const metadata = {
            validatedAt: Date.now(),
            duration: Date.now() - startTime,
            rulesChecked,
            fsChecks,
        };
        if (errors.length > 0) {
            return (0, fileValidation_1.createInvalidResult)(file, errors, warnings, metadata);
        }
        else {
            return (0, fileValidation_1.createValidResult)(file, metadata);
        }
    }
    /**
     * Checks if the file path is valid
     */
    static isValidFilePath(uri) {
        try {
            const fsPath = uri.fsPath;
            return fsPath.length > 0 && path.isAbsolute(fsPath);
        }
        catch {
            return false;
        }
    }
    /**
     * Safely gets file statistics using VS Code workspace.fs
     */
    static async safeStat(uri) {
        try {
            return await vscode.workspace.fs.stat(uri);
        }
        catch {
            return null;
        }
    }
    /**
     * Checks file permissions
     */
    static async checkPermissions(uri) {
        const fsPath = uri.fsPath;
        let readable = false;
        let writable = false;
        const executable = false;
        try {
            // Check readability
            await fs.promises.access(fsPath, fs.constants.R_OK);
            readable = true;
        }
        catch {
            readable = false;
        }
        try {
            // Check writability
            await fs.promises.access(fsPath, fs.constants.W_OK);
            writable = true;
        }
        catch {
            writable = false;
        }
        // Executable permission is rarely needed for database files
        return { readable, writable, executable };
    }
    /**
     * Checks if file has a valid Qdrant database extension
     */
    static hasValidExtension(uri) {
        const ext = path.extname(uri.fsPath).toLowerCase();
        // Qdrant typically uses .db or no extension, but we'll be permissive
        return ext === '.db' || ext === '' || ext === '.sqlite' || ext === '.sqlite3';
    }
    /**
     * Reads the first N bytes of a file for header validation
     */
    static async readFileHeader(uri, bytes) {
        try {
            const content = await vscode.workspace.fs.readFile(uri);
            return content.slice(0, Math.min(bytes, content.length));
        }
        catch {
            return new Uint8Array(0);
        }
    }
}
exports.FileService = FileService;
//# sourceMappingURL=fileService.js.map