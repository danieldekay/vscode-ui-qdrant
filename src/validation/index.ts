/**
 * Centralized validation utilities for the Qdrant extension.
 */

export { validateQdrantCollection } from '../models/qdrant_collection';
export { validateSearchConfig } from '../models/search_config';
export { validateSearchFilter, validateSearchParameters } from '../models/search_parameters';
// Re-export all validation functions from individual modules
export { validateSearchResultItem } from '../models/search_result';
export { validateVectorPoint, validateVectorPointBatch } from '../models/vector_point';

/**
 * Generic validation result type.
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validate a search query string.
 */
export function validateSearchQuery(query: string): ValidationResult {
  if (!query || typeof query !== 'string') {
    return { valid: false, errors: ['Query must be a non-empty string'] };
  }

  const trimmed = query.trim();
  if (trimmed === '') {
    return { valid: false, errors: ['Query cannot be only whitespace'] };
  }

  if (trimmed.length > 10000) {
    return { valid: false, errors: ['Query is too long (maximum 10000 characters)'] };
  }

  return { valid: true };
}

/**
 * Validate a collection name.
 */
export function validateCollectionName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: false, errors: ['Collection name must be a string'] };
  }

  const trimmed = name.trim();
  if (trimmed === '') {
    return { valid: false, errors: ['Collection name cannot be empty'] };
  }

  if (trimmed.length > 255) {
    return { valid: false, errors: ['Collection name is too long (maximum 255 characters)'] };
  }

  // Qdrant collection name rules (simplified)
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validNameRegex.test(trimmed)) {
    return {
      valid: false,
      errors: ['Collection name can only contain letters, numbers, hyphens, and underscores'],
    };
  }

  return { valid: true };
}

/**
 * Validate a URL for Qdrant connection.
 */
export function validateQdrantUrl(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { valid: false, errors: ['URL must be a string'] };
  }

  const trimmed = url.trim();
  if (trimmed === '') {
    return { valid: false, errors: ['URL cannot be empty'] };
  }

  // Allow file:// URLs for local mode
  if (trimmed.startsWith('file://')) {
    return { valid: true };
  }

  // For HTTP URLs, basic validation
  try {
    const parsedUrl = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, errors: ['URL must use HTTP or HTTPS protocol'] };
    }
  } catch {
    return { valid: false, errors: ['Invalid URL format'] };
  }

  return { valid: true };
}

/**
 * Comprehensive validation for search operation inputs.
 */
export function validateSearchOperation(query: string, parameters: any): ValidationResult {
  const errors: string[] = [];

  // Validate query
  const queryValidation = validateSearchQuery(query);
  if (!queryValidation.valid) {
    errors.push(...(queryValidation.errors || []));
  }

  // Validate parameters (if provided)
  if (parameters) {
    // Import validation dynamically to avoid circular imports
    try {
      // This would use the SearchParameters validation
      // For now, basic checks
      if (typeof parameters.similarityThreshold === 'number') {
        if (parameters.similarityThreshold < 0 || parameters.similarityThreshold > 1) {
          errors.push('Similarity threshold must be between 0.0 and 1.0');
        }
      }

      if (typeof parameters.resultLimit === 'number') {
        if (parameters.resultLimit < 1 || parameters.resultLimit > 1000) {
          errors.push('Result limit must be between 1 and 1000');
        }
      }
    } catch (_error) {
      errors.push('Parameter validation failed');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
