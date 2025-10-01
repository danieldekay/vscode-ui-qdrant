import type { SearchParameters } from '../models/search_parameters';
import type { SearchService } from '../services/search_service';

/**
 * Search API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for search operations
 * within the VS Code extension context.
 */
export class SearchEndpoint {
  private searchService: SearchService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
  }

  /**
   * Execute a search operation.
   *
   * @param query The search query string
   * @param parameters Search parameters
   * @returns Promise resolving to search results
   */
  async search(query: string, parameters: SearchParameters) {
    return this.searchService.search(query, parameters);
  }

  /**
   * Get the current connection status.
   *
   * @returns Connection status information
   */
  getConnectionStatus() {
    return this.searchService.getConnectionStatus();
  }

  /**
   * Validate search parameters.
   *
   * @param parameters Parameters to validate
   * @returns Validation result
   */
  validateParameters(_parameters: SearchParameters): boolean {
    // Import validation function dynamically to avoid circular imports
    // This would be handled by the SearchService in practice
    return true; // Placeholder
  }
}

/**
 * Factory function to create search endpoint.
 */
export function createSearchEndpoint(searchService: SearchService): SearchEndpoint {
  return new SearchEndpoint(searchService);
}
