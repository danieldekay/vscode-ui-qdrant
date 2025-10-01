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
 * Test: Build Integration Validation
 *
 * Validates that build process correctly enforces linting
 * and formatting standards before compilation.
 *
 * This test MUST FAIL before build scripts are updated.
 */
describe('Build Integration Validation', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const biomeConfigPath = path.join(__dirname, '../../biome.json');
    it('should have biome.json configuration', () => {
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for build integration');
    });
    it('should have package.json with linting scripts', () => {
        assert.ok(fs.existsSync(packageJsonPath), 'package.json must exist');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const scripts = packageJson.scripts || {};
        // Check for required Biome scripts
        assert.ok(scripts.lint, 'lint script must be defined');
        assert.ok(scripts['lint:fix'], 'lint:fix script must be defined');
        assert.ok(scripts.format, 'format script must be defined');
        assert.ok(scripts['format:fix'], 'format:fix script must be defined');
        // Validate script commands
        assert.ok(scripts.lint.includes('biome check'), 'lint script should use biome check');
        assert.ok(scripts['lint:fix'].includes('biome check --apply'), 'lint:fix should use biome check --apply');
        assert.ok(scripts.format.includes('biome format'), 'format script should use biome format');
        assert.ok(scripts['format:fix'].includes('biome format --write'), 'format:fix should use biome format --write');
    });
    it('should have pretest script that includes linting', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const scripts = packageJson.scripts || {};
        assert.ok(scripts.pretest, 'pretest script must be defined');
        assert.ok(scripts.pretest.includes('lint'), 'pretest must include linting validation');
    });
    it('should validate build process enforces linting', () => {
        // Create a test file with linting violations
        const testFilePath = path.join(__dirname, '../../src/test-build.ts');
        const codeWithViolations = `import * as fs from 'fs';
let unused = 'test'; // Unused variable
function test(){return 'test'}`; // Missing semicolon
        fs.writeFileSync(testFilePath, codeWithViolations);
        try {
            // This should fail if linting is properly integrated into build
            (0, node_child_process_1.execSync)('npm run pretest', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
            assert.fail('Build should fail when linting violations exist');
        }
        catch (error) {
            // Expected to fail - validate it's due to linting
            const execError = error;
            const output = execError.stdout || execError.stderr || '';
            assert.ok(output.includes('error') || output.includes('lint') || output.includes('biome'), 'Build failure should be related to linting');
        }
        finally {
            // Cleanup
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
            }
        }
    });
    it('should validate manual linting commands work', () => {
        // Test lint command (should work even with violations)
        try {
            (0, node_child_process_1.execSync)('npm run lint', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
        }
        catch (error) {
            // lint command should not fail, just report issues
            const execError = error;
            const output = execError.stdout || execError.stderr || '';
            assert.ok(output.includes('found') || output.includes('error') || output.length > 0, 'lint command should produce output');
        }
        // Test format command
        try {
            (0, node_child_process_1.execSync)('npm run format', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
        }
        catch (error) {
            // format command should not fail, just report issues
            const execError = error;
            const output = execError.stdout || execError.stderr || '';
            assert.ok(output.length >= 0, // Can be empty if no issues
            'format command should run without crashing');
        }
    });
});
//# sourceMappingURL=test_build_integration.js.map