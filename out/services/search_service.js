"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const search_config_1 = require("../models/search_config");
const search_response_1 = require("../models/search_response");
/**
 * Service for performing search operations against Qdrant.
 */
class SearchService {
    qdrantService;
    config;
    constructor(qdrantService, config) {
        this.qdrantService = qdrantService;
        this.config = config;
    }
    /**
     * Perform a search operation.
     */
    async search(query, parameters) {
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
            const { validateSearchParameters } = await Promise.resolve().then(() => __importStar(require('../models/search_parameters')));
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
            // Prepare search request for QdrantService
            const searchRequest = {
                collectionName: this.config.collection,
                vector: [], // This would need to be generated from the query
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
            const searchResponse = {
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
            if (!(0, search_response_1.validateSearchResponse)(searchResponse)) {
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
        }
        catch (error) {
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
    updateConfig(config) {
        const newConfig = { ...this.config, ...config };
        if ((0, search_config_1.validateSearchConfig)(newConfig)) {
            this.config = newConfig;
            return true;
        }
        return false;
    }
    /**
     * Map our filter operators to Qdrant filter format.
     */
    mapOperator(operator) {
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
}
exports.SearchService = SearchService;
//# sourceMappingURL=search_service.js.map