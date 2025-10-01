import type { CollectionInfo } from './qdrant';

/**
 * Collections State
 *
 * Represents the current state of Qdrant collections in the VSCode extension,
 * including loading states, error handling, and collection metadata.
 */

export enum CollectionsStateType {
  /** Collections are being loaded */
  LOADING = 'loading',

  /** Collections loaded successfully */
  LOADED = 'loaded',

  /** Error occurred while loading collections */
  ERROR = 'error',

  /** No collections available (empty state) */
  EMPTY = 'empty',

  /** Collections are being refreshed */
  REFRESHING = 'refreshing',
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
export function createInitialCollectionsState(): CollectionsState {
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
export function createLoadingCollectionsState(previousState?: CollectionsState): CollectionsState {
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
export function createLoadedCollectionsState(
  collections: CollectionInfo[],
  loadDuration?: number,
): CollectionsState {
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
export function createErrorCollectionsState(
  error: Error,
  previousCollections: CollectionInfo[] = [],
): CollectionsState {
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
export function createRefreshingCollectionsState(
  currentCollections: CollectionInfo[],
): CollectionsState {
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
export function updateCollectionsState(
  _currentState: CollectionsState,
  newCollections: CollectionInfo[],
  loadDuration?: number,
): CollectionsState {
  return createLoadedCollectionsState(newCollections, loadDuration);
}

/**
 * Updates collections state with error
 */
export function updateCollectionsStateWithError(
  currentState: CollectionsState,
  error: Error,
): CollectionsState {
  return createErrorCollectionsState(error, currentState.collections);
}

/**
 * Checks if collections state has collections available
 */
export function hasCollections(state: CollectionsState): boolean {
  return state.collections.length > 0;
}

/**
 * Checks if collections state is in a loading state
 */
export function isCollectionsLoading(state: CollectionsState): boolean {
  return (
    state.isLoading ||
    state.type === CollectionsStateType.LOADING ||
    state.type === CollectionsStateType.REFRESHING
  );
}

/**
 * Checks if collections state has an error
 */
export function hasCollectionsError(state: CollectionsState): boolean {
  return state.type === CollectionsStateType.ERROR && !!state.error;
}

/**
 * Gets the primary collection (first one, or undefined if none)
 */
export function getPrimaryCollection(state: CollectionsState): CollectionInfo | undefined {
  return state.collections[0];
}

/**
 * Finds a collection by name
 */
export function findCollectionByName(
  state: CollectionsState,
  name: string,
): CollectionInfo | undefined {
  return state.collections.find((collection) => collection.name === name);
}

/**
 * Gets collections sorted by name
 */
export function getCollectionsSortedByName(state: CollectionsState): CollectionInfo[] {
  return [...state.collections].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Gets collections sorted by vector count (descending)
 */
export function getCollectionsSortedByVectorCount(state: CollectionsState): CollectionInfo[] {
  return [...state.collections].sort((a, b) => b.vectors_count - a.vectors_count);
}

/**
 * Gets collection statistics
 */
export function getCollectionStatistics(state: CollectionsState): {
  totalCollections: number;
  totalVectors: number;
  healthyCollections: number;
  unhealthyCollections: number;
  averageVectorsPerCollection: number;
} {
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
export function shouldRefreshCollections(
  state: CollectionsState,
  maxAgeMs: number = 30000,
): boolean {
  if (!state.lastLoaded) return true;
  const age = Date.now() - state.lastLoaded.getTime();
  return age > maxAgeMs;
}

/**
 * Merges two collections states (useful for partial updates)
 */
export function mergeCollectionsStates(
  baseState: CollectionsState,
  updateState: Partial<CollectionsState>,
): CollectionsState {
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
