"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEndpoint = void 0;
exports.createSearchEndpoint = createSearchEndpoint;
/**
 * Search API endpoint implementation for VS Code extension.
 *
 * This provides the programmatic interface for search operations
 * within the VS Code extension context.
 */
class SearchEndpoint {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    /**
     * Execute a search operation.
     *
     * @param query The search query string
     * @param parameters Search parameters
     * @returns Promise resolving to search results
     */
    async search(query, parameters) {
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
    validateParameters(_parameters) {
        // Import validation function dynamically to avoid circular imports
        // This would be handled by the SearchService in practice
        return true; // Placeholder
    }
}
exports.SearchEndpoint = SearchEndpoint;
/**
 * Factory function to create search endpoint.
 */
function createSearchEndpoint(searchService) {
    return new SearchEndpoint(searchService);
}
//# sourceMappingURL=search_endpoint.js.map