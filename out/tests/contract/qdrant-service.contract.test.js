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
 * Contract tests for the QdrantService.updateLocalDbPath method
 * These tests define the expected behavior and will fail until implementation is complete
 */
suite('Qdrant Service - Contract Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should export updateLocalDbPath function', () => {
        // Contract: QdrantService should export configuration update function
        const { QdrantService } = require('../../src/services/qdrantService');
        (0, chai_1.expect)(QdrantService).to.exist;
        (0, chai_1.expect)(QdrantService.updateLocalDbPath).to.be.a('function');
    });
    test('should update configuration with valid file path', async () => {
        // Contract: Valid path should update workspace configuration
        const { QdrantService } = require('../../src/services/qdrantService');
        const testUri = vscode.Uri.file('/path/to/valid.db');
        const updateStub = sandbox.stub().resolves();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        const result = await QdrantService.updateLocalDbPath(testUri);
        (0, chai_1.expect)(result).to.have.property('success', true);
        (0, chai_1.expect)(result).to.have.property('newPath', testUri);
        (0, chai_1.expect)(updateStub.calledWith('localDbPath', testUri, vscode.ConfigurationTarget.Workspace)).to
            .be.true;
    });
    test('should attempt connection after configuration update', async () => {
        // Contract: Service should attempt to connect to new database
        const { QdrantService } = require('../../src/services/qdrantService');
        const testUri = vscode.Uri.file('/path/to/test.db');
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        const result = await QdrantService.updateLocalDbPath(testUri);
        (0, chai_1.expect)(result).to.have.property('connectionStatus');
        // TODO: Assert that connection attempt was made
    });
    test('should return success result when connection succeeds', async () => {
        // Contract: Successful connection should return success status
        const { QdrantService } = require('../../src/services/qdrantService');
        const testUri = vscode.Uri.file('/path/to/connected.db');
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        // Mock successful connection
        // TODO: Mock Qdrant client connection success
        const result = await QdrantService.updateLocalDbPath(testUri);
        (0, chai_1.expect)(result.success).to.be.true;
        (0, chai_1.expect)(result.connectionStatus).to.equal('connected');
        (0, chai_1.expect)(result.message).to.match(/successfully/i);
    });
    test('should return error result when connection fails', async () => {
        // Contract: Failed connection should return error status
        const { QdrantService } = require('../../src/services/qdrantService');
        const testUri = vscode.Uri.file('/path/to/invalid.db');
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        // Mock failed connection
        // TODO: Mock Qdrant client connection failure
        const result = await QdrantService.updateLocalDbPath(testUri);
        (0, chai_1.expect)(result.success).to.be.false;
        (0, chai_1.expect)(result.connectionStatus).to.equal('error');
        (0, chai_1.expect)(result).to.have.property('error');
        (0, chai_1.expect)(result.error).to.have.property('code', 'CONNECTION_FAILED');
    });
    test('should preserve previous path on failure', async () => {
        // Contract: Configuration should not change if connection fails
        const { QdrantService } = require('../../src/services/qdrantService');
        const oldUri = vscode.Uri.file('/path/to/old.db');
        const newUri = vscode.Uri.file('/path/to/failing.db');
        let configValue = oldUri;
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().callsFake((key, value) => {
                if (key === 'localDbPath')
                    configValue = value;
                return Promise.resolve();
            }),
            get: sandbox.stub().callsFake((key) => (key === 'localDbPath' ? configValue : undefined)),
        });
        // Mock failed connection
        // TODO: Mock Qdrant client connection failure
        await QdrantService.updateLocalDbPath(newUri);
        (0, chai_1.expect)(configValue).to.equal(oldUri);
    });
    test('should emit configuration change events', async () => {
        // Contract: Service should emit events for configuration changes
        const { QdrantService } = require('../../src/services/qdrantService');
        const testUri = vscode.Uri.file('/path/to/test.db');
        let eventEmitted = false;
        // Mock event emission
        sandbox.stub(QdrantService, 'emit').callsFake((event) => {
            if (event === 'onConfigChanged')
                eventEmitted = true;
        });
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        await QdrantService.updateLocalDbPath(testUri);
        (0, chai_1.expect)(eventEmitted).to.be.true;
    });
    test('should include previous path in success result', async () => {
        // Contract: Success result should include previous configuration
        const { QdrantService } = require('../../src/services/qdrantService');
        const oldUri = vscode.Uri.file('/path/to/old.db');
        const newUri = vscode.Uri.file('/path/to/new.db');
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub().returns(oldUri),
        });
        const result = await QdrantService.updateLocalDbPath(newUri);
        (0, chai_1.expect)(result).to.have.property('previousPath', oldUri);
    });
});
//# sourceMappingURL=qdrant-service.contract.test.js.map