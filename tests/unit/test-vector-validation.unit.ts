import { expect } from 'chai';
import { QdrantInvalidVectorError } from '../../src/types/errors';
import {
  areValidVectors,
  isValidVector,
  validateVector,
  validateVectors,
} from '../../src/validation/vector';

describe('Vector Validation', () => {
  const VALID_VECTOR_DIMENSION = 1536;

  describe('validateVector', () => {
    it('should accept valid vectors with correct dimension', () => {
      const validVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
      expect(() => validateVector(validVector)).to.not.throw();
    });

    it('should accept vectors with various valid values', () => {
      const testCases = [
        new Array(VALID_VECTOR_DIMENSION).fill(0),
        new Array(VALID_VECTOR_DIMENSION).fill(1),
        new Array(VALID_VECTOR_DIMENSION).fill(-1),
        new Array(VALID_VECTOR_DIMENSION).fill(0.123456),
        new Array(VALID_VECTOR_DIMENSION).fill(-0.987654),
        Array.from({ length: VALID_VECTOR_DIMENSION }, (_, i) => i * 0.001),
      ];

      for (const vector of testCases) {
        expect(() => validateVector(vector)).to.not.throw();
      }
    });

    it('should reject non-array inputs', () => {
      expect(() => validateVector(null as any)).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector(undefined as any)).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector(123 as any)).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector('not an array' as any)).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector({} as any)).to.throw(QdrantInvalidVectorError);
    });

    it('should reject vectors with wrong dimension', () => {
      expect(() => validateVector([])).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector([1, 2, 3])).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector(new Array(1000).fill(0.5))).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector(new Array(2000).fill(0.5))).to.throw(QdrantInvalidVectorError);
    });

    it('should reject vectors with non-finite numbers', () => {
      const baseVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);

      // Test NaN
      const nanVector = [...baseVector];
      nanVector[0] = NaN;
      expect(() => validateVector(nanVector)).to.throw(QdrantInvalidVectorError);

      // Test Infinity
      const infVector = [...baseVector];
      infVector[0] = Infinity;
      expect(() => validateVector(infVector)).to.throw(QdrantInvalidVectorError);

      // Test -Infinity
      const negInfVector = [...baseVector];
      negInfVector[0] = -Infinity;
      expect(() => validateVector(negInfVector)).to.throw(QdrantInvalidVectorError);
    });

    it('should reject vectors with non-number elements', () => {
      const baseVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);

      // Test string
      const stringVector = [...baseVector];
      (stringVector as any)[0] = 'not a number';
      expect(() => validateVector(stringVector)).to.throw(QdrantInvalidVectorError);

      // Test null
      const nullVector = [...baseVector];
      (nullVector as any)[0] = null;
      expect(() => validateVector(nullVector)).to.throw(QdrantInvalidVectorError);

      // Test undefined
      const undefinedVector = [...baseVector];
      (undefinedVector as any)[0] = undefined;
      expect(() => validateVector(undefinedVector)).to.throw(QdrantInvalidVectorError);
    });

    it('should include collection name in error when provided', () => {
      const collectionName = 'test_collection';
      expect(() => validateVector([], collectionName)).to.throw(QdrantInvalidVectorError);
      expect(() => validateVector([1, 2, 3], collectionName)).to.throw(QdrantInvalidVectorError);
    });
  });

  describe('validateVectors', () => {
    it('should accept arrays of valid vectors', () => {
      const validVectors = [
        new Array(VALID_VECTOR_DIMENSION).fill(0.1),
        new Array(VALID_VECTOR_DIMENSION).fill(0.2),
        new Array(VALID_VECTOR_DIMENSION).fill(0.3),
      ];
      expect(() => validateVectors(validVectors)).to.not.throw();
    });

    it('should reject arrays containing invalid vectors', () => {
      const invalidVectors = [
        new Array(VALID_VECTOR_DIMENSION).fill(0.1),
        [1, 2, 3], // Wrong dimension
        new Array(VALID_VECTOR_DIMENSION).fill(0.3),
      ];
      expect(() => validateVectors(invalidVectors)).to.throw(QdrantInvalidVectorError);
    });

    it('should reject empty arrays', () => {
      expect(() => validateVectors([])).to.not.throw();
    });

    it('should reject non-array inputs', () => {
      expect(() => validateVectors(null as any)).to.throw();
      expect(() => validateVectors(undefined as any)).to.throw();
      expect(() => validateVectors(123 as any)).to.throw();
    });
  });

  describe('isValidVector', () => {
    it('should return true for valid vectors', () => {
      const validVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
      expect(isValidVector(validVector)).to.be.true;
    });

    it('should return false for invalid vectors', () => {
      expect(isValidVector([])).to.be.false;
      expect(isValidVector([1, 2, 3])).to.be.false;
      expect(isValidVector(null as any)).to.be.false;
      expect(isValidVector(undefined as any)).to.be.false;
      expect(isValidVector([NaN, ...new Array(VALID_VECTOR_DIMENSION - 1).fill(0.5)])).to.be.false;
    });
  });

  describe('areValidVectors', () => {
    it('should return true for arrays of valid vectors', () => {
      const validVectors = [
        new Array(VALID_VECTOR_DIMENSION).fill(0.1),
        new Array(VALID_VECTOR_DIMENSION).fill(0.2),
      ];
      expect(areValidVectors(validVectors)).to.be.true;
    });

    it('should return false for arrays containing invalid vectors', () => {
      const invalidVectors = [
        new Array(VALID_VECTOR_DIMENSION).fill(0.1),
        [1, 2, 3], // Invalid
      ];
      expect(areValidVectors(invalidVectors)).to.be.false;
    });

    it('should return true for empty arrays', () => {
      expect(areValidVectors([])).to.be.true;
    });

    it('should return false for non-array inputs', () => {
      expect(areValidVectors(null as any)).to.be.false;
      expect(areValidVectors(undefined as any)).to.be.false;
      expect(areValidVectors(123 as any)).to.be.false;
    });
  });
});
