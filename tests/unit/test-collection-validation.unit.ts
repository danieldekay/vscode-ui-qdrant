import { expect } from 'chai';
import { QdrantInvalidCollectionNameError } from '../../src/types/errors';
import { isValidCollectionName, validateCollectionName } from '../../src/validation/collection';

describe('Collection Validation', () => {
  describe('validateCollectionName', () => {
    it('should accept valid collection names', () => {
      // Simple alphanumeric names
      expect(() => validateCollectionName('test')).to.not.throw();
      expect(() => validateCollectionName('Test123')).to.not.throw();
      expect(() => validateCollectionName('my_collection')).to.not.throw();
      expect(() => validateCollectionName('my-collection')).to.not.throw();
      expect(() => validateCollectionName('collection_123')).to.not.throw();
      expect(() => validateCollectionName('COLLECTION')).to.not.throw();
    });

    it('should accept collection names with maximum length', () => {
      const maxLengthName = 'a'.repeat(255);
      expect(() => validateCollectionName(maxLengthName)).to.not.throw();
    });

    it('should reject null or undefined names', () => {
      expect(() => validateCollectionName(null as any)).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName(undefined as any)).to.throw(
        QdrantInvalidCollectionNameError,
      );
    });

    it('should reject empty strings', () => {
      expect(() => validateCollectionName('')).to.throw(QdrantInvalidCollectionNameError);
    });

    it('should reject names with leading/trailing whitespace', () => {
      expect(() => validateCollectionName(' test')).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName('test ')).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName(' test ')).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName('\ttest')).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName('test\n')).to.throw(QdrantInvalidCollectionNameError);
    });

    it('should reject names that are too long', () => {
      const tooLongName = 'a'.repeat(256);
      expect(() => validateCollectionName(tooLongName)).to.throw(QdrantInvalidCollectionNameError);
    });

    it('should reject names with invalid characters', () => {
      expect(() => validateCollectionName('test@collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test.collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test#collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test$collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test%collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test^collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test&collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test*collection')).to.throw(
        QdrantInvalidCollectionNameError,
      );
      expect(() => validateCollectionName('test(collection)')).to.throw(
        QdrantInvalidCollectionNameError,
      );
    });

    it('should reject non-string inputs', () => {
      expect(() => validateCollectionName(123 as any)).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName({} as any)).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName([] as any)).to.throw(QdrantInvalidCollectionNameError);
      expect(() => validateCollectionName(true as any)).to.throw(QdrantInvalidCollectionNameError);
    });
  });

  describe('isValidCollectionName', () => {
    it('should return true for valid collection names', () => {
      expect(isValidCollectionName('test')).to.be.true;
      expect(isValidCollectionName('Test123')).to.be.true;
      expect(isValidCollectionName('my_collection')).to.be.true;
      expect(isValidCollectionName('my-collection')).to.be.true;
      expect(isValidCollectionName('collection_123')).to.be.true;
      expect(isValidCollectionName('COLLECTION')).to.be.true;
    });

    it('should return false for invalid collection names', () => {
      expect(isValidCollectionName(null as any)).to.be.false;
      expect(isValidCollectionName(undefined as any)).to.be.false;
      expect(isValidCollectionName('')).to.be.false;
      expect(isValidCollectionName(' test')).to.be.false;
      expect(isValidCollectionName('test ')).to.be.false;
      expect(isValidCollectionName('test@collection')).to.be.false;
      expect(isValidCollectionName('test.collection')).to.be.false;
      expect(isValidCollectionName('test collection')).to.be.false;
      expect(isValidCollectionName('a'.repeat(256))).to.be.false;
    });

    it('should return false for non-string inputs', () => {
      expect(isValidCollectionName(123 as any)).to.be.false;
      expect(isValidCollectionName({} as any)).to.be.false;
      expect(isValidCollectionName([] as any)).to.be.false;
      expect(isValidCollectionName(true as any)).to.be.false;
    });
  });
});
