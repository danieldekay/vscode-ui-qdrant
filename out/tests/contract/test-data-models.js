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
const validation_1 = require("../../src/validation");
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
            // Given: Valid collection creation data
            const validSchema = {
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
            // When: Validating valid schema
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateCollectionSchema)(validSchema));
            // Given: Invalid collection creation data
            const invalidSchemas = [
                {
                    name: '', // Invalid: empty name
                    vectors: {
                        size: 128,
                        distance: 'Cosine',
                    },
                },
                {
                    name: 'test-collection',
                    vectors: {
                        size: -1, // Invalid: negative size
                        distance: 'Cosine',
                    },
                },
                {
                    name: 'test-collection',
                    vectors: {
                        size: 128,
                        distance: 'InvalidDistance', // Invalid: wrong distance
                    },
                },
            ];
            // When: Validating invalid schemas
            // Then: Should throw ValidationError
            for (const invalidSchema of invalidSchemas) {
                assert.throws(() => (0, validation_1.validateCollectionSchema)(invalidSchema), validation_1.ValidationError);
            }
        });
        it('should validate collection name format', () => {
            // Given: Valid collection names
            const validNames = [
                'my-collection',
                'collection_123',
                'test.collection',
                'a',
                'collection-with-dashes',
            ];
            // When: Validating valid names
            // Then: Should not throw
            for (const name of validNames) {
                assert.doesNotThrow(() => (0, validation_1.validateCollectionName)(name));
            }
            // Given: Invalid collection names
            const invalidNames = [
                '', // Empty
                'collection with spaces', // Spaces
                'collection/with/slashes', // Slashes
                'collection\\with\\backslashes', // Backslashes
                'collection@with@symbols', // Special chars
            ];
            // When: Validating invalid names
            // Then: Should throw ValidationError
            for (const name of invalidNames) {
                assert.throws(() => (0, validation_1.validateCollectionName)(name), validation_1.ValidationError);
            }
        });
        it('should validate vector configuration', () => {
            // Given: Valid vector configurations
            const validConfigs = [
                { size: 1, distance: 'Cosine' },
                { size: 4096, distance: 'Euclid' },
                { size: 768, distance: 'Dot' },
            ];
            // When: Validating valid configs
            // Then: Should not throw
            for (const config of validConfigs) {
                assert.doesNotThrow(() => (0, validation_1.validateVectorConfig)(config));
            }
            // Given: Invalid vector configurations
            const invalidConfigs = [
                { size: 0 }, // Size too small
                { size: 100000 }, // Size too large
                { size: 128, distance: 'Invalid' }, // Invalid distance
                { size: '128' }, // Wrong type
                {}, // Missing required fields
            ];
            // When: Validating invalid configs
            // Then: Should throw ValidationError
            for (const config of invalidConfigs) {
                assert.throws(() => (0, validation_1.validateVectorConfig)(config), validation_1.ValidationError);
            }
        });
    });
    describe('Search Request Validation', () => {
        it('should validate search request format', () => {
            // Given: Valid search request data
            const validRequest = {
                collectionName: 'test-collection',
                vector: [0.1, 0.2, 0.3, 0.4, 0.5],
                limit: 10,
                offset: 0,
                withPayload: true,
                withVectors: false,
                scoreThreshold: 0.8,
            };
            // When: Validating valid request
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateSearchRequest)(validRequest));
            // Given: Invalid search request data
            const invalidRequests = [
                {
                    collectionName: null, // Invalid type
                    vector: [0.1, 0.2, 0.3],
                },
                {
                    collectionName: 'test-collection',
                    vector: 'not-a-vector', // Wrong type
                },
                {
                    collectionName: 'test-collection',
                    vector: [0.1, 0.2, 0.3],
                    limit: -1, // Negative limit
                },
                {
                    collectionName: 'test-collection',
                    vector: [0.1, 0.2, 0.3],
                    offset: -5, // Negative offset
                },
                {
                    collectionName: 'test-collection',
                    vector: [0.1, 0.2, 0.3],
                    scoreThreshold: 1.5, // Out of range
                },
            ];
            // When: Validating invalid requests
            // Then: Should throw ValidationError
            for (const request of invalidRequests) {
                assert.throws(() => (0, validation_1.validateSearchRequest)(request), validation_1.ValidationError);
            }
        });
        it('should validate vector dimensions match collection', () => {
            // Given: Collection with 128-dim vectors and matching search vector
            const expectedDimensions = 128;
            const matchingVector = new Array(128).fill(0.1);
            // When: Validating matching dimensions
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateVectorDimensions)(matchingVector, expectedDimensions));
            // Given: Wrong size vector
            const wrongSizeVector = new Array(64).fill(0.1);
            // When: Validating wrong dimensions
            // Then: Should throw ValidationError
            assert.throws(() => (0, validation_1.validateVectorDimensions)(wrongSizeVector, expectedDimensions), validation_1.ValidationError);
        });
        it('should validate search parameters', () => {
            // Given: Valid search parameters
            const validParams = {
                limit: 1,
                offset: 0,
                scoreThreshold: 0.0,
                withPayload: true,
                withVectors: false,
            };
            // When: Validating valid parameters
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateSearchParameters)(validParams));
            // Given: Invalid search parameters
            const invalidParams = [
                {
                    limit: 0, // Too small
                },
                {
                    offset: -1, // Negative
                },
                {
                    scoreThreshold: -0.1, // Negative
                },
                {
                    withPayload: 'true', // Wrong type
                },
                {
                    withVectors: null, // Wrong type
                },
            ];
            // When: Validating invalid parameters
            // Then: Should throw ValidationError
            for (const params of invalidParams) {
                assert.throws(() => (0, validation_1.validateSearchParameters)(params), validation_1.ValidationError);
            }
        });
    });
    describe('Upsert Request Validation', () => {
        it('should validate upsert request format', () => {
            // Given: Valid upsert request data
            const validRequest = {
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
            // When: Validating valid request
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateUpsertRequest)(validRequest));
            // Given: Invalid upsert request data
            const invalidRequests = [
                {
                    collectionName: '',
                    points: [
                        {
                            id: 1,
                            vector: [0.1, 0.2, 0.3],
                        },
                    ],
                },
                {
                    collectionName: 'test-collection',
                    points: [
                        {
                            id: null, // Invalid ID
                            vector: [0.1, 0.2, 0.3],
                        },
                    ],
                },
                {
                    collectionName: 'test-collection',
                    points: [
                        {
                            id: 1,
                            vector: [], // Empty vector
                        },
                    ],
                },
                {
                    collectionName: 'test-collection',
                    points: [
                        {
                            id: 1,
                            vector: [0.1, 0.2, 0.3],
                            payload: 'not-an-object', // Wrong payload type
                        },
                    ],
                },
            ];
            // When: Validating invalid requests
            // Then: Should throw ValidationError
            for (const request of invalidRequests) {
                assert.throws(() => (0, validation_1.validateUpsertRequest)(request), validation_1.ValidationError);
            }
        });
        it('should validate point IDs', () => {
            // Given: Valid point IDs
            const validIds = [1, 'string-id', 123.45];
            // When: Validating valid IDs
            // Then: Should not throw
            for (const id of validIds) {
                assert.doesNotThrow(() => (0, validation_1.validateUpsertPoint)({ id, vector: [0.1, 0.2, 0.3] }));
            }
            // Given: Invalid point IDs
            const invalidIds = [null, undefined, true, {}, []];
            // When: Validating invalid IDs
            // Then: Should throw ValidationError
            for (const id of invalidIds) {
                assert.throws(() => (0, validation_1.validateUpsertPoint)({ id, vector: [0.1, 0.2, 0.3] }), validation_1.ValidationError);
            }
        });
        it('should validate payload structure', () => {
            // Given: Valid payloads
            const validPayloads = [
                null, // No payload
                {}, // Empty object
                { text: 'string', number: 123, boolean: true, array: [1, 2, 3] },
                { nested: { object: { deep: 'value' } } },
            ];
            // When: Validating valid payloads
            // Then: Should not throw
            for (const payload of validPayloads) {
                assert.doesNotThrow(() => (0, validation_1.validatePayload)(payload));
            }
            // Given: Invalid payloads
            const invalidPayloads = [
                'string', // Primitive
                123, // Number
                true, // Boolean
                [1, 2, 3], // Array (should be object)
            ];
            // When: Validating invalid payloads
            // Then: Should throw ValidationError
            for (const payload of invalidPayloads) {
                assert.throws(() => (0, validation_1.validatePayload)(payload), validation_1.ValidationError);
            }
        });
    });
    describe('Configuration Validation', () => {
        it('should validate extension configuration', () => {
            // Given: Valid configuration objects
            const validConfig = {
                qdrant: {
                    url: 'http://localhost:6333',
                    apiKey: 'sk-1234567890abcdef',
                    timeout: 30000,
                    retries: 3,
                    retryDelay: 1000,
                },
            };
            // When: Validating valid configuration
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateExtensionConfig)(validConfig));
            // Given: Invalid configuration objects
            const invalidConfigs = [
                {
                    qdrant: {
                        url: 'not-a-url',
                        apiKey: '',
                        timeout: -1,
                        retries: -5,
                        retryDelay: 'not-a-number',
                    },
                },
            ];
            // When: Validating invalid configurations
            // Then: Should throw ValidationError
            for (const config of invalidConfigs) {
                assert.throws(() => (0, validation_1.validateExtensionConfig)(config), validation_1.ValidationError);
            }
        });
        it('should validate URL format', () => {
            // Given: Valid URLs
            const validUrls = [
                'http://localhost:6333',
                'https://qdrant.example.com:6333',
                'http://127.0.0.1:6333',
                'https://qdrant.cloud:6333/collections',
            ];
            // When: Validating valid URLs
            // Then: Should not throw
            for (const url of validUrls) {
                assert.doesNotThrow(() => (0, validation_1.validateUrl)(url));
            }
            // Given: Invalid URLs
            const invalidUrls = ['not-a-url', 'ftp://example.com', 'http://', ''];
            // When: Validating invalid URLs
            // Then: Should throw ValidationError
            for (const url of invalidUrls) {
                assert.throws(() => (0, validation_1.validateUrl)(url), validation_1.ValidationError);
            }
            // Given: Invalid URL types
            const invalidUrlTypes = [null, 123];
            // When: Validating invalid URL types
            // Then: Should throw ValidationError
            for (const url of invalidUrlTypes) {
                assert.throws(() => (0, validation_1.validateUrl)(url), validation_1.ValidationError);
            }
        });
        it('should validate numeric configuration values', () => {
            // Given: Valid numeric configuration values
            const validValues = {
                timeout: [1000, 30000, 60000],
                retries: [0, 3, 10],
                retryDelay: [0, 1000, 5000],
            };
            // When: Validating valid values
            // Then: Should not throw
            for (const timeout of validValues.timeout) {
                assert.doesNotThrow(() => (0, validation_1.validateNumericConfig)(timeout, 'timeout', 1000, 300000));
            }
            for (const retries of validValues.retries) {
                assert.doesNotThrow(() => (0, validation_1.validateNumericConfig)(retries, 'retries', 0, 10));
            }
            for (const retryDelay of validValues.retryDelay) {
                assert.doesNotThrow(() => (0, validation_1.validateNumericConfig)(retryDelay, 'retryDelay', 0, 60000));
            }
            // Given: Invalid numeric configuration values
            const invalidValues = {
                timeout: [-1, 0, 'not-a-number'],
                retries: [-1, 'not-a-number'],
                retryDelay: [-100, 'not-a-number'],
            };
            // When: Validating invalid values
            // Then: Should throw ValidationError
            for (const timeout of invalidValues.timeout) {
                assert.throws(() => (0, validation_1.validateNumericConfig)(timeout, 'timeout', 1000, 300000), validation_1.ValidationError);
            }
            for (const retries of invalidValues.retries) {
                assert.throws(() => (0, validation_1.validateNumericConfig)(retries, 'retries', 0, 10), validation_1.ValidationError);
            }
            for (const retryDelay of invalidValues.retryDelay) {
                assert.throws(() => (0, validation_1.validateNumericConfig)(retryDelay, 'retryDelay', 0, 60000), validation_1.ValidationError);
            }
        });
    });
    describe('Response Data Validation', () => {
        it('should validate search response format', () => {
            // Given: Valid search response data
            const validResponse = {
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
            // When: Validating valid response
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateSearchResponse)(validResponse));
            // Given: Invalid search response data
            const invalidResponses = [
                {
                    result: 'not-an-array',
                    status: 'ok',
                    time: 0.001,
                },
                {
                    result: [],
                    status: 'error',
                    time: 0.001,
                },
                {
                    result: [],
                    status: 'ok',
                    time: 'not-a-number',
                },
            ];
            // When: Validating invalid responses
            // Then: Should throw ValidationError
            for (const response of invalidResponses) {
                assert.throws(() => (0, validation_1.validateSearchResponse)(response), validation_1.ValidationError);
            }
        });
        it('should validate collection info response', () => {
            // Given: Valid collection info response
            const validResponse = {
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
            // When: Validating valid response
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateCollectionInfoResponse)(validResponse));
            // Given: Invalid collection info response
            const invalidResponses = [
                {
                    result: {
                        name: null,
                        vector_count: 'not-a-number',
                        status: 'invalid-status',
                    },
                    status: 'ok',
                    time: 0.001,
                },
            ];
            // When: Validating invalid responses
            // Then: Should throw ValidationError
            for (const response of invalidResponses) {
                assert.throws(() => (0, validation_1.validateCollectionInfoResponse)(response), validation_1.ValidationError);
            }
        });
        it('should validate error response format', () => {
            // Given: Valid error response data
            const validErrorResponse = {
                status: 'error',
                message: 'Collection not found',
                code: 404,
                time: 0.001,
            };
            // When: Validating valid error response
            // Then: Should not throw
            assert.doesNotThrow(() => (0, validation_1.validateErrorResponse)(validErrorResponse));
            // Given: Invalid error response data
            const invalidErrorResponses = [
                {
                    status: 'ok', // Wrong status for error
                    message: 'Some message',
                    time: 0.001,
                },
                {
                    status: 'error',
                    message: null, // Missing message
                    time: 0.001,
                },
                {
                    status: 'error',
                    message: 'Error message',
                    code: 'not-a-number', // Wrong type
                    time: 0.001,
                },
                {
                    status: 'error',
                    message: 'Error message',
                    code: 404,
                    time: 'not-a-number', // Wrong type
                },
            ];
            // When: Validating invalid error responses
            // Then: Should throw ValidationError
            for (const response of invalidErrorResponses) {
                assert.throws(() => (0, validation_1.validateErrorResponse)(response), validation_1.ValidationError);
            }
        });
    });
});
//# sourceMappingURL=test-data-models.js.map