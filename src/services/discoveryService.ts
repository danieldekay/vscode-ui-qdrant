import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import type { DatabaseFile } from '../types/databaseFile';
import type { AutoDiscoveryConfig, DatabaseDiscoveryResult } from '../types/discovery';
import { DiscoveryErrorCode } from '../types/discovery';
import { FileService } from './fileService';

/**
 * Service responsible for auto-discovering Qdrant database files in workspaces
 * Implements performance-optimized scanning with cancellation support
 */
export class DiscoveryService {
  constructor() {
    // No initialization needed
  }

  /**
   * Discovers Qdrant database files in the given workspace folders
   * @param workspaceFolders Workspace folders to scan
   * @param config Discovery configuration
   * @param cancellationToken Optional cancellation token
   * @param progress Optional progress reporter
   * @returns Discovery results with validation information
   */
  async discoverDatabases(
    workspaceFolders: readonly vscode.WorkspaceFolder[],
    config: AutoDiscoveryConfig,
    cancellationToken?: vscode.CancellationToken,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
  ): Promise<DatabaseDiscoveryResult> {
    const startTime = Date.now();
    const result: DatabaseDiscoveryResult = {
      discoveredFiles: [],
      scanDuration: 0,
      scannedDirectories: [],
      groupedByDirectory: new Map(),
      totalFilesFound: 0,
      validationResults: new Map(),
      scanErrors: [],
      wasTimedOut: false,
      isCancelled: false,
    };

    try {
      // Check for cancellation
      if (cancellationToken?.isCancellationRequested) {
        result.isCancelled = true;
        return result;
      }

      progress?.report({ message: 'Starting database discovery...' });

      // Scan each workspace folder
      for (const folder of workspaceFolders) {
        if (cancellationToken?.isCancellationRequested) {
          result.isCancelled = true;
          break;
        }

        const folderPath = folder.uri.fsPath;
        progress?.report({ message: `Scanning ${folder.name}...` });

        try {
          await this.scanDirectory(
            folderPath,
            config,
            result,
            cancellationToken,
            progress,
            startTime,
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          result.scanErrors.push({
            code: DiscoveryErrorCode.UNKNOWN_ERROR,
            message: `Error scanning ${folderPath}: ${errorMessage}`,
            directory: folderPath,
          });
        }

        // Check timeout
        if (Date.now() - startTime >= config.scanTimeout) {
          result.wasTimedOut = true;
          break;
        }
      }

      // Validate discovered files if not cancelled or timed out
      if (!result.isCancelled && !result.wasTimedOut && result.discoveredFiles.length > 0) {
        progress?.report({ message: 'Validating discovered databases...' });
        await this.validateDiscoveredFiles(result, cancellationToken, progress);
      }

      // Group files by directory
      this.groupFilesByDirectory(result);

      progress?.report({
        message: `Discovery complete. Found ${result.discoveredFiles.length} databases.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.scanErrors.push({
        code: DiscoveryErrorCode.UNKNOWN_ERROR,
        message: `Discovery failed: ${errorMessage}`,
      });
    } finally {
      result.scanDuration = Date.now() - startTime;
    }

    return result;
  }

  /**
   * Recursively scans a directory for database files
   */
  private async scanDirectory(
    dirPath: string,
    config: AutoDiscoveryConfig,
    result: DatabaseDiscoveryResult,
    cancellationToken?: vscode.CancellationToken,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
    startTime: number = Date.now(),
    currentDepth: number = 0,
  ): Promise<void> {
    // Check cancellation and timeout
    if (cancellationToken?.isCancellationRequested) {
      return;
    }

    if (Date.now() - startTime >= config.scanTimeout) {
      return;
    }

    // Check max depth
    if (currentDepth >= config.maxDirectoryDepth) {
      return;
    }

    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      result.scannedDirectories.push(dirPath);

      for (const entry of entries) {
        if (cancellationToken?.isCancellationRequested) {
          return;
        }

        const fullPath = path.join(dirPath, entry.name);

        // Skip excluded patterns
        if (this.shouldExclude(fullPath, config.excludedDirectories)) {
          continue;
        }

        if (entry.isFile()) {
          // Check if it's a potential database file
          if (this.isPotentialDatabaseFile(entry.name)) {
            const dbFile: DatabaseFile = {
              uri: vscode.Uri.file(fullPath),
              path: fullPath,
              name: entry.name,
              size: 0,
              lastModified: 0,
              exists: true,
              permissions: {
                readable: true,
                writable: false,
                executable: false,
              },
            };

            try {
              const stats = await fs.promises.stat(fullPath);
              dbFile.size = stats.size;
              dbFile.lastModified = stats.mtime.getTime();
            } catch {
              // Continue even if we can't get stats
            }

            result.discoveredFiles.push(dbFile);
            result.totalFilesFound++;

            progress?.report({
              message: `Found database: ${entry.name}`,
              increment: 1,
            });
          }
        } else if (entry.isDirectory()) {
          // Check if this directory is a Qdrant database folder (if enabled)
          if (
            config.detectQdrantFolders &&
            (await this.isPotentialQdrantFolder(entry.name, fullPath))
          ) {
            const dbFilePath = await this.getQdrantDatabaseFile(fullPath);

            if (dbFilePath) {
              const dbFile: DatabaseFile = {
                uri: vscode.Uri.file(dbFilePath),
                path: dbFilePath,
                name: `${entry.name} (${path.basename(dbFilePath)})`,
                size: 0,
                lastModified: 0,
                exists: true,
                permissions: {
                  readable: true,
                  writable: false,
                  executable: false,
                },
              };

              try {
                const stats = await fs.promises.stat(dbFilePath);
                dbFile.size = stats.size;
                dbFile.lastModified = stats.mtime.getTime();
              } catch {
                // Continue even if we can't get stats
              }

              result.discoveredFiles.push(dbFile);
              result.totalFilesFound++;

              progress?.report({
                message: `Found Qdrant folder: ${entry.name}`,
                increment: 1,
              });
            }
          }

          // Recursively scan subdirectory
          await this.scanDirectory(
            fullPath,
            config,
            result,
            cancellationToken,
            progress,
            startTime,
            currentDepth + 1,
          );
        }

        // Periodic timeout check
        if (Date.now() - startTime >= config.scanTimeout) {
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle permission errors gracefully
        if (error.message.includes('EACCES') || error.message.includes('EPERM')) {
          result.scanErrors.push({
            code: DiscoveryErrorCode.PERMISSION_DENIED,
            message: `Permission denied: ${dirPath}`,
            directory: dirPath,
          });
        } else {
          result.scanErrors.push({
            code: DiscoveryErrorCode.UNKNOWN_ERROR,
            message: `Error reading directory ${dirPath}: ${error.message}`,
            directory: dirPath,
          });
        }
      }
    }
  }

  /**
   * Validates all discovered database files
   */
  private async validateDiscoveredFiles(
    result: DatabaseDiscoveryResult,
    cancellationToken?: vscode.CancellationToken,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
  ): Promise<void> {
    const total = result.discoveredFiles.length;
    let processed = 0;

    for (const dbFile of result.discoveredFiles) {
      if (cancellationToken?.isCancellationRequested) {
        return;
      }

      try {
        // Use the static FileService method
        const validationResult = await FileService.validateQdrantFile(dbFile.uri);
        result.validationResults.set(dbFile.path, validationResult);
        processed++;

        progress?.report({
          message: `Validated ${processed}/${total} databases`,
          increment: 100 / total,
        });
      } catch (error) {
        // Continue validation even if one file fails
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.scanErrors.push({
          code: DiscoveryErrorCode.UNKNOWN_ERROR,
          message: `Validation failed for ${dbFile.path}: ${errorMessage}`,
          directory: path.dirname(dbFile.path),
        });
      }
    }
  }

  /**
   * Groups discovered files by their directory
   */
  private groupFilesByDirectory(result: DatabaseDiscoveryResult): void {
    for (const dbFile of result.discoveredFiles) {
      const directory = path.dirname(dbFile.path);

      if (!result.groupedByDirectory.has(directory)) {
        result.groupedByDirectory.set(directory, []);
      }

      result.groupedByDirectory.get(directory)!.push(dbFile);
    }
  }

  /**
   * Checks if a file path should be excluded based on patterns
   */
  private shouldExclude(filePath: string, excludePatterns: string[]): boolean {
    for (const pattern of excludePatterns) {
      // Simple glob-style pattern matching
      const regex = new RegExp(
        pattern
          .replace(/\*\*/g, '.*') // ** matches any path
          .replace(/\*/g, '[^/]*') // * matches any filename characters
          .replace(/\?/g, '.'), // ? matches single character
      );

      if (regex.test(filePath)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a filename could be a database file
   */
  private isPotentialDatabaseFile(filename: string): boolean {
    const lowerName = filename.toLowerCase();

    // First check if it's a cache/temporary file - exclude these
    if (this.isCacheOrTempFile(lowerName)) {
      return false;
    }

    // Exclude Python files and other non-database file types
    if (this.isNonDatabaseFile(lowerName)) {
      return false;
    }

    // Common database file extensions and patterns
    const dbExtensions = ['.db', '.sqlite', '.sqlite3', '.database'];
    const dbPatterns = ['qdrant', 'vector', 'embedding'];

    // Check extensions
    for (const ext of dbExtensions) {
      if (lowerName.endsWith(ext)) {
        return true;
      }
    }

    // Check patterns in filename
    for (const pattern of dbPatterns) {
      if (lowerName.includes(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if a filename is a non-database file type that should be excluded
   */
  private isNonDatabaseFile(filename: string): boolean {
    const nonDbExtensions = [
      // Python files
      '.py',
      '.pyc',
      '.pyo',
      '.pyw',
      // Other code files
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.java',
      '.cpp',
      '.c',
      '.h',
      // Config files
      '.json',
      '.xml',
      '.yaml',
      '.yml',
      '.toml',
      '.ini',
      '.cfg',
      // Text/documentation
      '.txt',
      '.md',
      '.rst',
      '.doc',
      '.docx',
      '.pdf',
      // Images
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.svg',
      '.ico',
      // Archives
      '.zip',
      '.tar',
      '.gz',
      '.rar',
      '.7z',
      // Executables
      '.exe',
      '.dll',
      '.so',
      '.dylib',
    ];

    // Check if filename ends with any non-database extension
    for (const ext of nonDbExtensions) {
      if (filename.endsWith(ext)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if a filename is a cache or temporary file that should be excluded
   */
  private isCacheOrTempFile(filename: string): boolean {
    const cachePatterns = [
      // Cache files
      'cache',
      '.cache',
      '-cache',
      '_cache',
      // Temporary files
      '.tmp',
      '.temp',
      '-tmp',
      '-temp',
      '_tmp',
      '_temp',
      // Backup files
      '.bak',
      '.backup',
      '-bak',
      '-backup',
      '_bak',
      '_backup',
      // Log files
      '.log',
      '-log',
      '_log',
      // Journal/WAL files
      '.wal',
      '.journal',
      '-wal',
      '-journal',
      '_wal',
      '_journal',
      // Lock files
      '.lock',
      '.lck',
      '-lock',
      '_lock',
      // Swap files
      '.swp',
      '.swap',
      '-swap',
      '_swap',
      // System files
      '.ds_store',
      'thumbs.db',
      // Build artifacts
      '.old',
      '.orig',
      '.backup',
    ];

    // Check if filename contains any cache/temp patterns
    for (const pattern of cachePatterns) {
      if (filename.includes(pattern)) {
        return true;
      }
    }

    // Check if filename starts with common temp prefixes
    if (filename.startsWith('tmp') || filename.startsWith('temp') || filename.startsWith('.')) {
      return true;
    }

    // Check if filename ends with common backup suffixes
    if (filename.match(/\.(bak|backup|old|orig|tmp|temp|cache)$/)) {
      return true;
    }

    return false;
  }

  /**
   * Checks if a directory could be a Qdrant database folder
   * @param dirName The directory name to check
   * @param dirPath The full path to the directory
   * @returns Promise<boolean> indicating if it's a potential Qdrant folder
   */
  private async isPotentialQdrantFolder(dirName: string, dirPath: string): Promise<boolean> {
    const lowerName = dirName.toLowerCase();

    // Common Qdrant folder name patterns
    const qdrantFolderPatterns = [
      'qdrant',
      'qdrant_storage',
      'qdrant_db',
      'qdrant-storage',
      'qdrant-db',
      'vector_db',
      'vector-db',
      'vectordb',
      'embedding_db',
      'embedding-db',
    ];

    // Check if folder name matches Qdrant patterns
    const hasQdrantName = qdrantFolderPatterns.some((pattern) => lowerName.includes(pattern));

    // If name doesn't match, check for Qdrant indicator files
    if (!hasQdrantName) {
      return await this.hasQdrantIndicatorFiles(dirPath);
    }

    return true;
  }

  /**
   * Checks if a directory contains Qdrant indicator files
   * @param dirPath The directory path to check
   * @returns Promise<boolean> indicating if Qdrant files are present
   */
  private async hasQdrantIndicatorFiles(dirPath: string): Promise<boolean> {
    try {
      const entries = await fs.promises.readdir(dirPath);
      const lowerEntries = entries.map((name) => name.toLowerCase());

      // Look for key Qdrant files
      const qdrantIndicators = [
        'storage.sqlite', // Main Qdrant database file
        'collections', // Collections directory
        'aliases.json', // Aliases configuration
        'snapshots', // Snapshots directory
      ];

      // Check if any indicator files/folders exist
      return qdrantIndicators.some((indicator) => lowerEntries.includes(indicator));
    } catch {
      return false;
    }
  }

  /**
   * Gets the appropriate database file path from a Qdrant folder
   * @param folderPath The Qdrant folder path
   * @returns Promise<string | null> The database file path or null if not found
   */
  private async getQdrantDatabaseFile(folderPath: string): Promise<string | null> {
    try {
      const storagePath = path.join(folderPath, 'storage.sqlite');

      // Check if storage.sqlite exists
      try {
        await fs.promises.access(storagePath);
        return storagePath;
      } catch {
        // storage.sqlite doesn't exist, look for other database files
        const entries = await fs.promises.readdir(folderPath);

        for (const entry of entries) {
          if (this.isPotentialDatabaseFile(entry)) {
            return path.join(folderPath, entry);
          }
        }
      }
    } catch {
      // Ignore errors
    }

    return null;
  }
}
