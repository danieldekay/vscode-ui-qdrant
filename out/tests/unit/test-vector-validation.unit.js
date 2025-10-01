"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const errors_1 = require("../../src/types/errors");
const vector_1 = require("../../src/validation/vector");
describe('Vector Validation', () => {
    const VALID_VECTOR_DIMENSION = 1536;
    describe('validateVector', () => {
        it('should accept valid vectors with correct dimension', () => {
            const validVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(validVector)).to.not.throw();
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
                (0, chai_1.expect)(() => (0, vector_1.validateVector)(vector)).to.not.throw();
            }
        });
        it('should reject non-array inputs', () => {
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(null)).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(undefined)).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(123)).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)('not an array')).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)({})).to.throw(errors_1.QdrantInvalidVectorError);
        });
        it('should reject vectors with wrong dimension', () => {
            (0, chai_1.expect)(() => (0, vector_1.validateVector)([])).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)([1, 2, 3])).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(new Array(1000).fill(0.5))).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(new Array(2000).fill(0.5))).to.throw(errors_1.QdrantInvalidVectorError);
        });
        it('should reject vectors with non-finite numbers', () => {
            const baseVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
            // Test NaN
            const nanVector = [...baseVector];
            nanVector[0] = NaN;
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(nanVector)).to.throw(errors_1.QdrantInvalidVectorError);
            // Test Infinity
            const infVector = [...baseVector];
            infVector[0] = Infinity;
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(infVector)).to.throw(errors_1.QdrantInvalidVectorError);
            // Test -Infinity
            const negInfVector = [...baseVector];
            negInfVector[0] = -Infinity;
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(negInfVector)).to.throw(errors_1.QdrantInvalidVectorError);
        });
        it('should reject vectors with non-number elements', () => {
            const baseVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
            // Test string
            const stringVector = [...baseVector];
            stringVector[0] = 'not a number';
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(stringVector)).to.throw(errors_1.QdrantInvalidVectorError);
            // Test null
            const nullVector = [...baseVector];
            nullVector[0] = null;
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(nullVector)).to.throw(errors_1.QdrantInvalidVectorError);
            // Test undefined
            const undefinedVector = [...baseVector];
            undefinedVector[0] = undefined;
            (0, chai_1.expect)(() => (0, vector_1.validateVector)(undefinedVector)).to.throw(errors_1.QdrantInvalidVectorError);
        });
        it('should include collection name in error when provided', () => {
            const collectionName = 'test_collection';
            (0, chai_1.expect)(() => (0, vector_1.validateVector)([], collectionName)).to.throw(errors_1.QdrantInvalidVectorError);
            (0, chai_1.expect)(() => (0, vector_1.validateVector)([1, 2, 3], collectionName)).to.throw(errors_1.QdrantInvalidVectorError);
        });
    });
    describe('validateVectors', () => {
        it('should accept arrays of valid vectors', () => {
            const validVectors = [
                new Array(VALID_VECTOR_DIMENSION).fill(0.1),
                new Array(VALID_VECTOR_DIMENSION).fill(0.2),
                new Array(VALID_VECTOR_DIMENSION).fill(0.3),
            ];
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)(validVectors)).to.not.throw();
        });
        it('should reject arrays containing invalid vectors', () => {
            const invalidVectors = [
                new Array(VALID_VECTOR_DIMENSION).fill(0.1),
                [1, 2, 3], // Wrong dimension
                new Array(VALID_VECTOR_DIMENSION).fill(0.3),
            ];
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)(invalidVectors)).to.throw(errors_1.QdrantInvalidVectorError);
        });
        it('should reject empty arrays', () => {
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)([])).to.not.throw();
        });
        it('should reject non-array inputs', () => {
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)(null)).to.throw();
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)(undefined)).to.throw();
            (0, chai_1.expect)(() => (0, vector_1.validateVectors)(123)).to.throw();
        });
    });
    describe('isValidVector', () => {
        it('should return true for valid vectors', () => {
            const validVector = new Array(VALID_VECTOR_DIMENSION).fill(0.5);
            (0, chai_1.expect)((0, vector_1.isValidVector)(validVector)).to.be.true;
        });
        it('should return false for invalid vectors', () => {
            (0, chai_1.expect)((0, vector_1.isValidVector)([])).to.be.false;
            (0, chai_1.expect)((0, vector_1.isValidVector)([1, 2, 3])).to.be.false;
            (0, chai_1.expect)((0, vector_1.isValidVector)(null)).to.be.false;
            (0, chai_1.expect)((0, vector_1.isValidVector)(undefined)).to.be.false;
            (0, chai_1.expect)((0, vector_1.isValidVector)([NaN, ...new Array(VALID_VECTOR_DIMENSION - 1).fill(0.5)])).to.be.false;
        });
    });
    describe('areValidVectors', () => {
        it('should return true for arrays of valid vectors', () => {
            const validVectors = [
                new Array(VALID_VECTOR_DIMENSION).fill(0.1),
                new Array(VALID_VECTOR_DIMENSION).fill(0.2),
            ];
            (0, chai_1.expect)((0, vector_1.areValidVectors)(validVectors)).to.be.true;
        });
        it('should return false for arrays containing invalid vectors', () => {
            const invalidVectors = [
                new Array(VALID_VECTOR_DIMENSION).fill(0.1),
                [1, 2, 3], // Invalid
            ];
            (0, chai_1.expect)((0, vector_1.areValidVectors)(invalidVectors)).to.be.false;
        });
        it('should return true for empty arrays', () => {
            (0, chai_1.expect)((0, vector_1.areValidVectors)([])).to.be.true;
        });
        it('should return false for non-array inputs', () => {
            (0, chai_1.expect)((0, vector_1.areValidVectors)(null)).to.be.false;
            (0, chai_1.expect)((0, vector_1.areValidVectors)(undefined)).to.be.false;
            (0, chai_1.expect)((0, vector_1.areValidVectors)(123)).to.be.false;
        });
    });
});
//# sourceMappingURL=test-vector-validation.unit.js.map