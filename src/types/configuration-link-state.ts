/**
 * Configuration Link State
 *
 * Represents the state of the configuration link displayed in the collections tree view.
 * This entity manages the visibility and behavior of the configuration link based on
 * the current Qdrant connection status and collection availability.
 */

export enum ConfigurationLinkVisibility {
  /** Link is visible and clickable */
  VISIBLE = 'visible',

  /** Link is hidden (when collections are available) */
  HIDDEN = 'hidden',

  /** Link is disabled (when configuration is invalid) */
  DISABLED = 'disabled',
}

export enum ConfigurationLinkState {
  /** No collections available, show configuration link */
  NO_COLLECTIONS = 'no_collections',

  /** Collections exist, hide configuration link */
  COLLECTIONS_AVAILABLE = 'collections_available',

  /** Configuration is invalid, show disabled link */
  INVALID_CONFIG = 'invalid_config',

  /** Currently connecting to Qdrant */
  CONNECTING = 'connecting',

  /** Connection failed, show configuration link */
  CONNECTION_FAILED = 'connection_failed',
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
export function createConfigurationLinkData(
  state: ConfigurationLinkState,
  context?: ConfigurationLinkData['context'],
): ConfigurationLinkData {
  const baseData: ConfigurationLinkData = {
    visibility: ConfigurationLinkVisibility.HIDDEN,
    state,
    label: 'Configure Qdrant',
    tooltip: 'Configure Qdrant connection settings',
    icon: 'settings-gear',
    command: 'qdrant.openConfig',
    clickable: true,
    context,
  };

  switch (state) {
    case ConfigurationLinkState.NO_COLLECTIONS:
      return {
        ...baseData,
        visibility: ConfigurationLinkVisibility.VISIBLE,
        label: 'No collections found - Configure Qdrant',
        tooltip: 'Configure Qdrant connection to view collections',
        icon: 'settings-gear',
      };

    case ConfigurationLinkState.COLLECTIONS_AVAILABLE:
      return {
        ...baseData,
        visibility: ConfigurationLinkVisibility.HIDDEN,
        clickable: false,
      };

    case ConfigurationLinkState.INVALID_CONFIG:
      return {
        ...baseData,
        visibility: ConfigurationLinkVisibility.VISIBLE,
        label: 'Configuration Error - Fix Settings',
        tooltip: 'Invalid configuration detected. Click to fix.',
        icon: 'error',
        clickable: true,
      };

    case ConfigurationLinkState.CONNECTING:
      return {
        ...baseData,
        visibility: ConfigurationLinkVisibility.VISIBLE,
        label: 'Connecting to Qdrant...',
        tooltip: 'Attempting to connect to Qdrant',
        icon: 'sync~spin',
        clickable: false,
      };

    case ConfigurationLinkState.CONNECTION_FAILED:
      return {
        ...baseData,
        visibility: ConfigurationLinkVisibility.VISIBLE,
        label: 'Connection Failed - Configure Qdrant',
        tooltip: 'Failed to connect to Qdrant. Click to configure.',
        icon: 'error',
        clickable: true,
      };

    default:
      return baseData;
  }
}

/**
 * Type guard to check if a ConfigurationLinkData is visible
 */
export function isConfigurationLinkVisible(data: ConfigurationLinkData): boolean {
  return data.visibility === ConfigurationLinkVisibility.VISIBLE;
}

/**
 * Type guard to check if a ConfigurationLinkData is clickable
 */
export function isConfigurationLinkClickable(data: ConfigurationLinkData): boolean {
  return data.clickable && data.visibility === ConfigurationLinkVisibility.VISIBLE;
}

/**
 * Updates ConfigurationLinkData based on collection count
 */
export function updateConfigurationLinkForCollections(
  currentData: ConfigurationLinkData,
  collectionCount: number,
): ConfigurationLinkData {
  if (collectionCount > 0) {
    return createConfigurationLinkData(ConfigurationLinkState.COLLECTIONS_AVAILABLE, {
      ...currentData.context,
      collectionCount,
    });
  } else {
    return createConfigurationLinkData(ConfigurationLinkState.NO_COLLECTIONS, {
      ...currentData.context,
      collectionCount,
    });
  }
}

/**
 * Updates ConfigurationLinkData based on connection status
 */
export function updateConfigurationLinkForConnection(
  currentData: ConfigurationLinkData,
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error',
  lastError?: string,
): ConfigurationLinkData {
  const newContext = {
    ...currentData.context,
    connectionStatus,
    lastError,
  };

  switch (connectionStatus) {
    case 'connecting':
      return createConfigurationLinkData(ConfigurationLinkState.CONNECTING, newContext);

    case 'error':
      return createConfigurationLinkData(ConfigurationLinkState.CONNECTION_FAILED, newContext);

    case 'connected':
      // Don't change visibility based on connection alone - depends on collections
      return {
        ...currentData,
        context: newContext,
      };

    default:
      return createConfigurationLinkData(ConfigurationLinkState.NO_COLLECTIONS, newContext);
  }
}

/**
 * Updates ConfigurationLinkData based on configuration validity
 */
export function updateConfigurationLinkForConfigValidity(
  currentData: ConfigurationLinkData,
  isValid: boolean,
  hasConfiguration: boolean,
): ConfigurationLinkData {
  const newContext = {
    ...currentData.context,
    hasConfiguration,
  };

  if (!isValid && hasConfiguration) {
    return createConfigurationLinkData(ConfigurationLinkState.INVALID_CONFIG, newContext);
  }

  // If config is valid or doesn't exist, don't change the current state
  return {
    ...currentData,
    context: newContext,
  };
}
