import { type SearchConfig, validateSearchConfig } from '../models/search_config';
import type { SearchParameters } from '../models/search_parameters';
import {
  type SearchResponse,
  type SearchResponseType,
  validateSearchResponse,
} from '../models/search_response';
import type { QdrantService } from './qdrant-service';

/**
 * Service for performing search operations against Qdrant.
 */
export class SearchService {
  private qdrantService: QdrantService;
  private config: SearchConfig;

  constructor(qdrantService: QdrantService, config: SearchConfig) {
    this.qdrantService = qdrantService;
    this.config = config;
  }

  /**
   * Perform a search operation.
   */
  async search(query: string, parameters: SearchParameters): Promise<SearchResponseType> {
    try {
      // Validate inputs
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return {
          success: false,
          code: 'INVALID_QUERY',
          message: 'Search query must be a non-empty string',
        };
      }

      // Import the validation function dynamically to avoid circular imports
      const { validateSearchParameters } = await import('../models/search_parameters');
      if (!validateSearchParameters(parameters)) {
        return {
          success: false,
          code: 'INVALID_PARAMETERS',
          message: 'Search parameters are invalid',
        };
      }

      // Check connection
      if (!this.qdrantService.isConnected()) {
        return {
          success: false,
          code: 'CONNECTION_ERROR',
          message: 'Not connected to Qdrant',
        };
      }

      // Generate vector from query text
      // TODO: Replace with actual embedding service
      const vector = this.generateQueryVector(query);

      // Prepare search request for QdrantService
      const searchRequest = {
        collectionName: this.config.collection,
        vector,
        limit: parameters.resultLimit,
        scoreThreshold: parameters.similarityThreshold,
        withPayload: parameters.includePayload,
        withVector: parameters.includeVector,
        filter: parameters.searchFilters
          ? {
              must: parameters.searchFilters.map((filter) => ({
                key: filter.field,
                match: {
                  [this.mapOperator(filter.operator)]: filter.value,
                },
              })),
            }
          : undefined,
      };

      const startTime = Date.now();
      const results = await this.qdrantService.search(searchRequest);
      const searchTime = Date.now() - startTime;

      // Convert results to our SearchResponse format
      const searchResponse: SearchResponse = {
        queryId: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        results: results.map((result) => ({
          id: result.id,
          score: result.score,
          payload: result.payload || {},
          vector: result.vector,
        })),
        totalFound: results.length, // This is approximate since Qdrant may not return total
        searchTime,
        hasMore: results.length >= parameters.resultLimit,
      };

      if (!validateSearchResponse(searchResponse)) {
        return {
          success: false,
          code: 'INVALID_RESPONSE',
          message: 'Search response validation failed',
        };
      }

      return {
        success: true,
        data: searchResponse,
      };
    } catch (error) {
      return {
        success: false,
        code: 'SEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown search error',
        details: error,
      };
    }
  }

  /**
   * Get the current connection status.
   */
  getConnectionStatus() {
    const status = this.qdrantService.getConnectionStatus();
    return {
      connected: status.state === 'connected',
      collection: this.config.collection,
    };
  }

  /**
   * Update the search configuration.
   */
  updateConfig(config: Partial<SearchConfig>): boolean {
    const newConfig = { ...this.config, ...config };
    if (validateSearchConfig(newConfig)) {
      this.config = newConfig;
      return true;
    }
    return false;
  }

  /**
   * Map our filter operators to Qdrant filter format.
   */
  private mapOperator(operator: string): string {
    switch (operator) {
      case 'EQ':
        return 'value';
      case 'NE':
        return 'except';
      case 'GT':
        return 'gt';
      case 'LT':
        return 'lt';
      case 'GTE':
        return 'gte';
      case 'LTE':
        return 'lte';
      case 'IN':
        return 'any';
      case 'NIN':
        return 'except';
      default:
        return 'value';
    }
  }

  /**
   * Generate a query vector from text.
   * TODO: Replace with actual embedding model
   */
  private generateQueryVector(query: string): number[] {
    // Simple placeholder implementation: create a 1536-dimensional vector
    // based on character codes and positions
    const vector: number[] = new Array(1536).fill(0);

    for (let i = 0; i < query.length && i < 1536; i++) {
      const charCode = query.charCodeAt(i);
      // Distribute the character influence across multiple dimensions
      for (let j = 0; j < 10 && i * 10 + j < 1536; j++) {
        vector[i * 10 + j] = (charCode / 255) * Math.sin(i + j);
      }
    }

    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return vector.map((val) => val / magnitude);
    }

    return vector;
  }
}
