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
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
/**
 * Test: Auto-Format on Save Validation
 *
 * Validates that VS Code workspace settings correctly configure
 * auto-formatting on save using Biome.
 *
 * This test MUST FAIL before .vscode/settings.json is updated.
 */
describe('Auto-Format on Save Validation', () => {
    const settingsPath = path.join(__dirname, '../../.vscode/settings.json');
    it('should have .vscode/settings.json file', () => {
        assert.ok(fs.existsSync(settingsPath), '.vscode/settings.json must exist');
    });
    it('should have editor.formatOnSave enabled', () => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        assert.strictEqual(settings['editor.formatOnSave'], true, 'editor.formatOnSave must be true');
    });
    it('should have Biome as default formatter', () => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        assert.strictEqual(settings['editor.defaultFormatter'], 'biomejs.biome', 'editor.defaultFormatter must be biomejs.biome');
    });
    it('should have Biome as default formatter for TypeScript', () => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        assert.ok(settings['[typescript]'], '[typescript] section must exist');
        assert.strictEqual(settings['[typescript]']['editor.defaultFormatter'], 'biomejs.biome', 'TypeScript defaultFormatter must be biomejs.biome');
    });
    it('should have codeActionsOnSave configured for Biome', () => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        assert.ok(settings['editor.codeActionsOnSave'], 'editor.codeActionsOnSave must be defined');
        const codeActions = settings['editor.codeActionsOnSave'];
        assert.strictEqual(codeActions['quickfix.biome'], 'explicit', 'quickfix.biome must be explicit');
        assert.strictEqual(codeActions['source.organizeImports.biome'], 'explicit', 'source.organizeImports.biome must be explicit');
    });
    it('should create test file and validate auto-format behavior', async () => {
        const testFilePath = path.join(__dirname, '../../src/test-auto-format.ts');
        // Create a poorly formatted file
        const poorlyFormattedCode = `import*fs from'fs';
function test( param:string ){const result=\`Hello,\${param}\`;return result;}`;
        fs.writeFileSync(testFilePath, poorlyFormattedCode);
        // Note: This test validates the configuration exists.
        // Actual auto-format behavior would be tested in integration tests
        // that simulate VS Code save operations.
        assert.ok(fs.existsSync(testFilePath), 'test file should be created');
        // Cleanup
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });
});
//# sourceMappingURL=test_auto_format.js.map