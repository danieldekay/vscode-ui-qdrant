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
const node_child_process_1 = require("node:child_process");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
/**
 * Test: Linting Validation
 *
 * Validates that Biome linting correctly identifies and reports
 * code quality issues in TypeScript files.
 *
 * This test MUST FAIL before biome.json configuration is created.
 */
describe('Linting Validation', () => {
    const testFilePath = path.join(__dirname, '../../src/test-linting.ts');
    beforeEach(() => {
        // Create a test file with intentional linting violations
        const codeWithIssues = `import * as fs from 'fs';
import * as path from 'path'; // Unused import

export function testFunction(param: string): string {
  let unused = 'test'; // Unused variable
  const result = \`Hello, \${param}\`;
  return result;
}

// Missing semicolon and poor formatting
function poorlyFormatted( param:string ){return param}`;
        fs.writeFileSync(testFilePath, codeWithIssues);
    });
    afterEach(() => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });
    it('should detect linting violations in test file', () => {
        // This test will fail until Biome is configured
        // It validates that linting can identify issues
        try {
            (0, node_child_process_1.execSync)('npx biome check src/test-linting.ts', { encoding: 'utf8' });
            assert.fail('Expected linting to fail on file with violations');
        }
        catch (error) {
            // Expected to fail - validate error structure
            const execError = error;
            assert.ok(execError.stdout || execError.stderr, 'Should have error output');
            const output = execError.stdout || execError.stderr || '';
            // Should contain error information
            assert.ok(output.includes('error') || output.includes('Error'), 'Should report errors');
        }
    });
    it('should have biome.json configuration for linting rules', () => {
        const biomeConfigPath = path.join(__dirname, '../../biome.json');
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for linting');
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        assert.ok(config.linter?.rules, 'linter rules must be configured');
    });
    it('should validate specific linting rules are active', () => {
        const biomeConfigPath = path.join(__dirname, '../../biome.json');
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist');
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        // Check for recommended rules
        assert.ok(config.linter?.rules?.recommended !== false, 'recommended rules should be enabled');
        // Check for specific correctness rules
        const correctnessRules = config.linter?.rules?.correctness || {};
        assert.ok(correctnessRules.noUnusedVariables !== 'off', 'noUnusedVariables should be enabled');
        assert.ok(correctnessRules.noUnusedImports !== 'off', 'noUnusedImports should be enabled');
    });
});
//# sourceMappingURL=test_linting.js.map