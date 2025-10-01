import type { CollectionInfo } from './qdrant';
/**
 * Collections State
 *
 * Represents the current state of Qdrant collections in the VSCode extension,
 * including loading states, error handling, and collection metadata.
 */
export declare enum CollectionsStateType {
    /** Collections are being loaded */
    LOADING = "loading",
    /** Collections loaded successfully */
    LOADED = "loaded",
    /** Error occurred while loading collections */
    ERROR = "error",
    /** No collections available (empty state) */
    EMPTY = "empty",
    /** Collections are being refreshed */
    REFRESHING = "refreshing"
}
export interface CollectionsState {
    /** Current state type */
    type: CollectionsStateType;
    /** List of collections */
    collections: CollectionInfo[];
    /** Last error if any */
    error?: Error;
    /** Timestamp of last successful load */
    lastLoaded?: Date;
    /** Whether collections are currently being fetched */
    isLoading: boolean;
    /** Total number of collections */
    totalCount: number;
    /** Additional metadata */
    metadata?: {
        /** Connection status when collections were loaded */
        connectionStatus?: 'connected' | 'disconnected' | 'error';
        /** Source of the collection data */
        source?: 'api' | 'cache' | 'mock';
        /** Request duration in milliseconds */
        loadDuration?: number;
        /** Whether this is a partial result */
        isPartial?: boolean;
    };
}
/**
 * Creates an initial empty collections state
 */
export declare function createInitialCollectionsState(): CollectionsState;
/**
 * Creates a loading collections state
 */
export declare function createLoadingCollectionsState(previousState?: CollectionsState): CollectionsState;
/**
 * Creates a loaded collections state
 */
export declare function createLoadedCollectionsState(collections: CollectionInfo[], loadDuration?: number): CollectionsState;
/**
 * Creates an error collections state
 */
export declare function createErrorCollectionsState(error: Error, previousCollections?: CollectionInfo[]): CollectionsState;
/**
 * Creates a refreshing collections state
 */
export declare function createRefreshingCollectionsState(currentCollections: CollectionInfo[]): CollectionsState;
/**
 * Updates collections state with new data
 */
export declare function updateCollectionsState(_currentState: CollectionsState, newCollections: CollectionInfo[], loadDuration?: number): CollectionsState;
/**
 * Updates collections state with error
 */
export declare function updateCollectionsStateWithError(currentState: CollectionsState, error: Error): CollectionsState;
/**
 * Checks if collections state has collections available
 */
export declare function hasCollections(state: CollectionsState): boolean;
/**
 * Checks if collections state is in a loading state
 */
export declare function isCollectionsLoading(state: CollectionsState): boolean;
/**
 * Checks if collections state has an error
 */
export declare function hasCollectionsError(state: CollectionsState): boolean;
/**
 * Gets the primary collection (first one, or undefined if none)
 */
export declare function getPrimaryCollection(state: CollectionsState): CollectionInfo | undefined;
/**
 * Finds a collection by name
 */
export declare function findCollectionByName(state: CollectionsState, name: string): CollectionInfo | undefined;
/**
 * Gets collections sorted by name
 */
export declare function getCollectionsSortedByName(state: CollectionsState): CollectionInfo[];
/**
 * Gets collections sorted by vector count (descending)
 */
export declare function getCollectionsSortedByVectorCount(state: CollectionsState): CollectionInfo[];
/**
 * Gets collection statistics
 */
export declare function getCollectionStatistics(state: CollectionsState): {
    totalCollections: number;
    totalVectors: number;
    healthyCollections: number;
    unhealthyCollections: number;
    averageVectorsPerCollection: number;
};
/**
 * Checks if collections state needs refresh
 */
export declare function shouldRefreshCollections(state: CollectionsState, maxAgeMs?: number): boolean;
/**
 * Merges two collections states (useful for partial updates)
 */
export declare function mergeCollectionsStates(baseState: CollectionsState, updateState: Partial<CollectionsState>): CollectionsState;
//# sourceMappingURL=collections-state.d.ts.map