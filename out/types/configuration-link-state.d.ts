/**
 * Configuration Link State
 *
 * Represents the state of the configuration link displayed in the collections tree view.
 * This entity manages the visibility and behavior of the configuration link based on
 * the current Qdrant connection status and collection availability.
 */
export declare enum ConfigurationLinkVisibility {
    /** Link is visible and clickable */
    VISIBLE = "visible",
    /** Link is hidden (when collections are available) */
    HIDDEN = "hidden",
    /** Link is disabled (when configuration is invalid) */
    DISABLED = "disabled"
}
export declare enum ConfigurationLinkState {
    /** No collections available, show configuration link */
    NO_COLLECTIONS = "no_collections",
    /** Collections exist, hide configuration link */
    COLLECTIONS_AVAILABLE = "collections_available",
    /** Configuration is invalid, show disabled link */
    INVALID_CONFIG = "invalid_config",
    /** Currently connecting to Qdrant */
    CONNECTING = "connecting",
    /** Connection failed, show configuration link */
    CONNECTION_FAILED = "connection_failed"
}
export interface ConfigurationLinkData {
    /** Current visibility state */
    visibility: ConfigurationLinkVisibility;
    /** Current link state */
    state: ConfigurationLinkState;
    /** User-friendly label for the link */
    label: string;
    /** Tooltip text explaining the link's purpose */
    tooltip: string;
    /** Icon identifier for the link */
    icon: string;
    /** Command to execute when clicked */
    command: string;
    /** Whether the link is clickable */
    clickable: boolean;
    /** Additional context information */
    context?: {
        /** Number of collections available */
        collectionCount?: number;
        /** Current connection status */
        connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
        /** Last error message if any */
        lastError?: string;
        /** Whether configuration exists */
        hasConfiguration?: boolean;
    };
}
/**
 * Factory function to create ConfigurationLinkData based on current state
 */
export declare function createConfigurationLinkData(state: ConfigurationLinkState, context?: ConfigurationLinkData['context']): ConfigurationLinkData;
/**
 * Type guard to check if a ConfigurationLinkData is visible
 */
export declare function isConfigurationLinkVisible(data: ConfigurationLinkData): boolean;
/**
 * Type guard to check if a ConfigurationLinkData is clickable
 */
export declare function isConfigurationLinkClickable(data: ConfigurationLinkData): boolean;
/**
 * Updates ConfigurationLinkData based on collection count
 */
export declare function updateConfigurationLinkForCollections(currentData: ConfigurationLinkData, collectionCount: number): ConfigurationLinkData;
/**
 * Updates ConfigurationLinkData based on connection status
 */
export declare function updateConfigurationLinkForConnection(currentData: ConfigurationLinkData, connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error', lastError?: string): ConfigurationLinkData;
/**
 * Updates ConfigurationLinkData based on configuration validity
 */
export declare function updateConfigurationLinkForConfigValidity(currentData: ConfigurationLinkData, isValid: boolean, hasConfiguration: boolean): ConfigurationLinkData;
//# sourceMappingURL=configuration-link-state.d.ts.map