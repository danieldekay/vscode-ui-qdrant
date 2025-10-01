import type { SearchParameters } from '../models/search_parameters';
import type { SearchService } from '../services/search_service';
/**
 * Search API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for search operations
 * within the VS Code extension context.
 */
export declare class SearchEndpoint {
    private searchService;
    constructor(searchService: SearchService);
    /**
     * Execute a search operation.
     *
     * @param query The search query string
     * @param parameters Search parameters
     * @returns Promise resolving to search results
     */
    search(query: string, parameters: SearchParameters): Promise<import("../models/search_response").SearchResponseType>;
    /**
     * Get the current connection status.
     *
     * @returns Connection status information
     */
    getConnectionStatus(): {
        connected: boolean;
        collection: string;
    };
    /**
     * Validate search parameters.
     *
     * @param parameters Parameters to validate
     * @returns Validation result
     */
    validateParameters(_parameters: SearchParameters): boolean;
}
/**
 * Factory function to create search endpoint.
 */
export declare function createSearchEndpoint(searchService: SearchService): SearchEndpoint;
//# sourceMappingURL=search_endpoint.d.ts.map