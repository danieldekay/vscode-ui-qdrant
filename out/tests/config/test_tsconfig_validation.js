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
describe('TypeScript Configuration Validation', () => {
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    it('should have valid tsconfig.json with required compiler options', () => {
        // This test should fail until tsconfig.json is created
        assert.strictEqual(fs.existsSync(tsconfigPath), true);
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        assert.ok(tsconfig.compilerOptions);
        assert.strictEqual(tsconfig.compilerOptions?.strict, true);
        assert.ok(['ES2022', 'ES2023', 'ESNext'].includes(tsconfig.compilerOptions?.target || ''));
        assert.strictEqual(tsconfig.compilerOptions?.sourceMap, true);
        assert.strictEqual(tsconfig.compilerOptions?.noUnusedLocals, true);
        assert.strictEqual(tsconfig.compilerOptions?.noUnusedParameters, true);
        assert.strictEqual(tsconfig.compilerOptions?.noImplicitReturns, true);
        assert.strictEqual(tsconfig.compilerOptions?.skipLibCheck, true);
        assert.ok(tsconfig.include?.includes('src/**/*'));
        assert.ok(tsconfig.exclude?.includes('node_modules'));
        assert.ok(tsconfig.exclude?.includes('dist'));
    });
    it('should validate compiler options schema', () => {
        // This test should fail until tsconfig.json is created
        assert.strictEqual(fs.existsSync(tsconfigPath), true);
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const requiredOptions = [
            'strict',
            'target',
            'sourceMap',
            'noUnusedLocals',
            'noUnusedParameters',
            'noImplicitReturns',
            'skipLibCheck',
        ];
        for (const option of requiredOptions) {
            assert.ok(option in (tsconfig.compilerOptions || {}));
        }
    });
});
//# sourceMappingURL=test_tsconfig_validation.js.map