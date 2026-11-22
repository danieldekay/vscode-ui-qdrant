/**
 * Comprehensive Qdrant Configuration
 *
 * Complete configuration interface for Qdrant connections with validation
 * and utility functions for configuration management in VSCode.
 */

export interface QdrantConfiguration {
  /** Qdrant server URL (for local file connections) */
  url?: string;

  /** Local database file path */
  databasePath?: string;

  /** Qdrant server host */
  host: string;

  /** Qdrant server port */
  port: number;

  /** API key for authentication (optional) */
  apiKey?: string;

  /** Whether to use HTTPS for connections */
  useHttps: boolean;

  /** Request timeout in milliseconds */
  timeout: number;

  /** Number of retry attempts for failed requests */
  retryCount?: number;

  /** Whether this configuration is enabled */
  enabled?: boolean;

  /** User-friendly name for this configuration */
  name?: string;

  /** Default collection for search operations */
  collection: string;

  /** Default search parameters */
  defaultParameters?: {
    resultLimit: number;
    similarityThreshold: number;
    includePayload: boolean;
    includeVector: boolean;
  };
}

/**
 * Default Qdrant configuration values
 */
export const DEFAULT_QDRANT_CONFIGURATION: Required<QdrantConfiguration> = {
  url: 'http://localhost:6333',
  databasePath: '',
  host: 'localhost',
  port: 6333,
  apiKey: '',
  useHttps: false,
  timeout: 5000,
  retryCount: 3,
  enabled: true,
  name: 'Default Configuration',
  collection: 'default',
  defaultParameters: {
    resultLimit: 10,
    similarityThreshold: 0.7,
    includePayload: true,
    includeVector: false,
  },
};

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
export enum ConfigurationSource {
  /** Configuration from VSCode workspace settings */
  WORKSPACE = 'workspace',

  /** Configuration from VSCode global settings */
  GLOBAL = 'global',

  /** Configuration from environment variables */
  ENVIRONMENT = 'environment',

  /** Configuration from a file */
  FILE = 'file',

  /** Default configuration */
  DEFAULT = 'default',
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
export function createQdrantConfiguration(
  partial: Partial<QdrantConfiguration>,
): QdrantConfiguration {
  return {
    ...DEFAULT_QDRANT_CONFIGURATION,
    ...partial,
  };
}

/**
 * Validates a QdrantConfiguration
 */
export function validateQdrantConfiguration(
  config: Partial<QdrantConfiguration>,
): ConfigurationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Host validation
  if (!config.host || typeof config.host !== 'string' || config.host.trim().length === 0) {
    errors.push('Host is required and must be a non-empty string');
  } else if (!/^[\w.-]+$/.test(config.host)) {
    errors.push(
      'Host contains invalid characters (only letters, numbers, dots, hyphens, and underscores allowed)',
    );
  } else if (config.host.length > 253) {
    errors.push('Host name is too long (maximum 253 characters)');
  }

  // Port validation
  if (config.port === undefined || config.port === null) {
    errors.push('Port is required');
  } else if (typeof config.port !== 'number' || !Number.isInteger(config.port)) {
    errors.push('Port must be an integer');
  } else if (config.port < 1 || config.port > 65535) {
    errors.push('Port must be between 1 and 65535');
  } else if (config.port < 1024 && config.port !== 6333) {
    warnings.push('Using a port below 1024 may require administrator privileges');
  }

  // API key validation
  if (config.apiKey !== undefined && typeof config.apiKey !== 'string') {
    errors.push('API key must be a string');
  }

  // HTTPS validation
  if (config.useHttps !== undefined && typeof config.useHttps !== 'boolean') {
    errors.push('useHttps must be a boolean');
  }

  // Timeout validation
  if (config.timeout !== undefined) {
    if (typeof config.timeout !== 'number' || !Number.isInteger(config.timeout)) {
      errors.push('Timeout must be an integer');
    } else if (config.timeout <= 0) {
      errors.push('Timeout must be a positive number');
    } else if (config.timeout > 300000) {
      // 5 minutes
      warnings.push('Timeout is very high (over 5 minutes)');
    } else if (config.timeout < 1000) {
      // 1 second
      warnings.push('Timeout is very low (under 1 second)');
    }
  }

  // Retry count validation
  if (config.retryCount !== undefined) {
    if (typeof config.retryCount !== 'number' || !Number.isInteger(config.retryCount)) {
      errors.push('Retry count must be an integer');
    } else if (config.retryCount < 0) {
      errors.push('Retry count cannot be negative');
    } else if (config.retryCount > 10) {
      errors.push('Retry count cannot exceed 10');
    } else if (config.retryCount > 5) {
      warnings.push('High retry count may cause delays');
    }
  }

  // Enabled validation
  if (config.enabled !== undefined && typeof config.enabled !== 'boolean') {
    errors.push('Enabled must be a boolean');
  }

  // Name validation
  if (config.name !== undefined) {
    if (typeof config.name !== 'string') {
      errors.push('Configuration name must be a string');
    } else if (config.name.trim().length === 0) {
      errors.push('Configuration name cannot be empty');
    } else if (config.name.length > 100) {
      errors.push('Configuration name is too long (maximum 100 characters)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Merges multiple configuration sources with priority
 */
export function mergeConfigurations(configs: SourcedConfiguration[]): QdrantConfiguration {
  // Priority order: workspace > global > environment > file > default
  const priorityOrder = [
    ConfigurationSource.WORKSPACE,
    ConfigurationSource.GLOBAL,
    ConfigurationSource.ENVIRONMENT,
    ConfigurationSource.FILE,
    ConfigurationSource.DEFAULT,
  ];

  const sortedConfigs = configs.sort((a, b) => {
    const aPriority = priorityOrder.indexOf(a.source);
    const bPriority = priorityOrder.indexOf(b.source);
    return aPriority - bPriority;
  });

  let merged = { ...DEFAULT_QDRANT_CONFIGURATION };

  for (const sourcedConfig of sortedConfigs) {
    merged = { ...merged, ...sourcedConfig.config };
  }

  return merged;
}

/**
 * Converts QdrantConfiguration to URL format
 */
export function configurationToUrl(config: QdrantConfiguration): string {
  const protocol = config.useHttps ? 'https' : 'http';
  return `${protocol}://${config.host}:${config.port}`;
}

/**
 * Converts QdrantConfiguration to connection options
 */
export function configurationToConnectionOptions(config: QdrantConfiguration): {
  url: string;
  apiKey?: string;
  timeout: number;
  retryCount: number;
} {
  return {
    url: configurationToUrl(config),
    apiKey: config.apiKey || undefined,
    timeout: config.timeout || DEFAULT_QDRANT_CONFIGURATION.timeout,
    retryCount: config.retryCount || DEFAULT_QDRANT_CONFIGURATION.retryCount,
  };
}

/**
 * Checks if two configurations are equivalent
 */
export function areConfigurationsEqual(
  config1: QdrantConfiguration,
  config2: QdrantConfiguration,
): boolean {
  const keys: (keyof QdrantConfiguration)[] = [
    'host',
    'port',
    'apiKey',
    'useHttps',
    'timeout',
    'retryCount',
    'enabled',
    'name',
  ];

  for (const key of keys) {
    if (config1[key] !== config2[key]) {
      return false;
    }
  }

  return true;
}

export function sanitizeConfiguration(
  config: QdrantConfiguration,
): Omit<QdrantConfiguration, 'apiKey'> {
  const { apiKey: _apiKey, ...sanitized } = config;
  return sanitized;
}

/**
 * Gets a user-friendly description of the configuration
 */
export function getConfigurationDescription(config: QdrantConfiguration): string {
  const name = config.name || 'Unnamed Configuration';
  const url = configurationToUrl(config);
  const auth = config.apiKey ? ' (with authentication)' : '';
  return `${name}: ${url}${auth}`;
}
