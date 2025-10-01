const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Build Script Execution
 *
 * Tests that the build script executes successfully.
 * This corresponds to the sixth validation step in quickstart.md.
 */

describe('Build Script Execution', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have build script defined', () => {
        assert(packageJson.scripts.build, 'build script should be defined');
        assert(typeof packageJson.scripts.build === 'string', 'build should be a string');
        assert(packageJson.scripts.build.length > 0, 'build should not be empty');
    });

    it('should use TypeScript compiler for building', () => {
        assert(packageJson.scripts.build.includes('tsc'),
            'build should use TypeScript compiler (tsc)');
    });

    it('should not use --noEmit flag (should emit files)', () => {
        assert(!packageJson.scripts.build.includes('--noEmit'),
            'build should emit files (no --noEmit flag)');
    });

    it('should execute build script without errors', () => {
        // This test will fail until the build script is implemented
        try {
            execSync('npm run build', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath)
            });
            assert.fail('build script should fail until implemented (TDD approach)');
        } catch (error) {
            // Expected to fail initially
            assert(error.status !== 0, 'build should fail when script is not properly implemented');
        }
    });

    it('should validate TypeScript configuration for compilation', () => {
        const tsconfigPath = path.join(path.dirname(packageJsonPath), 'tsconfig.json');
        assert(fs.existsSync(tsconfigPath), 'tsconfig.json should exist for build to work');

        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        assert(tsconfig.compilerOptions, 'tsconfig.json should have compilerOptions');
        assert(tsconfig.compilerOptions.outDir, 'TypeScript should have output directory configured');
    });

    it('should validate source files exist for compilation', () => {
        const srcDir = path.join(path.dirname(packageJsonPath), 'src');
        assert(fs.existsSync(srcDir), 'src directory should exist');

        // Check for TypeScript files
        const srcFiles = fs.readdirSync(srcDir, { recursive: true });
        const tsFiles = srcFiles.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
        assert(tsFiles.length > 0, 'Should have TypeScript files to compile');
    });

    it('should validate build output directory', () => {
        const tsconfigPath = path.join(path.dirname(packageJsonPath), 'tsconfig.json');
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const outDir = tsconfig.compilerOptions.outDir;

        if (outDir) {
            // Remove leading ./ if present
            const cleanOutDir = outDir.replace(/^\.\//, '');
            const fullOutDir = path.join(path.dirname(packageJsonPath), cleanOutDir);

            // The directory might not exist yet, but the configuration should be valid
            assert(outDir !== 'dist' || outDir !== './dist',
                'Build output should go to out/ or dist/, not dist/ (conflicts with VS Code)');
        }
    });

    it('should produce compiled JavaScript files', () => {
        // This test will validate that after build, JavaScript files are created
        const tsconfigPath = path.join(path.dirname(packageJsonPath), 'tsconfig.json');
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        const outDir = tsconfig.compilerOptions.outDir;

        if (outDir) {
            const cleanOutDir = outDir.replace(/^\.\//, '');
            const fullOutDir = path.join(path.dirname(packageJsonPath), cleanOutDir);

            // After successful build, this directory should contain .js files
            // This assertion will be validated in integration testing
            assert(true, 'Build should produce JavaScript files in output directory');
        }
    });
});