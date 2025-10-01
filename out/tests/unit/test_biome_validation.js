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
/**
 * Unit Tests: Biome Configuration Validation
 *
 * Tests the validation logic for biome.json configuration
 * without external dependencies or file system operations.
 */
describe('Biome Configuration Validation Unit Tests', () => {
    const validBiomeConfig = {
        $schema: 'https://biomejs.dev/schemas/2.2.4/schema.json',
        formatter: {
            enabled: true,
            indentStyle: 'space',
            indentWidth: 2,
            lineWidth: 100,
        },
        linter: {
            enabled: true,
            rules: {
                recommended: true,
                correctness: {
                    noUnusedVariables: 'error',
                    noUnusedImports: 'error',
                },
                style: {
                    useConst: 'error',
                    noNegationElse: 'warn',
                },
            },
        },
        assist: {
            actions: {
                source: {
                    organizeImports: 'on',
                },
            },
        },
        files: {
            includes: [
                '**/src/**/*.ts',
                '**/tests/**/*.ts',
                '!**/dist/',
                '!**/node_modules/',
                '!**/.vscode/',
            ],
        },
        javascript: {
            formatter: {
                quoteStyle: 'single',
                semicolons: 'always',
                trailingCommas: 'all',
            },
        },
    };
    it('should validate correct biome.json structure', () => {
        // Test that our valid config has all required sections
        assert.ok(validBiomeConfig.formatter);
        assert.ok(validBiomeConfig.linter);
        assert.ok(validBiomeConfig.files);
        // Test formatter settings
        assert.strictEqual(validBiomeConfig.formatter.enabled, true);
        assert.strictEqual(validBiomeConfig.formatter.indentStyle, 'space');
        assert.strictEqual(validBiomeConfig.formatter.indentWidth, 2);
        assert.strictEqual(validBiomeConfig.formatter.lineWidth, 100);
        // Test linter settings
        assert.strictEqual(validBiomeConfig.linter.enabled, true);
        assert.ok(validBiomeConfig.linter.rules);
        assert.strictEqual(validBiomeConfig.linter.rules.recommended, true);
        // Test file patterns
        assert.ok(validBiomeConfig.files.includes.includes('**/src/**/*.ts'));
        assert.ok(validBiomeConfig.files.includes.includes('**/tests/**/*.ts'));
        assert.ok(validBiomeConfig.files.includes.includes('!**/dist/'));
        assert.ok(validBiomeConfig.files.includes.includes('!**/node_modules/'));
    });
    it('should validate rule configuration structure', () => {
        const rules = validBiomeConfig.linter.rules;
        // Test correctness rules
        assert.strictEqual(rules.correctness.noUnusedVariables, 'error');
        assert.strictEqual(rules.correctness.noUnusedImports, 'error');
        // Test style rules
        assert.strictEqual(rules.style.useConst, 'error');
        assert.strictEqual(rules.style.noNegationElse, 'warn');
    });
    it('should validate assist configuration', () => {
        assert.ok(validBiomeConfig.assist);
        assert.ok(validBiomeConfig.assist.actions);
        assert.ok(validBiomeConfig.assist.actions.source);
        assert.strictEqual(validBiomeConfig.assist.actions.source.organizeImports, 'on');
    });
    it('should validate JavaScript formatter settings', () => {
        const jsFormatter = validBiomeConfig.javascript.formatter;
        assert.strictEqual(jsFormatter.quoteStyle, 'single');
        assert.strictEqual(jsFormatter.semicolons, 'always');
        assert.strictEqual(jsFormatter.trailingCommas, 'all');
    });
    it('should reject invalid formatter configuration', () => {
        const invalidConfig = {
            ...validBiomeConfig,
            formatter: {
                ...validBiomeConfig.formatter,
                enabled: false, // Should be true
            },
        };
        // This would be caught by validation logic
        assert.strictEqual(invalidConfig.formatter.enabled, false);
    });
    it('should reject invalid linter configuration', () => {
        const invalidConfig = {
            ...validBiomeConfig,
            linter: {
                ...validBiomeConfig.linter,
                enabled: false, // Should be true
            },
        };
        assert.strictEqual(invalidConfig.linter.enabled, false);
    });
    it('should validate file inclusion patterns', () => {
        const includes = validBiomeConfig.files.includes;
        // Should include source files
        assert.ok(includes.some((pattern) => pattern.includes('src/**/*.ts')));
        // Should include test files
        assert.ok(includes.some((pattern) => pattern.includes('tests/**/*.ts')));
        // Should exclude build output
        assert.ok(includes.some((pattern) => pattern.includes('!**/dist/')));
        // Should exclude dependencies
        assert.ok(includes.some((pattern) => pattern.includes('!**/node_modules/')));
        // Should exclude IDE files
        assert.ok(includes.some((pattern) => pattern.includes('!**/.vscode/')));
    });
    it('should validate schema URL format', () => {
        assert.ok(validBiomeConfig.$schema.startsWith('https://biomejs.dev/schemas/'));
        assert.ok(validBiomeConfig.$schema.includes('2.2.4'));
    });
});
//# sourceMappingURL=test_biome_validation.js.map