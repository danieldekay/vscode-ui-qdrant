"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const errors_1 = require("../../src/types/errors");
const collection_1 = require("../../src/validation/collection");
describe('Collection Validation', () => {
    describe('validateCollectionName', () => {
        it('should accept valid collection names', () => {
            // Simple alphanumeric names
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test')).to.not.throw();
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('Test123')).to.not.throw();
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('my_collection')).to.not.throw();
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('my-collection')).to.not.throw();
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('collection_123')).to.not.throw();
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('COLLECTION')).to.not.throw();
        });
        it('should accept collection names with maximum length', () => {
            const maxLengthName = 'a'.repeat(255);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(maxLengthName)).to.not.throw();
        });
        it('should reject null or undefined names', () => {
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(null)).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(undefined)).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
        it('should reject empty strings', () => {
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('')).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
        it('should reject names with leading/trailing whitespace', () => {
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(' test')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test ')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(' test ')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('\ttest')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test\n')).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
        it('should reject names that are too long', () => {
            const tooLongName = 'a'.repeat(256);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(tooLongName)).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
        it('should reject names with invalid characters', () => {
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test@collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test.collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test#collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test$collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test%collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test^collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test&collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test*collection')).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)('test(collection)')).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
        it('should reject non-string inputs', () => {
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(123)).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)({})).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)([])).to.throw(errors_1.QdrantInvalidCollectionNameError);
            (0, chai_1.expect)(() => (0, collection_1.validateCollectionName)(true)).to.throw(errors_1.QdrantInvalidCollectionNameError);
        });
    });
    describe('isValidCollectionName', () => {
        it('should return true for valid collection names', () => {
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('test')).to.be.true;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('Test123')).to.be.true;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('my_collection')).to.be.true;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('my-collection')).to.be.true;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('collection_123')).to.be.true;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('COLLECTION')).to.be.true;
        });
        it('should return false for invalid collection names', () => {
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)(null)).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)(undefined)).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)(' test')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('test ')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('test@collection')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('test.collection')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('test collection')).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)('a'.repeat(256))).to.be.false;
        });
        it('should return false for non-string inputs', () => {
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)(123)).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)({})).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)([])).to.be.false;
            (0, chai_1.expect)((0, collection_1.isValidCollectionName)(true)).to.be.false;
        });
    });
});
//# sourceMappingURL=test-collection-validation.unit.js.map