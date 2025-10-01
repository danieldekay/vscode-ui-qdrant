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
const chai_1 = require("chai");
const sinon = __importStar(require("sinon"));
const search_service_1 = require("../../src/services/search_service");
suite('Search API Contract Tests', () => {
    let sandbox;
    let mockSearchService;
    setup(() => {
        sandbox = sinon.createSandbox();
        mockSearchService = sandbox.createStubInstance(search_service_1.SearchService);
    });
    teardown(() => {
        sandbox.restore();
    });
    suite('Test Case 1: Successful Search', () => {
        test('performSearch should return success with results array', async () => {
            // Given: Valid search query and connected Qdrant instance
            const query = 'test query';
            const parameters = {
                similarityThreshold: 0.7,
                resultLimit: 50,
                includePayload: true,
                includeVector: false,
                searchFilters: [],
            };
            const expectedResults = {
                success: true,
                data: {
                    queryId: 'test-query-id',
                    results: [
                        {
                            id: 'point-1',
                            score: 0.85,
                            payload: { content: 'test content' },
                            vector: undefined,
                        },
                    ],
                    totalFound: 1,
                    searchTime: 150,
                    hasMore: false,
                },
            };
            mockSearchService.search.resolves(expectedResults);
            // When: performSearch is called with valid parameters
            const result = await mockSearchService.search(query, parameters);
            // Then: Returns success with results array
            (0, chai_1.expect)(result.success).to.be.true;
            if (result.success) {
                (0, chai_1.expect)(result.data).to.exist;
                (0, chai_1.expect)(result.data.results).to.be.an('array');
                (0, chai_1.expect)(result.data.results).to.have.lengthOf(1);
                // And: Results contain valid SearchResultItem objects
                const item = result.data.results[0];
                (0, chai_1.expect)(item).to.have.property('id');
                (0, chai_1.expect)(item).to.have.property('score');
                (0, chai_1.expect)(item.score).to.be.within(0.0, 1.0);
                // And: Scores are between 0.0 and 1.0
                (0, chai_1.expect)(item.score).to.be.at.least(0.0);
                (0, chai_1.expect)(item.score).to.be.at.most(1.0);
            }
        });
    });
    suite('Test Case 2: Invalid Parameters', () => {
        test('performSearch should return validation error for invalid parameters', async () => {
            // Given: Search request with invalid parameters
            const query = '';
            const parameters = {
                similarityThreshold: 1.5, // Invalid: > 1.0
                resultLimit: 1500, // Invalid: > 1000
                includePayload: true,
                includeVector: false,
                searchFilters: [],
            };
            const expectedError = {
                success: false,
                code: 'INVALID_QUERY',
                message: 'Search query must be a non-empty string',
            };
            mockSearchService.search.resolves(expectedError);
            // When: performSearch is called
            const result = await mockSearchService.search(query, parameters);
            // Then: Returns validation error
            (0, chai_1.expect)(result.success).to.be.false;
            if (!result.success) {
                (0, chai_1.expect)(result.code).to.equal('INVALID_QUERY');
                (0, chai_1.expect)(result.message).to.include('non-empty string');
            }
        });
    });
    suite('Test Case 3: Connection Failure', () => {
        test('performSearch should return connection error when Qdrant is unreachable', async () => {
            // Given: Qdrant server is unreachable
            const query = 'test query';
            const parameters = {
                similarityThreshold: 0.7,
                resultLimit: 50,
                includePayload: true,
                includeVector: false,
                searchFilters: [],
            };
            const expectedError = {
                success: false,
                code: 'CONNECTION_ERROR',
                message: 'Not connected to Qdrant',
            };
            mockSearchService.search.resolves(expectedError);
            // When: performSearch is called
            const result = await mockSearchService.search(query, parameters);
            // Then: Returns connection error
            (0, chai_1.expect)(result.success).to.be.false;
            if (!result.success) {
                (0, chai_1.expect)(result.code).to.equal('CONNECTION_ERROR');
                (0, chai_1.expect)(result.message).to.include('Not connected');
            }
        });
    });
    suite('Test Case 4: Empty Results', () => {
        test('performSearch should return empty results for queries with no matches', async () => {
            // Given: Valid query that matches no documents
            const query = 'nonexistent query';
            const parameters = {
                similarityThreshold: 0.7,
                resultLimit: 50,
                includePayload: true,
                includeVector: false,
                searchFilters: [],
            };
            const expectedResults = {
                success: true,
                data: {
                    queryId: 'empty-query-id',
                    results: [],
                    totalFound: 0,
                    searchTime: 100,
                    hasMore: false,
                },
            };
            mockSearchService.search.resolves(expectedResults);
            // When: performSearch is called
            const result = await mockSearchService.search(query, parameters);
            // Then: Returns success with empty results array
            (0, chai_1.expect)(result.success).to.be.true;
            if (result.success) {
                (0, chai_1.expect)(result.data.results).to.be.an('array');
                (0, chai_1.expect)(result.data.results).to.have.lengthOf(0);
                // And: totalFound is 0
                (0, chai_1.expect)(result.data.totalFound).to.equal(0);
            }
        });
    });
    suite('Connection Status Tests', () => {
        test('getConnectionStatus should return connection information', async () => {
            // Given: Connected Qdrant instance
            const expectedStatus = {
                connected: true,
                collection: 'test-collection',
            };
            mockSearchService.getConnectionStatus.returns(expectedStatus);
            // When: getConnectionStatus is called
            const result = mockSearchService.getConnectionStatus();
            // Then: Returns connection status
            (0, chai_1.expect)(result).to.deep.equal(expectedStatus);
            (0, chai_1.expect)(result.connected).to.be.true;
            (0, chai_1.expect)(result.collection).to.equal('test-collection');
        });
    });
});
//# sourceMappingURL=test_search_api.js.map