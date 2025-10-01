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
 * Contract tests for the selectLocalDbFile command
 * These tests define the expected behavior and will fail until implementation is complete
 */
suite('Select Local DB File Command - Contract Tests', () => {
    let sandbox;
    setup(() => {
        sandbox = sinon.createSandbox();
    });
    teardown(() => {
        sandbox.restore();
    });
    test('should register qdrant.selectLocalDbFile command', async () => {
        // Contract: Command should be registered on extension activation
        const commands = await vscode.commands.getCommands(true);
        (0, chai_1.expect)(commands).to.include('qdrant.selectLocalDbFile');
    });
    test('should open file picker dialog when command is executed', async () => {
        // Contract: Command execution should trigger file picker dialog
        const showOpenDialogStub = sandbox.stub(vscode.window, 'showOpenDialog').resolves(undefined);
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        (0, chai_1.expect)(showOpenDialogStub.calledOnce).to.be.true;
        const callArgs = showOpenDialogStub.firstCall.args[0];
        (0, chai_1.expect)(callArgs).to.exist;
        // TODO: Assert specific file filters for Qdrant files
    });
    test('should update configuration when valid file is selected', async () => {
        // Contract: Valid file selection should update workspace configuration
        const testUri = vscode.Uri.file('/path/to/test.db');
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([testUri]);
        const updateStub = sandbox.stub();
        // Mock workspace configuration
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        (0, chai_1.expect)(updateStub.calledWith('localDbPath', testUri, vscode.ConfigurationTarget.Workspace)).to
            .be.true;
    });
    test('should show success notification when file selection succeeds', async () => {
        // Contract: Successful file selection should show user notification
        const testUri = vscode.Uri.file('/path/to/test.db');
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([testUri]);
        const showInformationMessageStub = sandbox.stub(vscode.window, 'showInformationMessage');
        // Mock successful configuration update
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: sandbox.stub().resolves(),
            get: sandbox.stub(),
        });
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        (0, chai_1.expect)(showInformationMessageStub.calledOnce).to.be.true;
        (0, chai_1.expect)(showInformationMessageStub.firstCall.args[0]).to.match(/successfully/i);
    });
    test('should show error notification when file selection fails', async () => {
        // Contract: Failed file selection should show error notification
        sandbox.stub(vscode.window, 'showOpenDialog').resolves(undefined); // User cancels
        const showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        (0, chai_1.expect)(showErrorMessageStub.calledOnce).to.be.true;
    });
    test('should validate selected file before configuration update', async () => {
        // Contract: File validation should occur before configuration changes
        const invalidUri = vscode.Uri.file('/nonexistent/file.db');
        sandbox.stub(vscode.window, 'showOpenDialog').resolves([invalidUri]);
        const updateStub = sandbox.stub();
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            update: updateStub,
            get: sandbox.stub(),
        });
        await vscode.commands.executeCommand('qdrant.selectLocalDbFile');
        (0, chai_1.expect)(updateStub.called).to.be.false;
    });
});
//# sourceMappingURL=select-db-file.contract.test.js.map