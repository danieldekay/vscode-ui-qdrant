import * as vscode from 'vscode';
/**
 * Represents a Qdrant database file on the local file system
 */
export interface DatabaseFile {
    /** The file URI as provided by VS Code */
    uri: vscode.Uri;
    /** The absolute file system path */
    path: string;
    /** File name without directory path */
    name: string;
    /** File size in bytes */
    size: number;
    /** Last modified timestamp */
    lastModified: number;
    /** Whether the file exists on disk */
    exists: boolean;
    /** File permissions (read/write access) */
    permissions: FilePermissions;
    /** Qdrant-specific metadata if available */
    metadata?: QdrantMetadata;
}
/**
 * File system permissions for database files
 */
export interface FilePermissions {
    /** Can read the file */
    readable: boolean;
    /** Can write to the file */
    writable: boolean;
    /** Can execute the file (rarely needed for DB files) */
    executable: boolean;
}
/**
 * Qdrant-specific metadata extracted from database files
 */
export interface QdrantMetadata {
    /** Qdrant version that created this database */
    version?: string;
    /** Number of collections in the database */
    collectionCount?: number;
    /** Total number of vectors stored */
    vectorCount?: number;
    /** Database creation timestamp */
    createdAt?: number;
    /** Last compaction timestamp */
    lastCompacted?: number;
    /** Storage format version */
    storageFormat?: string;
}
/**
 * Factory function to create a DatabaseFile from a VS Code URI
 */
export declare function createDatabaseFile(uri: vscode.Uri): DatabaseFile;
/**
 * Type guard to check if an object is a valid DatabaseFile
 */
export declare function isDatabaseFile(obj: any): obj is DatabaseFile;
//# sourceMappingURL=databaseFile.d.ts.map