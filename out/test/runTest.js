const path = require('path');
const Mocha = require('mocha');
const Module = require('module');

// Mock vscode module for testing - setup immediately
const mockVscode = {
    version: '1.74.0',
    ExtensionMode: {
        Test: 1,
    },
    StatusBarAlignment: {
        Left: 1,
    },
    TreeItemCollapsibleState: {
        None: 0,
    },
    TreeItem: class {
        constructor(label, collapsibleState) {
            this.label = label;
            this.collapsibleState = collapsibleState;
        }
    },
    EventEmitter: class {
        constructor() {
            this._listeners = [];
        }
        get event() {
            return (listener) => {
                this._listeners.push(listener);
                return { dispose: () => { } };
            };
        }
        fire(data) {
            this._listeners.forEach(listener => listener(data));
        }
    },
    commands: {
        registerCommand: (command) => ({ command }),
    },
    workspace: {
        onDidChangeConfiguration: { dispose: () => { } },
    },
    window: {
        createWebviewPanel: () => ({
            webview: {
                postMessage: () => true,
                onDidReceiveMessage: { dispose: () => { } },
            },
            dispose: () => { },
        }),
        createTreeView: () => ({ dispose: () => { } }),
        createStatusBarItem: () => ({
            text: 'Qdrant',
            tooltip: 'Qdrant Vector Database',
            command: 'qdrant.openSearch',
            show: () => { },
        }),
        registerTreeDataProvider: (viewId) => ({ viewId }),
        showInformationMessage: () => { },
        showWarningMessage: () => { },
    },
    Uri: class {
        constructor(fsPath) {
            this.fsPath = fsPath;
        }
    },
};

// Mock the vscode module immediately
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
    if (id === 'vscode') {
        return mockVscode;
    }
    return originalRequire.apply(this, arguments);
};

async function run() {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        color: true,
        timeout: 10000,
    });

    const testsRoot = path.resolve(__dirname, '..');

    // Add all contract test files
    const testFiles = [
        'tests/contract/test-extension-activation.js',
        'tests/contract/test-qdrant-client.js',
        'tests/contract/test-ui-components.js',
        'tests/contract/test-data-models.js',
    ];

    testFiles.forEach(file => {
        mocha.addFile(path.resolve(testsRoot, file));
    });

    return new Promise((resolve, reject) => {
        // Run the mocha test
        mocha.run(failures => {
            if (failures > 0) {
                reject(new Error(`${failures} tests failed.`));
            } else {
                resolve();
            }
        });
    });
}

module.exports = { run };

if (require.main === module) {
    run().catch(err => {
        console.error(err);
        process.exit(1);
    });
}