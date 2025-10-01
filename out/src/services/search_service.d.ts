import { type SearchConfig } from '../models/search_config';
import type { SearchParameters } from '../models/search_parameters';
import { type SearchResponseType } from '../models/search_response';
import type { QdrantService } from './qdrant-service';
/**
 * Service for performing search operations against Qdrant.
 */
export declare class SearchService {
    private qdrantService;
    private config;
    constructor(qdrantService: QdrantService, config: SearchConfig);
    /**
     * Perform a search operation.
     */
    search(query: string, parameters: SearchParameters): Promise<SearchResponseType>;
    /**
     * Get the current connection status.
     */
    getConnectionStatus(): {
        connected: boolean;
        collection: string;
    };
    /**
     * Update the search configuration.
     */
    updateConfig(config: Partial<SearchConfig>): boolean;
    /**
     * Map our filter operators to Qdrant filter format.
     */
    private mapOperator;
    /**
     * Generate a query vector from text.
     * TODO: Replace with actual embedding model
     */
    private generateQueryVector;
}
//# sourceMappingURL=search_service.d.ts.map