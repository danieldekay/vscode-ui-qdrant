"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const errors_1 = require("../../src/types/errors");
describe('Qdrant Error Classes', () => {
    describe('QdrantError', () => {
        it('should create error with required parameters', () => {
            const error = new errors_1.QdrantError('Test message', 'TEST_CODE');
            (0, chai_1.expect)(error.message).to.equal('Test message');
            (0, chai_1.expect)(error.code).to.equal('TEST_CODE');
            (0, chai_1.expect)(error.name).to.equal('QdrantError');
            (0, chai_1.expect)(error.isRetryable).to.be.false;
            (0, chai_1.expect)(error.details).to.be.undefined;
        });
        it('should create error with all parameters', () => {
            const details = { key: 'value' };
            const error = new errors_1.QdrantError('Test message', 'TEST_CODE', true, details);
            (0, chai_1.expect)(error.message).to.equal('Test message');
            (0, chai_1.expect)(error.code).to.equal('TEST_CODE');
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.details).to.deep.equal(details);
        });
        it('should maintain instanceof relationship', () => {
            const error = new errors_1.QdrantError('Test', 'TEST');
            (0, chai_1.expect)(error).to.be.instanceof(Error);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
        });
        describe('QdrantError.from', () => {
            it('should return QdrantError instances unchanged', () => {
                const original = new errors_1.QdrantError('Original', 'ORIGINAL');
                const result = errors_1.QdrantError.from(original);
                (0, chai_1.expect)(result).to.equal(original);
            });
            it('should wrap Error instances', () => {
                const original = new Error('Wrapped error');
                const result = errors_1.QdrantError.from(original);
                (0, chai_1.expect)(result).to.be.instanceof(errors_1.QdrantError);
                (0, chai_1.expect)(result.message).to.equal('Wrapped error');
                (0, chai_1.expect)(result.code).to.equal('UNKNOWN_ERROR');
                (0, chai_1.expect)(result.isRetryable).to.be.false;
                (0, chai_1.expect)(result.details).to.have.property('originalError', original);
            });
            it('should wrap unknown errors', () => {
                const result = errors_1.QdrantError.from('string error');
                (0, chai_1.expect)(result).to.be.instanceof(errors_1.QdrantError);
                (0, chai_1.expect)(result.message).to.equal('Unknown Qdrant error');
                (0, chai_1.expect)(result.code).to.equal('UNKNOWN_ERROR');
                (0, chai_1.expect)(result.details).to.have.property('originalError', 'string error');
            });
            it('should use custom default message', () => {
                const result = errors_1.QdrantError.from(null, 'Custom message');
                (0, chai_1.expect)(result.message).to.equal('Custom message');
            });
        });
    });
    describe('QdrantConnectionError', () => {
        it('should create connection error', () => {
            const error = new errors_1.QdrantConnectionError('Connection failed');
            (0, chai_1.expect)(error.message).to.equal('Connection failed');
            (0, chai_1.expect)(error.code).to.equal('CONNECTION_ERROR');
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.name).to.equal('QdrantConnectionError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantConnectionError('Connection failed');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantConnectionError);
        });
    });
    describe('QdrantAuthenticationError', () => {
        it('should create authentication error', () => {
            const error = new errors_1.QdrantAuthenticationError('Auth failed');
            (0, chai_1.expect)(error.message).to.equal('Auth failed');
            (0, chai_1.expect)(error.code).to.equal('AUTHENTICATION_ERROR');
            (0, chai_1.expect)(error.isRetryable).to.be.false;
            (0, chai_1.expect)(error.name).to.equal('QdrantAuthenticationError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantAuthenticationError('Auth failed');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantAuthenticationError);
        });
    });
    describe('QdrantCollectionError', () => {
        it('should create collection error', () => {
            const error = new errors_1.QdrantCollectionError('Collection error', 'test_collection');
            (0, chai_1.expect)(error.message).to.equal('Collection error');
            (0, chai_1.expect)(error.code).to.equal('COLLECTION_ERROR');
            (0, chai_1.expect)(error.collectionName).to.equal('test_collection');
            (0, chai_1.expect)(error.name).to.equal('QdrantCollectionError');
            (0, chai_1.expect)(error.details).to.have.property('collectionName', 'test_collection');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantCollectionError('Error', 'collection');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantCollectionError);
        });
    });
    describe('QdrantCollectionExistsError', () => {
        it('should create collection exists error', () => {
            const error = new errors_1.QdrantCollectionExistsError('existing_collection');
            (0, chai_1.expect)(error.message).to.equal("Collection 'existing_collection' already exists");
            (0, chai_1.expect)(error.code).to.equal('COLLECTION_ERROR');
            (0, chai_1.expect)(error.collectionName).to.equal('existing_collection');
            (0, chai_1.expect)(error.name).to.equal('QdrantCollectionExistsError');
        });
        it('should inherit from QdrantCollectionError', () => {
            const error = new errors_1.QdrantCollectionExistsError('collection');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantCollectionError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantCollectionExistsError);
        });
    });
    describe('QdrantCollectionNotFoundError', () => {
        it('should create collection not found error', () => {
            const error = new errors_1.QdrantCollectionNotFoundError('missing_collection');
            (0, chai_1.expect)(error.message).to.equal("Collection 'missing_collection' not found");
            (0, chai_1.expect)(error.code).to.equal('COLLECTION_ERROR');
            (0, chai_1.expect)(error.collectionName).to.equal('missing_collection');
            (0, chai_1.expect)(error.name).to.equal('QdrantCollectionNotFoundError');
        });
        it('should inherit from QdrantCollectionError', () => {
            const error = new errors_1.QdrantCollectionNotFoundError('collection');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantCollectionError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantCollectionNotFoundError);
        });
    });
    describe('QdrantVectorError', () => {
        it('should create vector error without collection name', () => {
            const error = new errors_1.QdrantVectorError('Vector error');
            (0, chai_1.expect)(error.message).to.equal('Vector error');
            (0, chai_1.expect)(error.code).to.equal('VECTOR_ERROR');
            (0, chai_1.expect)(error.collectionName).to.be.undefined;
            (0, chai_1.expect)(error.name).to.equal('QdrantVectorError');
        });
        it('should create vector error with collection name', () => {
            const error = new errors_1.QdrantVectorError('Vector error', 'test_collection');
            (0, chai_1.expect)(error.collectionName).to.equal('test_collection');
            (0, chai_1.expect)(error.details).to.have.property('collectionName', 'test_collection');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantVectorError('Error');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantVectorError);
        });
    });
    describe('QdrantInvalidVectorError', () => {
        it('should create invalid vector error', () => {
            const error = new errors_1.QdrantInvalidVectorError(1536, 100, 'test_collection');
            (0, chai_1.expect)(error.message).to.equal('Invalid vector dimensions: expected 1536, got 100');
            (0, chai_1.expect)(error.code).to.equal('VECTOR_ERROR');
            (0, chai_1.expect)(error.expectedDimensions).to.equal(1536);
            (0, chai_1.expect)(error.actualDimensions).to.equal(100);
            (0, chai_1.expect)(error.collectionName).to.equal('test_collection');
            (0, chai_1.expect)(error.name).to.equal('QdrantInvalidVectorError');
        });
        it('should create invalid vector error without collection name', () => {
            const error = new errors_1.QdrantInvalidVectorError(1536, 100);
            (0, chai_1.expect)(error.collectionName).to.be.undefined;
        });
        it('should inherit from QdrantVectorError', () => {
            const error = new errors_1.QdrantInvalidVectorError(1536, 100);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantVectorError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantInvalidVectorError);
        });
    });
    describe('QdrantSearchError', () => {
        it('should create search error', () => {
            const error = new errors_1.QdrantSearchError('Search failed', 'test_collection');
            (0, chai_1.expect)(error.message).to.equal('Search failed');
            (0, chai_1.expect)(error.code).to.equal('SEARCH_ERROR');
            (0, chai_1.expect)(error.collectionName).to.equal('test_collection');
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.name).to.equal('QdrantSearchError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantSearchError('Error', 'collection');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantSearchError);
        });
    });
    describe('QdrantValidationError', () => {
        it('should create validation error', () => {
            const error = new errors_1.QdrantValidationError('Validation failed', 'field', 'value');
            (0, chai_1.expect)(error.message).to.equal('Validation failed');
            (0, chai_1.expect)(error.code).to.equal('VALIDATION_ERROR');
            (0, chai_1.expect)(error.field).to.equal('field');
            (0, chai_1.expect)(error.value).to.equal('value');
            (0, chai_1.expect)(error.name).to.equal('QdrantValidationError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantValidationError('Error', 'field', 'value');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantValidationError);
        });
    });
    describe('QdrantInvalidCollectionNameError', () => {
        it('should create invalid collection name error', () => {
            const error = new errors_1.QdrantInvalidCollectionNameError('invalid@name');
            (0, chai_1.expect)(error.message).to.equal("Invalid collection name: 'invalid@name'. Collection names must match pattern: ^[a-zA-Z0-9_-]+$");
            (0, chai_1.expect)(error.code).to.equal('VALIDATION_ERROR');
            (0, chai_1.expect)(error.field).to.equal('collectionName');
            (0, chai_1.expect)(error.value).to.equal('invalid@name');
            (0, chai_1.expect)(error.name).to.equal('QdrantInvalidCollectionNameError');
        });
        it('should inherit from QdrantValidationError', () => {
            const error = new errors_1.QdrantInvalidCollectionNameError('invalid');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantValidationError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantInvalidCollectionNameError);
        });
    });
    describe('QdrantConfigurationError', () => {
        it('should create configuration error', () => {
            const error = new errors_1.QdrantConfigurationError('Config error');
            (0, chai_1.expect)(error.message).to.equal('Config error');
            (0, chai_1.expect)(error.code).to.equal('CONFIGURATION_ERROR');
            (0, chai_1.expect)(error.isRetryable).to.be.false;
            (0, chai_1.expect)(error.name).to.equal('QdrantConfigurationError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantConfigurationError('Error');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantConfigurationError);
        });
    });
    describe('QdrantRateLimitError', () => {
        it('should create rate limit error', () => {
            const error = new errors_1.QdrantRateLimitError('Rate limited', 60);
            (0, chai_1.expect)(error.message).to.equal('Rate limited');
            (0, chai_1.expect)(error.code).to.equal('RATE_LIMIT_ERROR');
            (0, chai_1.expect)(error.retryAfter).to.equal(60);
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.name).to.equal('QdrantRateLimitError');
        });
        it('should create rate limit error without retry after', () => {
            const error = new errors_1.QdrantRateLimitError('Rate limited');
            (0, chai_1.expect)(error.retryAfter).to.be.undefined;
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantRateLimitError('Error');
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantRateLimitError);
        });
    });
    describe('QdrantServerError', () => {
        it('should create server error with 5xx status as retryable', () => {
            const error = new errors_1.QdrantServerError('Server error', 500);
            (0, chai_1.expect)(error.message).to.equal('Server error');
            (0, chai_1.expect)(error.code).to.equal('SERVER_ERROR');
            (0, chai_1.expect)(error.statusCode).to.equal(500);
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.name).to.equal('QdrantServerError');
        });
        it('should create server error with 4xx status as non-retryable', () => {
            const error = new errors_1.QdrantServerError('Client error', 404);
            (0, chai_1.expect)(error.isRetryable).to.be.false;
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantServerError('Error', 500);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantServerError);
        });
    });
    describe('QdrantTimeoutError', () => {
        it('should create timeout error', () => {
            const error = new errors_1.QdrantTimeoutError('Timeout', 30000);
            (0, chai_1.expect)(error.message).to.equal('Timeout');
            (0, chai_1.expect)(error.code).to.equal('TIMEOUT_ERROR');
            (0, chai_1.expect)(error.timeoutMs).to.equal(30000);
            (0, chai_1.expect)(error.isRetryable).to.be.true;
            (0, chai_1.expect)(error.name).to.equal('QdrantTimeoutError');
        });
        it('should inherit from QdrantError', () => {
            const error = new errors_1.QdrantTimeoutError('Error', 1000);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantError);
            (0, chai_1.expect)(error).to.be.instanceof(errors_1.QdrantTimeoutError);
        });
    });
});
//# sourceMappingURL=test-errors.unit.js.map