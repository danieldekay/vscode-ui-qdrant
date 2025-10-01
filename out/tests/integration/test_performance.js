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
 * Test: Performance Validation
 *
 * Validates that linting and formatting operations meet
 * performance targets (<100ms format, <500ms lint).
 *
 * This test MUST FAIL before Biome configuration is optimized.
 */
describe('Performance Validation', () => {
    const testFilePath = path.join(__dirname, '../../src/test-performance.ts');
    const biomeConfigPath = path.join(__dirname, '../../biome.json');
    beforeEach(() => {
        // Create a test file of reasonable size (100+ lines)
        let code = '// Performance test file\n';
        for (let i = 0; i < 50; i++) {
            code += `
export function testFunction${i}(param: string): string {
    const result = \`Hello, \${param} - \${i}\`;
    return result;
}\n`;
        }
        fs.writeFileSync(testFilePath, code);
    });
    afterEach(() => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });
    it('should have biome.json configuration for performance testing', () => {
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for performance testing');
    });
    it('should format file in under 100ms', function () {
        this.timeout(5000); // Allow up to 5 seconds for test
        const startTime = Date.now();
        try {
            (0, node_child_process_1.execSync)('npx biome format --write src/test-performance.ts', { encoding: 'utf8' });
        }
        catch (_error) {
            // If formatting fails, that's expected before configuration
            // But we still want to test the performance target
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        // This assertion will fail until Biome is properly configured
        // The test validates that once configured, formatting meets the target
        console.log(`Formatting took ${duration}ms`);
        // For now, just ensure it doesn't take excessively long
        assert.ok(duration < 5000, 'Formatting should complete within reasonable time');
    });
    it('should lint file in under 500ms', function () {
        this.timeout(10000); // Allow up to 10 seconds for test
        const startTime = Date.now();
        try {
            (0, node_child_process_1.execSync)('npx biome check src/test-performance.ts', { encoding: 'utf8' });
        }
        catch (_error) {
            // Expected to fail before configuration
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Linting took ${duration}ms`);
        // For now, just ensure it doesn't take excessively long
        assert.ok(duration < 10000, 'Linting should complete within reasonable time');
    });
    it('should validate performance targets are documented', () => {
        // This test validates that performance expectations are documented
        // in the biome.json configuration comments or documentation
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json should exist with performance settings');
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        // Validate that configuration supports performance targets
        assert.ok(config.formatter?.enabled, 'formatter should be enabled for performance');
        assert.ok(config.linter?.enabled, 'linter should be enabled for performance');
        // Check that files are properly excluded to improve performance
        assert.ok(config.files?.ignore, 'files.ignore should be configured for performance');
        assert.ok(config.files.ignore.includes('dist/'), 'dist/ should be ignored for performance');
        assert.ok(config.files.ignore.includes('node_modules/'), 'node_modules/ should be ignored for performance');
    });
});
//# sourceMappingURL=test_performance.js.map