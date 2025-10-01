"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsStateType = void 0;
exports.createInitialCollectionsState = createInitialCollectionsState;
exports.createLoadingCollectionsState = createLoadingCollectionsState;
exports.createLoadedCollectionsState = createLoadedCollectionsState;
exports.createErrorCollectionsState = createErrorCollectionsState;
exports.createRefreshingCollectionsState = createRefreshingCollectionsState;
exports.updateCollectionsState = updateCollectionsState;
exports.updateCollectionsStateWithError = updateCollectionsStateWithError;
exports.hasCollections = hasCollections;
exports.isCollectionsLoading = isCollectionsLoading;
exports.hasCollectionsError = hasCollectionsError;
exports.getPrimaryCollection = getPrimaryCollection;
exports.findCollectionByName = findCollectionByName;
exports.getCollectionsSortedByName = getCollectionsSortedByName;
exports.getCollectionsSortedByVectorCount = getCollectionsSortedByVectorCount;
exports.getCollectionStatistics = getCollectionStatistics;
exports.shouldRefreshCollections = shouldRefreshCollections;
exports.mergeCollectionsStates = mergeCollectionsStates;
/**
 * Collections State
 *
 * Represents the current state of Qdrant collections in the VSCode extension,
 * including loading states, error handling, and collection metadata.
 */
var CollectionsStateType;
(function (CollectionsStateType) {
    /** Collections are being loaded */
    CollectionsStateType["LOADING"] = "loading";
    /** Collections loaded successfully */
    CollectionsStateType["LOADED"] = "loaded";
    /** Error occurred while loading collections */
    CollectionsStateType["ERROR"] = "error";
    /** No collections available (empty state) */
    CollectionsStateType["EMPTY"] = "empty";
    /** Collections are being refreshed */
    CollectionsStateType["REFRESHING"] = "refreshing";
})(CollectionsStateType || (exports.CollectionsStateType = CollectionsStateType = {}));
/**
 * Creates an initial empty collections state
 */
function createInitialCollectionsState() {
    return {
        type: CollectionsStateType.EMPTY,
        collections: [],
        isLoading: false,
        totalCount: 0,
    };
}
/**
 * Creates a loading collections state
 */
function createLoadingCollectionsState(previousState) {
    return {
        type: CollectionsStateType.LOADING,
        collections: previousState?.collections || [],
        isLoading: true,
        totalCount: previousState?.totalCount || 0,
        metadata: {
            ...previousState?.metadata,
            connectionStatus: 'connected',
        },
    };
}
/**
 * Creates a loaded collections state
 */
function createLoadedCollectionsState(collections, loadDuration) {
    return {
        type: collections.length > 0 ? CollectionsStateType.LOADED : CollectionsStateType.EMPTY,
        collections,
        isLoading: false,
        totalCount: collections.length,
        lastLoaded: new Date(),
        metadata: {
            connectionStatus: 'connected',
            source: 'api',
            loadDuration,
        },
    };
}
/**
 * Creates an error collections state
 */
function createErrorCollectionsState(error, previousCollections = []) {
    return {
        type: CollectionsStateType.ERROR,
        collections: previousCollections,
        error,
        isLoading: false,
        totalCount: previousCollections.length,
        metadata: {
            connectionStatus: 'error',
            source: 'api',
        },
    };
}
/**
 * Creates a refreshing collections state
 */
function createRefreshingCollectionsState(currentCollections) {
    return {
        type: CollectionsStateType.REFRESHING,
        collections: currentCollections,
        isLoading: true,
        totalCount: currentCollections.length,
        metadata: {
            connectionStatus: 'connected',
            source: 'api',
        },
    };
}
/**
 * Updates collections state with new data
 */
function updateCollectionsState(_currentState, newCollections, loadDuration) {
    return createLoadedCollectionsState(newCollections, loadDuration);
}
/**
 * Updates collections state with error
 */
function updateCollectionsStateWithError(currentState, error) {
    return createErrorCollectionsState(error, currentState.collections);
}
/**
 * Checks if collections state has collections available
 */
function hasCollections(state) {
    return state.collections.length > 0;
}
/**
 * Checks if collections state is in a loading state
 */
function isCollectionsLoading(state) {
    return (state.isLoading ||
        state.type === CollectionsStateType.LOADING ||
        state.type === CollectionsStateType.REFRESHING);
}
/**
 * Checks if collections state has an error
 */
function hasCollectionsError(state) {
    return state.type === CollectionsStateType.ERROR && !!state.error;
}
/**
 * Gets the primary collection (first one, or undefined if none)
 */
function getPrimaryCollection(state) {
    return state.collections[0];
}
/**
 * Finds a collection by name
 */
function findCollectionByName(state, name) {
    return state.collections.find((collection) => collection.name === name);
}
/**
 * Gets collections sorted by name
 */
function getCollectionsSortedByName(state) {
    return [...state.collections].sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Gets collections sorted by vector count (descending)
 */
function getCollectionsSortedByVectorCount(state) {
    return [...state.collections].sort((a, b) => b.vectors_count - a.vectors_count);
}
/**
 * Gets collection statistics
 */
function getCollectionStatistics(state) {
    const totalCollections = state.collections.length;
    const totalVectors = state.collections.reduce((sum, col) => sum + col.vectors_count, 0);
    const healthyCollections = state.collections.filter((col) => col.status === 'green').length;
    const unhealthyCollections = totalCollections - healthyCollections;
    const averageVectorsPerCollection = totalCollections > 0 ? totalVectors / totalCollections : 0;
    return {
        totalCollections,
        totalVectors,
        healthyCollections,
        unhealthyCollections,
        averageVectorsPerCollection,
    };
}
/**
 * Checks if collections state needs refresh
 */
function shouldRefreshCollections(state, maxAgeMs = 30000) {
    if (!state.lastLoaded)
        return true;
    const age = Date.now() - state.lastLoaded.getTime();
    return age > maxAgeMs;
}
/**
 * Merges two collections states (useful for partial updates)
 */
function mergeCollectionsStates(baseState, updateState) {
    return {
        ...baseState,
        ...updateState,
        collections: updateState.collections || baseState.collections,
        metadata: {
            ...baseState.metadata,
            ...updateState.metadata,
        },
    };
}
//# sourceMappingURL=collections-state.js.map