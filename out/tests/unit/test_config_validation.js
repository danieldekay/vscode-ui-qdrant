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
describe('Configuration Validation Unit Tests', () => {
    const originalTsconfigPath = path.join(__dirname, '../../tsconfig.json');
    const backupTsconfigPath = path.join(__dirname, '../../tsconfig.json.backup');
    beforeEach(() => {
        // Backup original tsconfig.json
        if (fs.existsSync(originalTsconfigPath)) {
            fs.copyFileSync(originalTsconfigPath, backupTsconfigPath);
        }
    });
    afterEach(() => {
        // Restore original tsconfig.json
        if (fs.existsSync(backupTsconfigPath)) {
            fs.copyFileSync(backupTsconfigPath, originalTsconfigPath);
            fs.unlinkSync(backupTsconfigPath);
        }
    });
    it('should validate correct tsconfig.json structure', () => {
        const tsconfig = {
            compilerOptions: {
                strict: true,
                target: 'ES2022',
                sourceMap: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noImplicitReturns: true,
                skipLibCheck: true,
                outDir: './dist',
                rootDir: './src',
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist'],
        };
        fs.writeFileSync(originalTsconfigPath, JSON.stringify(tsconfig, null, 2));
        // Import and test the validation function
        const { validateTsConfig } = require('../../scripts/validate-tsconfig.js');
        // Mock console methods to capture output
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const logs = [];
        const errors = [];
        console.log = (...args) => logs.push(args.join(' '));
        console.error = (...args) => errors.push(args.join(' '));
        try {
            // This should not throw
            validateTsConfig();
            assert.strictEqual(errors.length, 0, 'Should have no errors');
            assert.ok(logs.some((log) => log.includes('✅')), 'Should log success');
            assert.ok(logs.some((log) => log.includes('compliant')), 'Should log compliance');
        }
        finally {
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
        }
    });
    it('should reject tsconfig.json with missing required options', () => {
        const invalidTsconfig = {
            compilerOptions: {
                // Missing required options
                target: 'ES2022',
            },
        };
        fs.writeFileSync(originalTsconfigPath, JSON.stringify(invalidTsconfig, null, 2));
        const { validateTsConfig } = require('../../scripts/validate-tsconfig.js');
        const originalConsoleError = console.error;
        const originalExit = process.exit;
        const errors = [];
        let exitCalled = false;
        console.error = (...args) => errors.push(args.join(' '));
        process.exit = (() => {
            exitCalled = true;
            throw new Error('exit');
        });
        try {
            assert.throws(() => validateTsConfig(), /exit/, 'Should exit with error');
            assert.ok(exitCalled, 'Exit should be called');
            assert.ok(errors.length > 0, 'Should have errors');
            assert.ok(errors.some((error) => error.includes('Missing required compiler option')), 'Should report missing options');
        }
        finally {
            console.error = originalConsoleError;
            process.exit = originalExit;
        }
    });
    it('should reject tsconfig.json with invalid option values', () => {
        const invalidTsconfig = {
            compilerOptions: {
                strict: false, // Should be true
                target: 'ES5', // Should be ES2022+
                sourceMap: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noImplicitReturns: true,
                skipLibCheck: true,
            },
            include: ['src/**/*'],
        };
        fs.writeFileSync(originalTsconfigPath, JSON.stringify(invalidTsconfig, null, 2));
        const { validateTsConfig } = require('../../scripts/validate-tsconfig.js');
        const originalConsoleError = console.error;
        const originalExit = process.exit;
        const errors = [];
        let exitCalled = false;
        console.error = (...args) => errors.push(args.join(' '));
        process.exit = (() => {
            exitCalled = true;
            throw new Error('exit');
        });
        try {
            assert.throws(() => validateTsConfig(), /exit/, 'Should exit with error');
            assert.ok(exitCalled, 'Exit should be called');
            assert.ok(errors.some((error) => error.includes('Invalid strict')), 'Should report invalid strict');
            assert.ok(errors.some((error) => error.includes('Invalid target')), 'Should report invalid target');
        }
        finally {
            console.error = originalConsoleError;
            process.exit = originalExit;
        }
    });
    it('should provide warnings for non-critical configuration issues', () => {
        const tsconfigWithWarnings = {
            compilerOptions: {
                strict: true,
                target: 'ES2022',
                sourceMap: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noImplicitReturns: true,
                skipLibCheck: true,
                outDir: './build', // Non-standard
                rootDir: './lib', // Non-standard
            },
            include: ['src/**/*'],
            // Missing exclude
        };
        fs.writeFileSync(originalTsconfigPath, JSON.stringify(tsconfigWithWarnings, null, 2));
        const { validateTsConfig } = require('../../scripts/validate-tsconfig.js');
        const originalConsoleLog = console.log;
        const logs = [];
        console.log = (...args) => logs.push(args.join(' '));
        try {
            validateTsConfig();
            assert.ok(logs.some((log) => log.includes('⚠️')), 'Should warn about missing excludes');
            assert.ok(logs.some((log) => log.includes('Consider excluding')), 'Should suggest excluding node_modules');
        }
        finally {
            console.log = originalConsoleLog;
        }
    });
});
//# sourceMappingURL=test_config_validation.js.map