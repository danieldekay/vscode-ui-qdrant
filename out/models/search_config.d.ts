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
export declare const DEFAULT_SEARCH_CONFIG: SearchConfig;
/**
 * Validation rules for SearchConfig
 */
export declare function validateSearchConfig(config: SearchConfig): boolean;
//# sourceMappingURL=search_config.d.ts.map