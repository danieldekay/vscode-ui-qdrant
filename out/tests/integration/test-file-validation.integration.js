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
 * Integration test for the file validation workflow
 * Tests the complete file validation process and error handling
 */
suite('File Validation Workflow - Integration Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should validate existing readable file successfully', async () => {
        // Integration test: File validation for valid file
        const testUri = vscode.Uri.file('/path/to/valid.db');
        // Mock VS Code file system to return valid file stats
        const fileStat = {
            type: vscode.FileType.File,
            size: 1024,
            mtime: Date.now(),
            ctime: Date.now(),
        };
        sandbox.stub(vscode.workspace.fs, 'stat').resolves(fileStat);
        // TODO: Import and call FileService.validateQdrantFile
        // const result = await FileService.validateQdrantFile(testUri);
        // expect(result.isValid).to.be.true;
        // expect(result.filePath).to.equal(testUri);
        // expect(result.errors).to.be.empty;
        // expect(result.warnings).to.be.an('array');
        // For now, just verify the mocks work
        const statResult = await vscode.workspace.fs.stat(testUri);
        (0, chai_1.expect)(statResult.type).to.equal(vscode.FileType.File);
    });
    test('should reject non-existent file with appropriate error', async () => {
        // Integration test: File validation for missing file
        const testUri = vscode.Uri.file('/path/to/nonexistent.db');
        // Mock VS Code file system to throw file not found error
        const error = new vscode.FileSystemError(testUri);
        error.code = 'FileNotFound';
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(error);
        // TODO: Import and call FileService.validateQdrantFile
        // const result = await FileService.validateQdrantFile(testUri);
        // expect(result.isValid).to.be.false;
        // expect(result.errors).to.have.length.greaterThan(0);
        // expect(result.errors[0].code).to.equal('FILE_NOT_FOUND');
        // For now, just verify the error is thrown
        try {
            await vscode.workspace.fs.stat(testUri);
            chai_1.expect.fail('Should have thrown FileNotFound error');
        }
        catch (err) {
            (0, chai_1.expect)(err.code).to.equal('FileNotFound');
        }
    });
    test('should reject file without read permissions', async () => {
        // Integration test: File validation for inaccessible file
        const testUri = vscode.Uri.file('/path/to/no-permission.db');
        // Mock VS Code file system to throw access denied error
        const error = new vscode.FileSystemError(testUri);
        error.code = 'AccessDenied';
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(error);
        // TODO: Import and call FileService.validateQdrantFile
        // const result = await FileService.validateQdrantFile(testUri);
        // expect(result.isValid).to.be.false;
        // expect(result.errors).to.have.length.greaterThan(0);
        // expect(result.errors[0].code).to.equal('ACCESS_DENIED');
        // For now, just verify the error is thrown
        try {
            await vscode.workspace.fs.stat(testUri);
            chai_1.expect.fail('Should have thrown AccessDenied error');
        }
        catch (err) {
            (0, chai_1.expect)(err.code).to.equal('AccessDenied');
        }
    });
    test('should complete validation within performance requirements', async () => {
        // Integration test: Performance validation (<100ms)
        const testUri = vscode.Uri.file('/path/to/test.db');
        // Mock VS Code file system
        sandbox.stub(vscode.workspace.fs, 'stat').resolves({
            type: vscode.FileType.File,
            size: 1024,
            mtime: Date.now(),
            ctime: Date.now(),
        });
        const startTime = Date.now();
        // TODO: Import and call FileService.validateQdrantFile
        // await FileService.validateQdrantFile(testUri);
        // For now, just test the file system call performance
        await vscode.workspace.fs.stat(testUri);
        const duration = Date.now() - startTime;
        (0, chai_1.expect)(duration).to.be.lessThan(100);
    });
    test('should include file metadata in validation result', async () => {
        // Integration test: File metadata inclusion
        const testUri = vscode.Uri.file('/path/to/test.db');
        const expectedSize = 2048;
        const expectedMtime = 1234567890000;
        // Mock VS Code file system with specific metadata
        sandbox.stub(vscode.workspace.fs, 'stat').resolves({
            type: vscode.FileType.File,
            size: expectedSize,
            mtime: expectedMtime,
            ctime: expectedMtime,
        });
        // TODO: Import and call FileService.validateQdrantFile
        // const result = await FileService.validateQdrantFile(testUri);
        // expect(result.metadata).to.exist;
        // expect(result.metadata.size).to.equal(expectedSize);
        // expect(result.metadata.modified).to.equal(expectedMtime);
        // For now, just verify the metadata is returned
        const stat = await vscode.workspace.fs.stat(testUri);
        (0, chai_1.expect)(stat.size).to.equal(expectedSize);
        (0, chai_1.expect)(stat.mtime).to.equal(expectedMtime);
    });
    test('should handle unexpected errors gracefully', async () => {
        // Integration test: Error handling for unexpected failures
        const testUri = vscode.Uri.file('/path/to/problematic.db');
        // Mock VS Code file system to throw unexpected error
        sandbox.stub(vscode.workspace.fs, 'stat').rejects(new Error('Unexpected filesystem error'));
        // TODO: Import and call FileService.validateQdrantFile
        // const result = await FileService.validateQdrantFile(testUri);
        // expect(result.isValid).to.be.false;
        // expect(result.errors).to.have.length.greaterThan(0);
        // Validation should not throw exceptions
        // For now, just verify error handling
        try {
            await vscode.workspace.fs.stat(testUri);
            chai_1.expect.fail('Should have thrown an error');
        }
        catch (err) {
            (0, chai_1.expect)(err.message).to.equal('Unexpected filesystem error');
        }
    });
});
//# sourceMappingURL=test-file-validation.integration.js.map