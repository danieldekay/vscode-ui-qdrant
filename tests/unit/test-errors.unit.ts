import { expect } from 'chai';
import {
  QdrantAuthenticationError,
  QdrantCollectionError,
  QdrantCollectionExistsError,
  QdrantCollectionNotFoundError,
  QdrantConfigurationError,
  QdrantConnectionError,
  QdrantError,
  QdrantInvalidCollectionNameError,
  QdrantInvalidVectorError,
  QdrantRateLimitError,
  QdrantSearchError,
  QdrantServerError,
  QdrantTimeoutError,
  QdrantValidationError,
  QdrantVectorError,
} from '../../src/types/errors';

describe('Qdrant Error Classes', () => {
  describe('QdrantError', () => {
    it('should create error with required parameters', () => {
      const error = new QdrantError('Test message', 'TEST_CODE');
      expect(error.message).to.equal('Test message');
      expect(error.code).to.equal('TEST_CODE');
      expect(error.name).to.equal('QdrantError');
      expect(error.isRetryable).to.be.false;
      expect(error.details).to.be.undefined;
    });

    it('should create error with all parameters', () => {
      const details = { key: 'value' };
      const error = new QdrantError('Test message', 'TEST_CODE', true, details);
      expect(error.message).to.equal('Test message');
      expect(error.code).to.equal('TEST_CODE');
      expect(error.isRetryable).to.be.true;
      expect(error.details).to.deep.equal(details);
    });

    it('should maintain instanceof relationship', () => {
      const error = new QdrantError('Test', 'TEST');
      expect(error).to.be.instanceof(Error);
      expect(error).to.be.instanceof(QdrantError);
    });

    describe('QdrantError.from', () => {
      it('should return QdrantError instances unchanged', () => {
        const original = new QdrantError('Original', 'ORIGINAL');
        const result = QdrantError.from(original);
        expect(result).to.equal(original);
      });

      it('should wrap Error instances', () => {
        const original = new Error('Wrapped error');
        const result = QdrantError.from(original);
        expect(result).to.be.instanceof(QdrantError);
        expect(result.message).to.equal('Wrapped error');
        expect(result.code).to.equal('UNKNOWN_ERROR');
        expect(result.isRetryable).to.be.false;
        expect(result.details).to.have.property('originalError', original);
      });

      it('should wrap unknown errors', () => {
        const result = QdrantError.from('string error');
        expect(result).to.be.instanceof(QdrantError);
        expect(result.message).to.equal('Unknown Qdrant error');
        expect(result.code).to.equal('UNKNOWN_ERROR');
        expect(result.details).to.have.property('originalError', 'string error');
      });

      it('should use custom default message', () => {
        const result = QdrantError.from(null, 'Custom message');
        expect(result.message).to.equal('Custom message');
      });
    });
  });

  describe('QdrantConnectionError', () => {
    it('should create connection error', () => {
      const error = new QdrantConnectionError('Connection failed');
      expect(error.message).to.equal('Connection failed');
      expect(error.code).to.equal('CONNECTION_ERROR');
      expect(error.isRetryable).to.be.true;
      expect(error.name).to.equal('QdrantConnectionError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantConnectionError('Connection failed');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantConnectionError);
    });
  });

  describe('QdrantAuthenticationError', () => {
    it('should create authentication error', () => {
      const error = new QdrantAuthenticationError('Auth failed');
      expect(error.message).to.equal('Auth failed');
      expect(error.code).to.equal('AUTHENTICATION_ERROR');
      expect(error.isRetryable).to.be.false;
      expect(error.name).to.equal('QdrantAuthenticationError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantAuthenticationError('Auth failed');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantAuthenticationError);
    });
  });

  describe('QdrantCollectionError', () => {
    it('should create collection error', () => {
      const error = new QdrantCollectionError('Collection error', 'test_collection');
      expect(error.message).to.equal('Collection error');
      expect(error.code).to.equal('COLLECTION_ERROR');
      expect(error.collectionName).to.equal('test_collection');
      expect(error.name).to.equal('QdrantCollectionError');
      expect(error.details).to.have.property('collectionName', 'test_collection');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantCollectionError('Error', 'collection');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantCollectionError);
    });
  });

  describe('QdrantCollectionExistsError', () => {
    it('should create collection exists error', () => {
      const error = new QdrantCollectionExistsError('existing_collection');
      expect(error.message).to.equal("Collection 'existing_collection' already exists");
      expect(error.code).to.equal('COLLECTION_ERROR');
      expect(error.collectionName).to.equal('existing_collection');
      expect(error.name).to.equal('QdrantCollectionExistsError');
    });

    it('should inherit from QdrantCollectionError', () => {
      const error = new QdrantCollectionExistsError('collection');
      expect(error).to.be.instanceof(QdrantCollectionError);
      expect(error).to.be.instanceof(QdrantCollectionExistsError);
    });
  });

  describe('QdrantCollectionNotFoundError', () => {
    it('should create collection not found error', () => {
      const error = new QdrantCollectionNotFoundError('missing_collection');
      expect(error.message).to.equal("Collection 'missing_collection' not found");
      expect(error.code).to.equal('COLLECTION_ERROR');
      expect(error.collectionName).to.equal('missing_collection');
      expect(error.name).to.equal('QdrantCollectionNotFoundError');
    });

    it('should inherit from QdrantCollectionError', () => {
      const error = new QdrantCollectionNotFoundError('collection');
      expect(error).to.be.instanceof(QdrantCollectionError);
      expect(error).to.be.instanceof(QdrantCollectionNotFoundError);
    });
  });

  describe('QdrantVectorError', () => {
    it('should create vector error without collection name', () => {
      const error = new QdrantVectorError('Vector error');
      expect(error.message).to.equal('Vector error');
      expect(error.code).to.equal('VECTOR_ERROR');
      expect(error.collectionName).to.be.undefined;
      expect(error.name).to.equal('QdrantVectorError');
    });

    it('should create vector error with collection name', () => {
      const error = new QdrantVectorError('Vector error', 'test_collection');
      expect(error.collectionName).to.equal('test_collection');
      expect(error.details).to.have.property('collectionName', 'test_collection');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantVectorError('Error');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantVectorError);
    });
  });

  describe('QdrantInvalidVectorError', () => {
    it('should create invalid vector error', () => {
      const error = new QdrantInvalidVectorError(1536, 100, 'test_collection');
      expect(error.message).to.equal('Invalid vector dimensions: expected 1536, got 100');
      expect(error.code).to.equal('VECTOR_ERROR');
      expect(error.expectedDimensions).to.equal(1536);
      expect(error.actualDimensions).to.equal(100);
      expect(error.collectionName).to.equal('test_collection');
      expect(error.name).to.equal('QdrantInvalidVectorError');
    });

    it('should create invalid vector error without collection name', () => {
      const error = new QdrantInvalidVectorError(1536, 100);
      expect(error.collectionName).to.be.undefined;
    });

    it('should inherit from QdrantVectorError', () => {
      const error = new QdrantInvalidVectorError(1536, 100);
      expect(error).to.be.instanceof(QdrantVectorError);
      expect(error).to.be.instanceof(QdrantInvalidVectorError);
    });
  });

  describe('QdrantSearchError', () => {
    it('should create search error', () => {
      const error = new QdrantSearchError('Search failed', 'test_collection');
      expect(error.message).to.equal('Search failed');
      expect(error.code).to.equal('SEARCH_ERROR');
      expect(error.collectionName).to.equal('test_collection');
      expect(error.isRetryable).to.be.true;
      expect(error.name).to.equal('QdrantSearchError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantSearchError('Error', 'collection');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantSearchError);
    });
  });

  describe('QdrantValidationError', () => {
    it('should create validation error', () => {
      const error = new QdrantValidationError('Validation failed', 'field', 'value');
      expect(error.message).to.equal('Validation failed');
      expect(error.code).to.equal('VALIDATION_ERROR');
      expect(error.field).to.equal('field');
      expect(error.value).to.equal('value');
      expect(error.name).to.equal('QdrantValidationError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantValidationError('Error', 'field', 'value');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantValidationError);
    });
  });

  describe('QdrantInvalidCollectionNameError', () => {
    it('should create invalid collection name error', () => {
      const error = new QdrantInvalidCollectionNameError('invalid@name');
      expect(error.message).to.equal(
        "Invalid collection name: 'invalid@name'. Collection names must match pattern: ^[a-zA-Z0-9_-]+$",
      );
      expect(error.code).to.equal('VALIDATION_ERROR');
      expect(error.field).to.equal('collectionName');
      expect(error.value).to.equal('invalid@name');
      expect(error.name).to.equal('QdrantInvalidCollectionNameError');
    });

    it('should inherit from QdrantValidationError', () => {
      const error = new QdrantInvalidCollectionNameError('invalid');
      expect(error).to.be.instanceof(QdrantValidationError);
      expect(error).to.be.instanceof(QdrantInvalidCollectionNameError);
    });
  });

  describe('QdrantConfigurationError', () => {
    it('should create configuration error', () => {
      const error = new QdrantConfigurationError('Config error');
      expect(error.message).to.equal('Config error');
      expect(error.code).to.equal('CONFIGURATION_ERROR');
      expect(error.isRetryable).to.be.false;
      expect(error.name).to.equal('QdrantConfigurationError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantConfigurationError('Error');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantConfigurationError);
    });
  });

  describe('QdrantRateLimitError', () => {
    it('should create rate limit error', () => {
      const error = new QdrantRateLimitError('Rate limited', 60);
      expect(error.message).to.equal('Rate limited');
      expect(error.code).to.equal('RATE_LIMIT_ERROR');
      expect(error.retryAfter).to.equal(60);
      expect(error.isRetryable).to.be.true;
      expect(error.name).to.equal('QdrantRateLimitError');
    });

    it('should create rate limit error without retry after', () => {
      const error = new QdrantRateLimitError('Rate limited');
      expect(error.retryAfter).to.be.undefined;
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantRateLimitError('Error');
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantRateLimitError);
    });
  });

  describe('QdrantServerError', () => {
    it('should create server error with 5xx status as retryable', () => {
      const error = new QdrantServerError('Server error', 500);
      expect(error.message).to.equal('Server error');
      expect(error.code).to.equal('SERVER_ERROR');
      expect(error.statusCode).to.equal(500);
      expect(error.isRetryable).to.be.true;
      expect(error.name).to.equal('QdrantServerError');
    });

    it('should create server error with 4xx status as non-retryable', () => {
      const error = new QdrantServerError('Client error', 404);
      expect(error.isRetryable).to.be.false;
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantServerError('Error', 500);
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantServerError);
    });
  });

  describe('QdrantTimeoutError', () => {
    it('should create timeout error', () => {
      const error = new QdrantTimeoutError('Timeout', 30000);
      expect(error.message).to.equal('Timeout');
      expect(error.code).to.equal('TIMEOUT_ERROR');
      expect(error.timeoutMs).to.equal(30000);
      expect(error.isRetryable).to.be.true;
      expect(error.name).to.equal('QdrantTimeoutError');
    });

    it('should inherit from QdrantError', () => {
      const error = new QdrantTimeoutError('Error', 1000);
      expect(error).to.be.instanceof(QdrantError);
      expect(error).to.be.instanceof(QdrantTimeoutError);
    });
  });
});
