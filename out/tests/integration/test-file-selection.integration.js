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
 * Integration test for the complete file selection workflow
 * Tests the end-to-end user experience of selecting a local database file
 */
suite('File Selection Workflow - Integration Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should complete full file selection workflow successfully', async () => {
        // Integration test: Complete workflow from command to configuration update
        const testUri = vscode.Uri.file('/path/to/valid-qdrant.db');
        // Mock file picker to return valid file
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([testUri]);
        // Mock successful file validation
        // TODO: Mock FileService.validateQdrantFile to return success
        // Mock successful configuration update
        const updateStub = sandbox.stub().resolves();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        // Mock successful connection attempt
        // TODO: Mock QdrantService.updateLocalDbPath to return success
        // Execute the command
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        // Verify configuration was updated
        (0, chai_1.expect)(updateStub.calledWith('localDbPath', testUri, vscode.ConfigurationTarget.Workspace)).to
            .be.true;
        // TODO: Verify success notification was shown
        // TODO: Verify connection status was updated
    });
    test('should handle file selection cancellation gracefully', async () => {
        // Integration test: User cancels file selection
        // Mock file picker to return undefined (user cancelled)
        sandbox.stub(vscode.window, 'showOpenDialog').resolves(undefined);
        // Mock that no configuration changes occur
        const updateStub = sandbox.stub();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        // Execute the command
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        // Verify no configuration changes occurred
        (0, chai_1.expect)(updateStub.called).to.be.false;
        // TODO: Verify no notifications were shown
    });
    test('should handle invalid file selection with proper error feedback', async () => {
        // Integration test: User selects invalid file
        const invalidUri = vscode.Uri.file('/path/to/invalid-file.txt');
        // Mock file picker to return invalid file
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([invalidUri]);
        // Mock file validation to fail
        // TODO: Mock FileService.validateQdrantFile to return validation errors
        // Mock error notification
        const showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');
        // Execute the command
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        // Verify error notification was shown
        (0, chai_1.expect)(showErrorMessageStub.calledOnce).to.be.true;
        // TODO: Verify configuration was not updated
    });
    test('should handle connection failure after valid file selection', async () => {
        // Integration test: Valid file but connection fails
        const testUri = vscode.Uri.file('/path/to/valid-but-unconnectable.db');
        // Mock file picker to return valid file
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([testUri]);
        // Mock successful file validation
        // TODO: Mock FileService.validateQdrantFile to return success
        // Mock configuration update
        const updateStub = sandbox.stub().resolves();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        // Mock connection failure
        // TODO: Mock QdrantService.updateLocalDbPath to return connection error
        // Mock error notification
        const showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');
        // Execute the command
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        // Verify configuration was updated (file is valid)
        (0, chai_1.expect)(updateStub.calledWith('localDbPath', testUri, vscode.ConfigurationTarget.Workspace)).to
            .be.true;
        // Verify connection error was reported
        (0, chai_1.expect)(showErrorMessageStub.calledOnce).to.be.true;
        // TODO: Verify connection status shows error
    });
});
//# sourceMappingURL=test-file-selection.integration.js.map