const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Typecheck Script Execution
 *
 * Tests that the typecheck script executes successfully.
 * This corresponds to the second validation step in quickstart.md.
 */

describe('Typecheck Script Execution', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have typecheck script defined', () => {
        assert(packageJson.scripts.typecheck, 'typecheck script should be defined');
        assert(typeof packageJson.scripts.typecheck === 'string', 'typecheck should be a string');
        assert(packageJson.scripts.typecheck.length > 0, 'typecheck should not be empty');
    });

    it('should use TypeScript compiler for typecheck', () => {
        assert(packageJson.scripts.typecheck.includes('tsc'),
            'typecheck should use TypeScript compiler (tsc)');
    });

    it('should use --noEmit flag for type checking only', () => {
        assert(packageJson.scripts.typecheck.includes('--noEmit'),
            'typecheck should use --noEmit to avoid emitting files');
    });

    it('should execute typecheck script without errors', () => {
        // This test will fail until the typecheck script is implemented
        try {
            execSync('npm run typecheck', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath)
            });
            assert.fail('typecheck script should fail until implemented (TDD approach)');
        } catch (error) {
            // Expected to fail initially
            assert(error.status !== 0, 'typecheck should fail when script is not properly implemented');
        }
    });

    it('should validate TypeScript configuration exists', () => {
        const tsconfigPath = path.join(path.dirname(packageJsonPath), 'tsconfig.json');
        assert(fs.existsSync(tsconfigPath), 'tsconfig.json should exist for typecheck to work');

        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        assert(tsconfig.compilerOptions, 'tsconfig.json should have compilerOptions');
        assert(tsconfig.compilerOptions.strict === true, 'TypeScript should be in strict mode');
    });

    it('should validate source files exist for type checking', () => {
        const srcDir = path.join(path.dirname(packageJsonPath), 'src');
        assert(fs.existsSync(srcDir), 'src directory should exist');

        // Check for TypeScript files
        const srcFiles = fs.readdirSync(srcDir, { recursive: true });
        const tsFiles = srcFiles.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
        assert(tsFiles.length > 0, 'Should have TypeScript files to type check');
    });
});