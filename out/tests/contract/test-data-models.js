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
const assert = __importStar(require("node:assert"));
/**
 * Contract Tests: Data Models and Validation
 *
 * Tests defining the expected behavior of data models and validation
 * logic for collection schemas, search requests/responses, and configuration.
 * These tests will fail until the implementation is complete.
 */
describe('Data Models and Validation Contract Tests', () => {
    describe('Collection Schema Validation', () => {
        it('should validate collection creation schema', () => {
            // Given: Collection creation data
            void {
                name: 'test-collection',
                vectors: {
                    size: 128,
                    distance: 'Cosine',
                },
                optimizers_config: {
                    default_segment_number: 2,
                    max_segment_size: 100000,
                },
            };
            void {
                name: '', // Invalid: empty name
                vectors: {
                    size: -1, // Invalid: negative size
                    distance: 'InvalidDistance', // Invalid: wrong distance
                },
            };
            // When: Validating collection schema
            try {
                // Simulate validation
                assert.fail('Expected schema validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate collection name format', () => {
            // Given: Various collection names
            void ['my-collection', 'collection_123', 'test.collection', 'a', 'collection-with-dashes'];
            void [
                '', // Empty
                'collection with spaces', // Spaces
                'collection/with/slashes', // Slashes
                'collection\\with\\backslashes', // Backslashes
                'collection@with@symbols', // Special chars
            ];
            // When: Validating name format
            try {
                // Simulate validation
                assert.fail('Expected name validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate vector configuration', () => {
            // Given: Vector configurations
            void [
                { size: 1, distance: 'Cosine' },
                { size: 4096, distance: 'Euclid' },
                { size: 768, distance: 'Dot' },
            ];
            void [
                { size: 0 }, // Size too small
                { size: 100000 }, // Size too large
                { size: 128, distance: 'Invalid' }, // Invalid distance
                { size: '128' }, // Wrong type
                {}, // Missing required fields
            ];
            // When: Validating vector config
            try {
                // Simulate validation
                assert.fail('Expected vector config validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
    });
    describe('Search Request Validation', () => {
        it('should validate search request format', () => {
            // Given: Search request data
            void {
                collectionName: 'test-collection',
                vector: [0.1, 0.2, 0.3, 0.4, 0.5],
                limit: 10,
                offset: 0,
                withPayload: true,
                withVectors: false,
                scoreThreshold: 0.8,
            };
            void {
                collectionName: null, // Invalid type
                vector: 'not-a-vector', // Wrong type
                limit: -1, // Negative limit
                offset: -5, // Negative offset
                scoreThreshold: 1.5, // Out of range
            };
            // When: Validating search request
            try {
                // Simulate validation
                assert.fail('Expected search request validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate vector dimensions match collection', () => {
            // Given: Collection with 128-dim vectors and search vector
            void 128;
            void new Array(128).fill(0.1);
            void new Array(64).fill(0.1); // Wrong size
            // When: Validating vector dimensions
            try {
                // Simulate validation
                assert.fail('Expected dimension validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate search parameters', () => {
            // Given: Search parameters
            void {
                limit: 1,
                offset: 0,
                scoreThreshold: 0.0,
                withPayload: true,
                withVectors: false,
            };
            void {
                limit: 0, // Too small
                offset: -1, // Negative
                scoreThreshold: -0.1, // Negative
                withPayload: 'true', // Wrong type
                withVectors: null, // Wrong type
            };
            // When: Validating search parameters
            try {
                // Simulate validation
                assert.fail('Expected parameter validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
    });
    describe('Upsert Request Validation', () => {
        it('should validate upsert request format', () => {
            // Given: Upsert request data
            void {
                collectionName: 'test-collection',
                points: [
                    {
                        id: 1,
                        vector: [0.1, 0.2, 0.3],
                        payload: { text: 'example', metadata: { source: 'test' } },
                    },
                    {
                        id: 'string-id',
                        vector: [0.4, 0.5, 0.6],
                        payload: null, // Optional payload
                    },
                ],
            };
            void {
                collectionName: '',
                points: [
                    {
                        id: null, // Invalid ID
                        vector: [], // Empty vector
                        payload: 'not-an-object', // Wrong payload type
                    },
                ],
            };
            // When: Validating upsert request
            try {
                // Simulate validation
                assert.fail('Expected upsert request validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate point IDs', () => {
            // Given: Various point IDs
            void [1, 'string-id', 123.45, true];
            void [null, undefined, {}, []];
            // When: Validating point IDs
            try {
                // Simulate validation
                assert.fail('Expected ID validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate payload structure', () => {
            // Given: Various payloads
            void [
                null, // No payload
                {}, // Empty object
                { text: 'string', number: 123, boolean: true, array: [1, 2, 3] },
                { nested: { object: { deep: 'value' } } },
            ];
            void [
                'string', // Primitive
                123, // Number
                true, // Boolean
                [1, 2, 3], // Array (should be object)
            ];
            // When: Validating payload structure
            try {
                // Simulate validation
                assert.fail('Expected payload validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
    });
    describe('Configuration Validation', () => {
        it('should validate extension configuration', () => {
            // Given: Configuration objects
            void {
                qdrant: {
                    url: 'http://localhost:6333',
                    apiKey: 'sk-1234567890abcdef',
                    timeout: 30000,
                    retries: 3,
                    retryDelay: 1000,
                },
            };
            void {
                qdrant: {
                    url: 'not-a-url',
                    apiKey: '',
                    timeout: -1,
                    retries: -5,
                    retryDelay: 'not-a-number',
                },
            };
            // When: Validating configuration
            try {
                // Simulate validation
                assert.fail('Expected config validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate URL format', () => {
            // Given: Various URLs
            void [
                'http://localhost:6333',
                'https://qdrant.example.com:6333',
                'http://127.0.0.1:6333',
                'https://qdrant.cloud:6333/collections',
            ];
            void ['not-a-url', 'ftp://example.com', 'http://', '', null, 123];
            // When: Validating URL format
            try {
                // Simulate validation
                assert.fail('Expected URL validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate numeric configuration values', () => {
            // Given: Numeric configuration values
            void {
                timeout: [1000, 30000, 60000],
                retries: [0, 3, 10],
                retryDelay: [0, 1000, 5000],
            };
            void {
                timeout: [-1, 0, 'not-a-number'],
                retries: [-1, 'not-a-number'],
                retryDelay: [-100, 'not-a-number'],
            };
            // When: Validating numeric values
            try {
                // Simulate validation
                assert.fail('Expected numeric validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
    });
    describe('Response Data Validation', () => {
        it('should validate search response format', () => {
            // Given: Search response data
            void {
                result: [
                    {
                        id: 1,
                        score: 0.95,
                        payload: { text: 'matching result' },
                        vector: [0.1, 0.2, 0.3],
                    },
                ],
                status: 'ok',
                time: 0.001,
            };
            void {
                result: 'not-an-array',
                status: 'error',
                time: 'not-a-number',
            };
            // When: Validating search response
            try {
                // Simulate validation
                assert.fail('Expected response validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate collection info response', () => {
            // Given: Collection info response
            void {
                result: {
                    name: 'test-collection',
                    vector_count: 1000,
                    status: 'green',
                    config: {
                        params: {
                            vectors: {
                                size: 128,
                                distance: 'Cosine',
                            },
                        },
                    },
                },
                status: 'ok',
                time: 0.001,
            };
            void {
                result: {
                    name: null,
                    vector_count: 'not-a-number',
                    status: 'invalid-status',
                },
            };
            // When: Validating collection info
            try {
                // Simulate validation
                assert.fail('Expected collection info validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
        it('should validate error response format', () => {
            // Given: Error response data
            void {
                status: 'error',
                message: 'Collection not found',
                code: 404,
                time: 0.001,
            };
            void {
                status: 'ok', // Wrong status for error
                message: null, // Missing message
                code: 'not-a-number', // Wrong type
            };
            // When: Validating error response
            try {
                // Simulate validation
                assert.fail('Expected error response validation to fail - not implemented');
            }
            catch (error) {
                // Then: Should throw not implemented error
                assert.strictEqual(error.message, 'Not implemented');
            }
        });
    });
});
//# sourceMappingURL=test-data-models.js.map