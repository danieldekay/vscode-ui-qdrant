/**
 * Common types and enums used across the Qdrant VS Code extension
 */
/**
 * Result wrapper for operations that may succeed or fail
 */
export interface Result<T, E = Error> {
    /** Whether the operation succeeded */
    success: boolean;
    /** The result value (present if success is true) */
    data?: T;
    /** The error (present if success is false) */
    error?: E;
}
/**
 * Success result factory
 */
export declare function success<T>(data: T): Result<T>;
/**
 * Error result factory
 */
export declare function failure<E = Error>(error: E): Result<never, E>;
/**
 * Type guard for successful results
 */
export declare function isSuccess<T>(result: Result<T>): result is Result<T> & {
    data: T;
};
/**
 * Type guard for failed results
 */
export declare function isFailure<E>(result: Result<any, E>): result is Result<never, E> & {
    error: E;
};
/**
 * Event emitter interface for type-safe events
 */
export interface EventEmitter<T extends Record<string, any>> {
    /** Add an event listener */
    on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
    /** Remove an event listener */
    off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
    /** Emit an event */
    emit<K extends keyof T>(event: K, data: T[K]): void;
    /** Remove all listeners for an event */
    removeAllListeners<K extends keyof T>(event?: K): void;
}
/**
 * Disposable interface for cleanup operations
 */
export interface Disposable {
    /** Dispose of resources */
    dispose(): void;
}
/**
 * Progress callback for long-running operations
 */
export type ProgressCallback = (progress: ProgressInfo) => void;
/**
 * Progress information
 */
export interface ProgressInfo {
    /** Current progress (0-100) */
    percentage: number;
    /** Current step description */
    message: string;
    /** Optional detailed information */
    details?: string;
    /** Whether the operation can be cancelled */
    cancellable?: boolean;
}
/**
 * Cancellation token for operations
 */
export interface CancellationToken {
    /** Whether the operation has been cancelled */
    isCancelled: boolean;
    /** Register a callback to run when cancelled */
    onCancelled(callback: () => void): void;
}
/**
 * Timeout configuration
 */
export interface TimeoutConfig {
    /** Timeout in milliseconds */
    timeout: number;
    /** Whether to retry on timeout */
    retryOnTimeout?: boolean;
    /** Maximum number of retries */
    maxRetries?: number;
}
/**
 * Default timeout configurations
 */
export declare const DEFAULT_TIMEOUTS: {
    readonly FILE_OPERATION: 5000;
    readonly DATABASE_CONNECTION: 10000;
    readonly VALIDATION: 3000;
    readonly CONFIG_UPDATE: 2000;
};
/**
 * Logging levels
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * Log entry interface
 */
export interface LogEntry {
    /** Log level */
    level: LogLevel;
    /** Log message */
    message: string;
    /** Timestamp */
    timestamp: number;
    /** Additional context data */
    context?: Record<string, any>;
    /** Error if applicable */
    error?: Error;
}
/**
 * File operation types
 */
export declare enum FileOperation {
    READ = "read",
    WRITE = "write",
    DELETE = "delete",
    RENAME = "rename",
    COPY = "copy",
    STAT = "stat"
}
/**
 * File operation result
 */
export interface FileOperationResult {
    /** Whether the operation succeeded */
    success: boolean;
    /** Operation that was performed */
    operation: FileOperation;
    /** Path of the file operated on */
    path: string;
    /** Error if operation failed */
    error?: Error;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Validation severity levels
 */
export declare enum ValidationSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
/**
 * Generic validation issue
 */
export interface ValidationIssue {
    /** Severity of the issue */
    severity: ValidationSeverity;
    /** Issue code for programmatic handling */
    code: string;
    /** Human-readable message */
    message: string;
    /** Path or location of the issue */
    path?: string;
    /** Additional details */
    details?: string;
    /** Suggested fix */
    suggestion?: string;
}
/**
 * Utility type for making specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Utility type for making specific properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * Utility type for extracting the value type of a Result
 */
export type ResultValue<T> = T extends Result<infer U> ? U : never;
/**
 * Utility type for extracting the error type of a Result
 */
export type ResultError<T> = T extends Result<any, infer E> ? E : never;
//# sourceMappingURL=common.d.ts.map