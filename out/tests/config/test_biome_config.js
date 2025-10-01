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
 * Test: Biome Configuration Validation
 *
 * Validates that biome.json contains required configuration sections
 * and follows constitutional requirements for linting and formatting.
 *
 * This test MUST FAIL before biome.json is created.
 */
describe('Biome Configuration Validation', () => {
    const biomeConfigPath = path.join(__dirname, '../../biome.json');
    it('should have biome.json file at project root', () => {
        assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist at project root');
    });
    it('should have valid biome.json structure', () => {
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        // Required sections
        assert.ok(config.formatter, 'formatter section must be present');
        assert.ok(config.linter, 'linter section must be present');
        assert.ok(config.files, 'files section must be present');
        // Formatter requirements
        assert.strictEqual(config.formatter.enabled, true, 'formatter must be enabled');
        assert.strictEqual(config.formatter.indentStyle, 'space', 'indentStyle must be space');
        assert.strictEqual(config.formatter.indentWidth, 2, 'indentWidth must be 2');
        assert.ok(config.formatter.lineWidth <= 120, 'lineWidth must be <= 120');
        // Linter requirements
        assert.strictEqual(config.linter.enabled, true, 'linter must be enabled');
        assert.ok(config.linter.rules, 'linter rules must be defined');
        // Files requirements
        assert.ok(config.files.ignore, 'files.ignore must be defined');
        assert.ok(config.files.ignore.includes('dist/'), 'must ignore dist/');
        assert.ok(config.files.ignore.includes('node_modules/'), 'must ignore node_modules/');
    });
    it('should have organizeImports enabled', () => {
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        assert.ok(config.organizeImports, 'organizeImports section must be present');
        assert.strictEqual(config.organizeImports.enabled, true, 'organizeImports must be enabled');
    });
    it('should include TypeScript files in processing', () => {
        const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        assert.ok(config.files.include, 'files.include must be defined');
        assert.ok(config.files.include.some((pattern) => pattern.includes('src/**/*.ts')), 'must include src/**/*.ts');
        assert.ok(config.files.include.some((pattern) => pattern.includes('tests/**/*.ts')), 'must include tests/**/*.ts');
    });
});
//# sourceMappingURL=test_biome_config.js.map