import type * as vscode from 'vscode';
/**
 * Configuration for Qdrant database connection
 */
export interface QdrantConfig {
    /** Path to the local Qdrant database file */
    localDbPath?: vscode.Uri;
    /** Connection status */
    connectionStatus: ConnectionStatus;
    /** Connection details when connected */
    connectionDetails?: ConnectionDetails;
    /** Last successful connection timestamp */
    lastConnectedAt?: number;
    /** Connection error details if failed */
    connectionError?: ConnectionError;
}
/**
 * Status of the Qdrant database connection
 */
export declare enum ConnectionStatus {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    ERROR = "error"
}
/**
 * Details about an active Qdrant connection
 */
export interface ConnectionDetails {
    /** Qdrant server version */
    version: string;
    /** Number of collections in the database */
    collectionCount: number;
    /** Total number of vectors stored */
    vectorCount: number;
    /** Database uptime in seconds */
    uptime?: number;
    /** Memory usage information */
    memoryUsage?: MemoryUsage;
    /** Disk usage information */
    diskUsage?: DiskUsage;
}
/**
 * Memory usage statistics
 */
export interface MemoryUsage {
    /** Total memory allocated (bytes) */
    total: number;
    /** Memory used (bytes) */
    used: number;
    /** Memory available (bytes) */
    available: number;
    /** Memory usage percentage */
    percentage: number;
}
/**
 * Disk usage statistics
 */
export interface DiskUsage {
    /** Total disk space (bytes) */
    total: number;
    /** Disk space used (bytes) */
    used: number;
    /** Disk space available (bytes) */
    available: number;
    /** Disk usage percentage */
    percentage: number;
}
/**
 * Error details for failed connections
 */
export interface ConnectionError {
    /** Error code */
    code: ConnectionErrorCode;
    /** Human-readable error message */
    message: string;
    /** Detailed error information */
    details?: string;
    /** Timestamp when error occurred */
    timestamp: number;
    /** Whether this error is recoverable */
    recoverable: boolean;
    /** Suggested recovery action */
    recoveryAction?: string;
}
/**
 * Enumeration of possible connection error codes
 */
export declare enum ConnectionErrorCode {
    FILE_NOT_FOUND = "FILE_NOT_FOUND",
    FILE_NOT_READABLE = "FILE_NOT_READABLE",
    INVALID_DATABASE = "INVALID_DATABASE",
    CORRUPTED_DATABASE = "CORRUPTED_DATABASE",
    INCOMPATIBLE_VERSION = "INCOMPATIBLE_VERSION",
    CONNECTION_TIMEOUT = "CONNECTION_TIMEOUT",
    NETWORK_ERROR = "NETWORK_ERROR",
    PERMISSION_DENIED = "PERMISSION_DENIED",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
/**
 * Configuration update result
 */
export interface ConfigUpdateResult {
    /** Whether the update was successful */
    success: boolean;
    /** New configuration after update */
    newConfig: QdrantConfig;
    /** Previous configuration before update */
    previousConfig?: QdrantConfig;
    /** Error details if update failed */
    error?: ConnectionError;
    /** Timestamp of the update */
    updatedAt: number;
}
/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
    /** Type of change */
    type: ConfigChangeType;
    /** New configuration */
    newConfig: QdrantConfig;
    /** Previous configuration */
    previousConfig?: QdrantConfig;
    /** Timestamp of the change */
    changedAt: number;
}
/**
 * Types of configuration changes
 */
export declare enum ConfigChangeType {
    PATH_CHANGED = "path_changed",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    CONNECTION_ERROR = "connection_error",
    RECONNECTED = "reconnected"
}
/**
 * Factory function to create default Qdrant configuration
 */
export declare function createDefaultConfig(): QdrantConfig;
/**
 * Factory function to create connected configuration
 */
export declare function createConnectedConfig(localDbPath: vscode.Uri, connectionDetails: ConnectionDetails): QdrantConfig;
/**
 * Factory function to create error configuration
 */
export declare function createErrorConfig(localDbPath: vscode.Uri | undefined, error: ConnectionError): QdrantConfig;
/**
 * Factory function to create a connection error
 */
export declare function createConnectionError(code: ConnectionErrorCode, message: string, details?: string, recoverable?: boolean, recoveryAction?: string): ConnectionError;
/**
 * Type guard to check if configuration is connected
 */
export declare function isConnected(config: QdrantConfig): boolean;
/**
 * Type guard to check if configuration has an error
 */
export declare function hasError(config: QdrantConfig): boolean;
/**
 * Type guard to check if configuration has a valid database path
 */
export declare function hasValidPath(config: QdrantConfig): boolean;
//# sourceMappingURL=qdrantConfig.d.ts.map