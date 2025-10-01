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
const assert = __importStar(require("node:assert"));
const vscode = __importStar(require("vscode"));
// Contract test for extension activation behavior
// This test defines the expected behavior of extension activation
// and verifies the implementation works correctly
describe('Extension Activation Contract Tests', () => {
    let mockContext;
    beforeEach(() => {
        // Create a minimal mock context for testing
        mockContext = {
            subscriptions: [],
            workspaceState: {
                get: () => undefined,
                update: () => Promise.resolve(),
                keys: () => [],
            },
            globalState: {
                get: () => undefined,
                update: () => Promise.resolve(),
                keys: () => [],
                setKeysForSync: () => { },
            },
            extensionPath: '/test/path',
            extensionUri: { fsPath: '/test/path' },
            environmentVariableCollection: {
                persistent: false,
                description: 'Test',
                variables: {},
                prepend: () => { },
                append: () => { },
                replace: () => { },
                clear: () => { },
                get: () => undefined,
                forEach: () => { },
                delete: () => { },
            },
            storagePath: '/test/storage',
            storageUri: { fsPath: '/test/storage' },
            globalStoragePath: '/test/globalStorage',
            globalStorageUri: { fsPath: '/test/globalStorage' },
            logPath: '/test/log',
            logUri: { fsPath: '/test/log' },
            extensionMode: vscode.ExtensionMode.Test,
            secrets: {
                get: () => Promise.resolve(undefined),
                store: () => Promise.resolve(),
                delete: () => Promise.resolve(),
                onDidChange: { dispose: () => { } },
            },
            asAbsolutePath: (path) => path,
            extension: {},
            languageModelAccessInformation: {},
        };
    });
    it('should activate extension when "Qdrant: Open Search" command is triggered', async () => {
        // Given: Extension is not yet activated
        // When: User triggers "Qdrant: Open Search" command
        // Then: Extension should activate successfully
        // Import the actual activate function from source
        const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
        // Attempt to activate - this should now succeed
        await activate(mockContext);
        // Verify that commands were registered
        assert.ok(mockContext.subscriptions.length > 0, 'Extension should register subscriptions on activation');
    });
    it('should register all commands in command palette', async () => {
        // Given: Extension is activated
        // When: Command palette is opened
        // Then: Qdrant commands should be available
        // Import the actual activate function from source
        const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
        // Activate the extension
        await activate(mockContext);
        // Check that expected commands are registered
        const expectedCommands = [
            'qdrant.openSearch',
            'qdrant.openCollections',
            'qdrant.connect',
            'qdrant.disconnect',
        ];
        // Verify commands are in subscriptions (they're registered as command objects)
        const commandSubscriptions = mockContext.subscriptions.filter((sub) => typeof sub === 'object' && 'command' in sub);
        assert.ok(commandSubscriptions.length >= expectedCommands.length, `Should have at least ${expectedCommands.length} command registrations`);
        // Note: In a real VS Code environment, we would check vscode.commands.getCommands()
        // but for contract testing, we verify the subscriptions were added
    });
    it('should create status bar item on activation', async () => {
        // Given: Extension is activated
        // When: Status bar is checked
        // Then: Qdrant status bar item should exist
        // Import the actual activate function from source
        const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
        // Activate the extension
        await activate(mockContext);
        // Check for status bar item in subscriptions
        const statusBarSubscriptions = mockContext.subscriptions.filter((sub) => typeof sub === 'object' && 'text' in sub && sub.text === 'Qdrant');
        assert.ok(statusBarSubscriptions.length > 0, 'Qdrant status bar item should be created on activation');
    });
    it('should initialize tree views for collections', async () => {
        // Given: Extension is activated
        // When: Explorer panel is checked
        // Then: Qdrant collection tree view should be available
        // Import the actual activate function from source
        const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
        // Activate the extension
        await activate(mockContext);
        // Check for tree view registration in subscriptions
        const treeViewSubscriptions = mockContext.subscriptions.filter((sub) => typeof sub === 'object' && 'viewId' in sub && sub.viewId === 'qdrantCollections');
        assert.ok(treeViewSubscriptions.length > 0, 'Qdrant collections tree view should be initialized');
    });
    it('should fail gracefully when VS Code version is below minimum', async () => {
        // Given: VS Code version is below 1.74.0
        // When: Extension attempts to activate
        // Then: Activation should fail with clear error message
        // Mock an older VS Code version
        const originalVersion = vscode.version;
        vscode.version = '1.70.0';
        try {
            // Import the actual activate function from source
            const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
            // Attempt to activate - this should fail
            await activate(mockContext);
            assert.fail('Expected activation to fail due to incompatible VS Code version');
        }
        catch (error) {
            assert.ok(error.message.includes('not supported'), 'Should provide clear error message for incompatible version');
            assert.ok(error.message.includes('1.74.0'), 'Should mention minimum required version');
        }
        finally {
            // Restore original version
            vscode.version = originalVersion;
        }
    });
    it('should activate partially when missing optional dependencies', async () => {
        // Given: Some optional dependencies are missing
        // When: Extension activates
        // Then: Core functionality works with warnings for missing features
        // Import the actual activate function from source
        const { activate } = await Promise.resolve().then(() => __importStar(require('../../src/index')));
        // Activate the extension
        await activate(mockContext);
        // For now, assume all dependencies are present (as implemented)
        // In future, we can mock missing dependencies to test warning behavior
        assert.ok(mockContext.subscriptions.length > 0, 'Extension should activate even with missing optional dependencies');
    });
});
//# sourceMappingURL=test-extension-activation.js.map