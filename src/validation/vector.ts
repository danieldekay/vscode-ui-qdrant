import { QdrantInvalidVectorError } from '../types/errors';

/**
 * Expected vector dimension for OpenAI text-embedding-3-small
 */
const EXPECTED_VECTOR_DIMENSION = 1536;

/**
 * Validates a vector according to Qdrant requirements
 * @param vector - The vector to validate
 * @param collectionName - Optional collection name for error context
 * @throws {QdrantInvalidVectorError} If the vector is invalid
 */
export function validateVector(vector: number[], collectionName?: string): void {
  if (!Array.isArray(vector)) {
    throw new QdrantInvalidVectorError(EXPECTED_VECTOR_DIMENSION, 0, collectionName);
  }

  if (vector.length !== EXPECTED_VECTOR_DIMENSION) {
    throw new QdrantInvalidVectorError(EXPECTED_VECTOR_DIMENSION, vector.length, collectionName);
  }

  // Check that all elements are finite numbers
  for (let i = 0; i < vector.length; i++) {
    const value = vector[i];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new QdrantInvalidVectorError(EXPECTED_VECTOR_DIMENSION, vector.length, collectionName);
    }
  }
}

/**
 * Validates multiple vectors
 * @param vectors - Array of vectors to validate
 * @param collectionName - Optional collection name for error context
 * @throws {QdrantInvalidVectorError} If any vector is invalid
 */
export function validateVectors(vectors: number[][], collectionName?: string): void {
  for (const vector of vectors) {
    validateVector(vector, collectionName);
  }
}

/**
 * Checks if a vector is valid without throwing an error
 * @param vector - The vector to check
 * @returns true if valid, false otherwise
 */
export function isValidVector(vector: number[]): boolean {
  try {
    validateVector(vector);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if multiple vectors are valid without throwing an error
 * @param vectors - Array of vectors to check
 * @returns true if all vectors are valid, false otherwise
 */
export function areValidVectors(vectors: number[][]): boolean {
  try {
    validateVectors(vectors);
    return true;
  } catch {
    return false;
  }
}
