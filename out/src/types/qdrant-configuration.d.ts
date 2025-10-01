/**
 * Comprehensive Qdrant Configuration
 *
 * Complete configuration interface for Qdrant connections with validation
 * and utility functions for configuration management in VSCode.
 */
export interface QdrantConfiguration {
    /** Qdrant server host */
    host: string;
    /** Qdrant server port */
    port: number;
    /** API key for authentication (optional) */
    apiKey?: string;
    /** Whether to use HTTPS for connections */
    useHttps: boolean;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Number of retry attempts for failed requests */
    retryCount?: number;
    /** Whether this configuration is enabled */
    enabled?: boolean;
    /** User-friendly name for this configuration */
    name?: string;
}
/**
 * Default Qdrant configuration values
 */
export declare const DEFAULT_QDRANT_CONFIGURATION: Required<QdrantConfiguration>;
/**
 * Configuration validation result
 */
export interface ConfigurationValidationResult {
    /** Whether the configuration is valid */
    isValid: boolean;
    /** List of validation errors */
    errors: string[];
    /** List of validation warnings */
    warnings: string[];
}
/**
 * Configuration source information
 */
export declare enum ConfigurationSource {
    /** Configuration from VSCode workspace settings */
    WORKSPACE = "workspace",
    /** Configuration from VSCode global settings */
    GLOBAL = "global",
    /** Configuration from environment variables */
    ENVIRONMENT = "environment",
    /** Configuration from a file */
    FILE = "file",
    /** Default configuration */
    DEFAULT = "default"
}
/**
 * Configuration with source tracking
 */
export interface SourcedConfiguration {
    /** The configuration data */
    config: QdrantConfiguration;
    /** Source of this configuration */
    source: ConfigurationSource;
    /** Workspace folder name (for workspace-scoped configs) */
    workspaceFolder?: string;
    /** Timestamp when this configuration was loaded */
    loadedAt: Date;
}
/**
 * Creates a QdrantConfiguration from partial data with defaults
 */
export declare function createQdrantConfiguration(partial: Partial<QdrantConfiguration>): QdrantConfiguration;
/**
 * Validates a QdrantConfiguration
 */
export declare function validateQdrantConfiguration(config: Partial<QdrantConfiguration>): ConfigurationValidationResult;
/**
 * Merges multiple configuration sources with priority
 */
export declare function mergeConfigurations(configs: SourcedConfiguration[]): QdrantConfiguration;
/**
 * Converts QdrantConfiguration to URL format
 */
export declare function configurationToUrl(config: QdrantConfiguration): string;
/**
 * Converts QdrantConfiguration to connection options
 */
export declare function configurationToConnectionOptions(config: QdrantConfiguration): {
    url: string;
    apiKey?: string;
    timeout: number;
    retryCount: number;
};
/**
 * Checks if two configurations are equivalent
 */
export declare function areConfigurationsEqual(config1: QdrantConfiguration, config2: QdrantConfiguration): boolean;
export declare function sanitizeConfiguration(config: QdrantConfiguration): Omit<QdrantConfiguration, 'apiKey'>;
/**
 * Gets a user-friendly description of the configuration
 */
export declare function getConfigurationDescription(config: QdrantConfiguration): string;
//# sourceMappingURL=qdrant-configuration.d.ts.map