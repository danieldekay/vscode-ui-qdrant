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
describe('Source Map Generation Validation', () => {
    const srcDir = path.join(__dirname, '../../src');
    const distDir = path.join(__dirname, '../../dist');
    it('should generate source map files alongside JavaScript output', () => {
        // Create a test TypeScript file
        const testFile = path.join(srcDir, 'test-source-maps.ts');
        const testContent = `
export function testFunction(param: string): string {
  return \`Hello, \${param}!\`;
}
`;
        fs.writeFileSync(testFile, testContent);
        try {
            const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
            assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');
            // Compile with source maps enabled
            (0, node_child_process_1.execSync)('npx tsc', { cwd: path.join(__dirname, '../..') });
            // Check output files exist
            const jsFile = path.join(distDir, 'test-source-maps.js');
            const sourceMapFile = path.join(distDir, 'test-source-maps.js.map');
            assert.ok(fs.existsSync(jsFile), 'JavaScript output file should exist');
            assert.ok(fs.existsSync(sourceMapFile), 'Source map file should exist');
            // Check JavaScript contains source map reference
            const jsContent = fs.readFileSync(jsFile, 'utf8');
            assert.ok(jsContent.includes('//# sourceMappingURL=test-source-maps.js.map'), 'JavaScript should reference source map');
        }
        finally {
            // Clean up
            if (fs.existsSync(testFile)) {
                fs.unlinkSync(testFile);
            }
            if (fs.existsSync(distDir)) {
                fs.rmSync(distDir, { recursive: true, force: true });
            }
        }
    });
    it('should create valid source map with correct structure', () => {
        // Create a test TypeScript file
        const testFile = path.join(srcDir, 'test-source-maps.ts');
        const testContent = `
export class TestClass {
  greet(): string {
    return 'Hello World';
  }
}
`;
        fs.writeFileSync(testFile, testContent);
        try {
            const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
            assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');
            // Compile with source maps enabled
            (0, node_child_process_1.execSync)('npx tsc', { cwd: path.join(__dirname, '../..') });
            // Check source map exists and is valid
            const sourceMapFile = path.join(distDir, 'test-source-maps.js.map');
            assert.ok(fs.existsSync(sourceMapFile), 'Source map file should exist');
            const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, 'utf8'));
            assert.strictEqual(sourceMap.version, 3, 'Source map version should be 3');
            assert.ok(Array.isArray(sourceMap.sources), 'Sources should be an array');
            assert.ok(sourceMap.sources.includes('src/test-source-maps.ts'), 'Should contain source file');
            assert.ok(typeof sourceMap.mappings === 'string', 'Mappings should be a string');
            assert.ok(sourceMap.mappings.length > 0, 'Mappings should not be empty');
        }
        finally {
            // Clean up
            if (fs.existsSync(testFile)) {
                fs.unlinkSync(testFile);
            }
            if (fs.existsSync(distDir)) {
                fs.rmSync(distDir, { recursive: true, force: true });
            }
        }
    });
});
//# sourceMappingURL=test_source_maps.js.map