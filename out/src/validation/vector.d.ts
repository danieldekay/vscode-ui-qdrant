/**
 * Validates a vector according to Qdrant requirements
 * @param vector - The vector to validate
 * @param collectionName - Optional collection name for error context
 * @throws {QdrantInvalidVectorError} If the vector is invalid
 */
export declare function validateVector(vector: number[], collectionName?: string): void;
/**
 * Validates multiple vectors
 * @param vectors - Array of vectors to validate
 * @param collectionName - Optional collection name for error context
 * @throws {QdrantInvalidVectorError} If any vector is invalid
 */
export declare function validateVectors(vectors: number[][], collectionName?: string): void;
/**
 * Checks if a vector is valid without throwing an error
 * @param vector - The vector to check
 * @returns true if valid, false otherwise
 */
export declare function isValidVector(vector: number[]): boolean;
/**
 * Checks if multiple vectors are valid without throwing an error
 * @param vectors - Array of vectors to check
 * @returns true if all vectors are valid, false otherwise
 */
export declare function areValidVectors(vectors: number[][]): boolean;
//# sourceMappingURL=vector.d.ts.map