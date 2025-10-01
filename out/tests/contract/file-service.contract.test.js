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
const vscode = __importStar(require("vscode"));
/**
 * Contract tests for the FileService.validateQdrantFile method
 * These tests define the expected behavior and will fail until implementation is complete
 */
suite('File Validation Service - Contract Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should export validateQdrantFile function', () => {
        // Contract: FileService should export validation function
        // This will fail until FileService is implemented
        const { FileService } = require('../../src/services/fileService');
        (0, chai_1.expect)(FileService).to.exist;
        (0, chai_1.expect)(FileService.validateQdrantFile).to.be.a('function');
    });
    test('should return valid result for existing readable file', async () => {
        // Contract: Valid files should return success result
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/valid.db');
        // Mock successful file operations
        sandbox
            .stub(vscode.workspace.fs, 'stat')
            .resolves({ type: vscode.FileType.File, size: 1024, mtime: Date.now(), ctime: Date.now() });
        const result = await FileService.validateQdrantFile(testUri);
        (0, chai_1.expect)(result).to.have.property('isValid', true);
        (0, chai_1.expect)(result).to.have.property('filePath', testUri);
        (0, chai_1.expect)(result.errors).to.be.an('array').that.is.empty;
        (0, chai_1.expect)(result).to.have.property('validatedAt').that.is.a('date');
    });
    test('should return invalid result for non-existent file', async () => {
        // Contract: Non-existent files should return validation errors
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/nonexistent.db');
        // Mock file not found
        const error = new Error('File not found');
        error.code = 'FileNotFound';
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(error);
        const result = await FileService.validateQdrantFile(testUri);
        (0, chai_1.expect)(result).to.have.property('isValid', false);
        (0, chai_1.expect)(result.errors).to.be.an('array').that.has.length.greaterThan(0);
        (0, chai_1.expect)(result.errors[0]).to.have.property('code', 'FILE_NOT_FOUND');
    });
    test('should return invalid result for access denied file', async () => {
        // Contract: Inaccessible files should return permission errors
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/readonly.db');
        // Mock permission denied
        const error = new Error('Access denied');
        error.code = 'AccessDenied';
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(error);
        const result = await FileService.validateQdrantFile(testUri);
        (0, chai_1.expect)(result).to.have.property('isValid', false);
        (0, chai_1.expect)(result.errors).to.be.an('array').that.has.length.greaterThan(0);
        (0, chai_1.expect)(result.errors[0]).to.have.property('code', 'ACCESS_DENIED');
    });
    test('should complete validation within 100ms for local files', async () => {
        // Contract: Validation should be fast for local files
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/test.db');
        const startTime = Date.now();
        sandbox
            .stub(vscode.workspace.fs, 'stat')
            .resolves({ type: vscode.FileType.File, size: 1024, mtime: Date.now(), ctime: Date.now() });
        await FileService.validateQdrantFile(testUri);
        const duration = Date.now() - startTime;
        (0, chai_1.expect)(duration).to.be.lessThan(100);
    });
    test('should include file metadata in result', async () => {
        // Contract: Validation result should include file information
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/test.db');
        const fileStat = {
            type: vscode.FileType.File,
            size: 2048,
            mtime: 1234567890000,
            ctime: 1234567890000,
        };
        sandbox.stub(vscode.workspace.fs, 'stat').resolves(fileStat);
        const result = await FileService.validateQdrantFile(testUri);
        (0, chai_1.expect)(result).to.have.property('metadata');
        (0, chai_1.expect)(result.metadata).to.have.property('size', 2048);
        (0, chai_1.expect)(result.metadata).to.have.property('modified').that.is.a('date');
    });
    test('should handle validation errors gracefully', async () => {
        // Contract: Validation should not throw exceptions
        const { FileService } = require('../../src/services/fileService');
        const testUri = vscode.Uri.file('/path/to/corrupt.db');
        // Mock unexpected error
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(new Error('Unexpected error'));
        const result = await FileService.validateQdrantFile(testUri);
        (0, chai_1.expect)(result).to.have.property('isValid', false);
        (0, chai_1.expect)(result.errors).to.be.an('array').that.has.length.greaterThan(0);
    });
});
//# sourceMappingURL=file-service.contract.test.js.map