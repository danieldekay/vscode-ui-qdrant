import type { DatabaseFile } from './databaseFile';
import type { FileValidationResult } from './fileValidation';

/**
 * Configuration for auto-discovery behavior and scanning parameters
 */
export interface AutoDiscoveryConfig {
  /** Maximum time allowed for discovery in milliseconds (default: 3000) */
  scanTimeout: number;
  /** Maximum subdirectory levels to scan (default: 3) */
  maxDirectoryDepth: number;
  /** File extensions to consider as potential databases */
  includedFileExtensions: string[];
  /** Directory names to skip during scanning */
  excludedDirectories: string[];
  /** Whether to show progress to user */
  enableProgressReporting: boolean;
  /** Whether user can cancel discovery */
  allowCancellation: boolean;
  /** Whether to validate files during discovery */
  validateDiscoveredFiles: boolean;
  /** Whether to group results by containing directory */
  groupByDirectory: boolean;
  /** Whether to detect Qdrant folder-based databases */
  detectQdrantFolders: boolean;
}

/**
 * Error encountered during discovery scanning
 */
export interface DiscoveryError {
  /** Error code for programmatic handling */
  code: DiscoveryErrorCode;
  /** Human-readable error message */
  message: string;
  /** Directory where error occurred */
  directory?: string;
  /** Additional error details */
  details?: string;
}

/**
 * Result of auto-discovery scanning for Qdrant databases
 */
export interface DatabaseDiscoveryResult {
  /** List of discovered database files */
  discoveredFiles: DatabaseFile[];
  /** Time taken for discovery in milliseconds */
  scanDuration: number;
  /** List of directories that were scanned */
  scannedDirectories: string[];
  /** Files grouped by containing directory */
  groupedByDirectory: Map<string, DatabaseFile[]>;
  /** Count of potential database files discovered */
  totalFilesFound: number;
  /** Validation results for each discovered file */
  validationResults: Map<string, FileValidationResult>;
  /** Any errors encountered during scanning */
  scanErrors: DiscoveryError[];
  /** Whether scan was terminated due to timeout */
  wasTimedOut: boolean;
  /** Whether scan was cancelled by user */
  isCancelled: boolean;
}

/**
 * Enumeration of possible discovery error codes
 */
export enum DiscoveryErrorCode {
  SCAN_TIMEOUT = 'SCAN_TIMEOUT',
  ACCESS_DENIED = 'ACCESS_DENIED',
  DIRECTORY_NOT_FOUND = 'DIRECTORY_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  TOO_MANY_FILES = 'TOO_MANY_FILES',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Discovery scan state enumeration
 */
export enum DiscoveryState {
  IDLE = 'idle',
  SCANNING = 'scanning',
  COMPLETED = 'completed',
  TIMED_OUT = 'timedOut',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

/**
 * Default configuration for auto-discovery
 */
export const DEFAULT_DISCOVERY_CONFIG: AutoDiscoveryConfig = {
  scanTimeout: 3000, // 3 seconds
  maxDirectoryDepth: 3,
  includedFileExtensions: ['.db', '.sqlite', '.sqlite3', ''], // Include files without extension
  excludedDirectories: ['node_modules', '.git', '.vscode', 'dist', 'out', 'build'],
  enableProgressReporting: true,
  allowCancellation: true,
  validateDiscoveredFiles: true,
  groupByDirectory: true,
  detectQdrantFolders: true,
};
