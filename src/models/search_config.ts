/**
 * Connection and default settings for Qdrant database access.
 */
export interface SearchConfig {
  /** Qdrant server hostname/IP */
  host: string;

  /** Qdrant server port (default: 6333) */
  port: number;

  /** Optional API key for authentication */
  apiKey?: string;

  /** Default collection name to search */
  collection: string;

  /** Request timeout in milliseconds (default: 30000) */
  timeout: number;
}

/**
 * Default values for SearchConfig
 */
export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  host: 'localhost',
  port: 6333,
  collection: 'default',
  timeout: 30000,
};

/**
 * Validation rules for SearchConfig
 */
export function validateSearchConfig(config: SearchConfig): boolean {
  // host must be a valid hostname or IP address
  if (!config.host || typeof config.host !== 'string' || config.host.trim() === '') {
    return false;
  }

  // port must be between 1 and 65535
  if (typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
    return false;
  }

  // collection must be a non-empty string
  if (
    !config.collection ||
    typeof config.collection !== 'string' ||
    config.collection.trim() === ''
  ) {
    return false;
  }

  // timeout must be > 0
  if (typeof config.timeout !== 'number' || config.timeout <= 0) {
    return false;
  }

  // apiKey is optional but if present must be a string
  if (config.apiKey !== undefined && typeof config.apiKey !== 'string') {
    return false;
  }

  return true;
}
