import { QdrantInvalidCollectionNameError } from '../types/errors';

/**
 * Regular expression for valid collection names
 * Collection names must contain only alphanumeric characters, hyphens, and underscores
 */
const COLLECTION_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Validates a collection name according to Qdrant requirements
 * @param name - The collection name to validate
 * @throws {QdrantInvalidCollectionNameError} If the name is invalid
 */
export function validateCollectionName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new QdrantInvalidCollectionNameError(name || 'undefined');
  }

  if (name.trim() !== name) {
    throw new QdrantInvalidCollectionNameError(name);
  }

  if (name.length === 0) {
    throw new QdrantInvalidCollectionNameError(name);
  }

  if (name.length > 255) {
    throw new QdrantInvalidCollectionNameError(name);
  }

  if (!COLLECTION_NAME_PATTERN.test(name)) {
    throw new QdrantInvalidCollectionNameError(name);
  }
}

/**
 * Checks if a collection name is valid without throwing an error
 * @param name - The collection name to check
 * @returns true if valid, false otherwise
 */
export function isValidCollectionName(name: string): boolean {
  try {
    validateCollectionName(name);
    return true;
  } catch {
    return false;
  }
}
