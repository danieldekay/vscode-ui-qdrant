"use strict";
/**
 * Configuration Link State
 *
 * Represents the state of the configuration link displayed in the collections tree view.
 * This entity manages the visibility and behavior of the configuration link based on
 * the current Qdrant connection status and collection availability.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationLinkState = exports.ConfigurationLinkVisibility = void 0;
exports.createConfigurationLinkData = createConfigurationLinkData;
exports.isConfigurationLinkVisible = isConfigurationLinkVisible;
exports.isConfigurationLinkClickable = isConfigurationLinkClickable;
exports.updateConfigurationLinkForCollections = updateConfigurationLinkForCollections;
exports.updateConfigurationLinkForConnection = updateConfigurationLinkForConnection;
exports.updateConfigurationLinkForConfigValidity = updateConfigurationLinkForConfigValidity;
var ConfigurationLinkVisibility;
(function (ConfigurationLinkVisibility) {
    /** Link is visible and clickable */
    ConfigurationLinkVisibility["VISIBLE"] = "visible";
    /** Link is hidden (when collections are available) */
    ConfigurationLinkVisibility["HIDDEN"] = "hidden";
    /** Link is disabled (when configuration is invalid) */
    ConfigurationLinkVisibility["DISABLED"] = "disabled";
})(ConfigurationLinkVisibility || (exports.ConfigurationLinkVisibility = ConfigurationLinkVisibility = {}));
var ConfigurationLinkState;
(function (ConfigurationLinkState) {
    /** No collections available, show configuration link */
    ConfigurationLinkState["NO_COLLECTIONS"] = "no_collections";
    /** Collections exist, hide configuration link */
    ConfigurationLinkState["COLLECTIONS_AVAILABLE"] = "collections_available";
    /** Configuration is invalid, show disabled link */
    ConfigurationLinkState["INVALID_CONFIG"] = "invalid_config";
    /** Currently connecting to Qdrant */
    ConfigurationLinkState["CONNECTING"] = "connecting";
    /** Connection failed, show configuration link */
    ConfigurationLinkState["CONNECTION_FAILED"] = "connection_failed";
})(ConfigurationLinkState || (exports.ConfigurationLinkState = ConfigurationLinkState = {}));
/**
 * Factory function to create ConfigurationLinkData based on current state
 */
function createConfigurationLinkData(state, context) {
    const baseData = {
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
function isConfigurationLinkVisible(data) {
    return data.visibility === ConfigurationLinkVisibility.VISIBLE;
}
/**
 * Type guard to check if a ConfigurationLinkData is clickable
 */
function isConfigurationLinkClickable(data) {
    return data.clickable && data.visibility === ConfigurationLinkVisibility.VISIBLE;
}
/**
 * Updates ConfigurationLinkData based on collection count
 */
function updateConfigurationLinkForCollections(currentData, collectionCount) {
    if (collectionCount > 0) {
        return createConfigurationLinkData(ConfigurationLinkState.COLLECTIONS_AVAILABLE, {
            ...currentData.context,
            collectionCount,
        });
    }
    else {
        return createConfigurationLinkData(ConfigurationLinkState.NO_COLLECTIONS, {
            ...currentData.context,
            collectionCount,
        });
    }
}
/**
 * Updates ConfigurationLinkData based on connection status
 */
function updateConfigurationLinkForConnection(currentData, connectionStatus, lastError) {
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
function updateConfigurationLinkForConfigValidity(currentData, isValid, hasConfiguration) {
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
//# sourceMappingURL=configuration-link-state.js.map