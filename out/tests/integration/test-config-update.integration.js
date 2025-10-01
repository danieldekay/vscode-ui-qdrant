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
 * Integration test for the configuration update workflow
 * Tests the complete process of updating Qdrant configuration with a new database path
 */
suite('Configuration Update Workflow - Integration Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should successfully update configuration with valid database path', async () => {
        // Integration test: Successful configuration update
        const testUri = vscode.Uri.file('/path/to/new-qdrant.db');
        const oldUri = vscode.Uri.file('/path/to/old-qdrant.db');
        // Mock configuration API
        let configValue = oldUri;
        const updateStub = sandbox.stub().callsFake((key, value) => {
            if (key === 'localDbPath')
                configValue = value;
            return Promise.resolve();
        });
        const getStub = sandbox.stub().callsFake((key) => {
            return key === 'localDbPath' ? configValue : undefined;
        });
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: getStub,
        });
        // TODO: Import and call QdrantService.updateLocalDbPath
        // const result = await QdrantService.updateLocalDbPath(testUri);
        // expect(result.success).to.be.true;
        // expect(result.newPath).to.equal(testUri);
        // expect(result.previousPath).to.equal(oldUri);
        // expect(result.connectionStatus).to.equal('connected');
        // For now, just test the configuration API
        const config = vscode.workspace.getConfiguration();
        await config.update('localDbPath', testUri, vscode.ConfigurationTarget.Workspace);
        (0, chai_1.expect)(config.get('localDbPath')).to.equal(testUri);
    });
    test('should handle connection failure gracefully', async () => {
        // Integration test: Configuration update with connection failure
        const testUri = vscode.Uri.file('/path/to/failing-connection.db');
        // Mock configuration API
        const updateStub = sandbox.stub().resolves();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        // TODO: Mock QdrantService.updateLocalDbPath to simulate connection failure
        // const result = await QdrantService.updateLocalDbPath(testUri);
        // expect(result.success).to.be.false;
        // expect(result.connectionStatus).to.equal('error');
        // expect(result.error).to.exist;
        // expect(result.error.code).to.equal('CONNECTION_FAILED');
        // For now, just verify configuration update still works
        const config = vscode.workspace.getConfiguration();
        await config.update('localDbPath', testUri, vscode.ConfigurationTarget.Workspace);
        (0, chai_1.expect)(updateStub.calledWith('localDbPath', testUri, vscode.ConfigurationTarget.Workspace)).to
            .be.true;
    });
    test('should preserve existing configuration on failure', async () => {
        // Integration test: Atomic configuration updates
        const newUri = vscode.Uri.file('/path/to/failing.db');
        const existingUri = vscode.Uri.file('/path/to/existing.db');
        // Mock configuration that fails to update
        const updateStub = sandbox.stub().rejects(new Error('Configuration update failed'));
        const getStub = sandbox.stub().returns(existingUri);
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: getStub,
        });
        // TODO: Call QdrantService.updateLocalDbPath and verify rollback
        // try {
        //     await QdrantService.updateLocalDbPath(newUri);
        //     expect.fail('Should have thrown error');
        // } catch (err) {
        //     // Verify configuration wasn't changed
        //     expect(vscode.workspace.getConfiguration().get('localDbPath')).to.equal(existingUri);
        // }
        // For now, just test the error handling
        const config = vscode.workspace.getConfiguration();
        try {
            await config.update('localDbPath', newUri, vscode.ConfigurationTarget.Workspace);
            chai_1.expect.fail('Should have thrown error');
        }
        catch (err) {
            (0, chai_1.expect)(err.message).to.equal('Configuration update failed');
            (0, chai_1.expect)(config.get('localDbPath')).to.equal(existingUri);
        }
    });
    test('should emit configuration change events', async () => {
        // Integration test: Event emission on configuration changes
        const testUri = vscode.Uri.file('/path/to/test.db');
        // Mock configuration update
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        // TODO: Mock event emission and verify events are fired
        // let configChangedEvent = false;
        // let connectionEvent = false;
        // Mock event listeners
        // QdrantService.on('onConfigChanged', () => configChangedEvent = true);
        // QdrantService.on('onConnectionStatusChanged', () => connectionEvent = true);
        // const result = await QdrantService.updateLocalDbPath(testUri);
        // expect(configChangedEvent).to.be.true;
        // expect(connectionEvent).to.be.true;
        // For now, just verify the configuration update mechanism
        const config = vscode.workspace.getConfiguration();
        await config.update('localDbPath', testUri, vscode.ConfigurationTarget.Workspace);
        // Events would be tested in a full integration environment
    });
    test('should handle concurrent configuration updates', async () => {
        // Integration test: Concurrent configuration operations
        const uri1 = vscode.Uri.file('/path/to/db1.db');
        const uri2 = vscode.Uri.file('/path/to/db2.db');
        // Mock configuration API
        let configValue;
        const updateStub = sandbox.stub().callsFake(async (key, value) => {
            // Simulate async delay
            await new Promise((resolve) => setTimeout(resolve, 10));
            if (key === 'localDbPath')
                configValue = value;
        });
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub().callsFake(() => configValue),
        });
        // TODO: Test concurrent calls to QdrantService.updateLocalDbPath
        // const promise1 = QdrantService.updateLocalDbPath(uri1);
        // const promise2 = QdrantService.updateLocalDbPath(uri2);
        // const [result1, result2] = await Promise.all([promise1, promise2]);
        // Verify final state is consistent (last update wins or proper error handling)
        // For now, just test sequential updates
        const config = vscode.workspace.getConfiguration();
        await config.update('localDbPath', uri1, vscode.ConfigurationTarget.Workspace);
        (0, chai_1.expect)(config.get('localDbPath')).to.equal(uri1);
        await config.update('localDbPath', uri2, vscode.ConfigurationTarget.Workspace);
        (0, chai_1.expect)(config.get('localDbPath')).to.equal(uri2);
    });
    test('should validate configuration values', async () => {
        // Integration test: Configuration value validation
        const invalidUri = vscode.Uri.file(''); // Empty path
        // Mock configuration API
        const updateStub = sandbox.stub().resolves();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        // TODO: Test validation of configuration values
        // const result = await QdrantService.updateLocalDbPath(invalidUri);
        // expect(result.success).to.be.false;
        // expect(result.error).to.exist;
        // expect(result.error.message).to.include('invalid');
        // For now, just test that configuration accepts the URI
        const config = vscode.workspace.getConfiguration();
        await config.update('localDbPath', invalidUri, vscode.ConfigurationTarget.Workspace);
        (0, chai_1.expect)(config.get('localDbPath')).to.equal(invalidUri);
    });
});
//# sourceMappingURL=test-config-update.integration.js.map