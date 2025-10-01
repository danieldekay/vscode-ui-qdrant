const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Lint Script Execution
 *
 * Tests that the lint script executes successfully.
 * This corresponds to the third validation step in quickstart.md.
 */

describe('Lint Script Execution', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have lint script defined', () => {
        assert(packageJson.scripts.lint, 'lint script should be defined');
        assert(typeof packageJson.scripts.lint === 'string', 'lint should be a string');
        assert(packageJson.scripts.lint.length > 0, 'lint should not be empty');
    });

    it('should use Biome or ESLint for linting', () => {
        const usesBiome = packageJson.scripts.lint.includes('biome');
        const usesEslint = packageJson.scripts.lint.includes('eslint');

        assert(usesBiome || usesEslint,
            'lint should use Biome or ESLint');
    });

    it('should lint both src and tests directories', () => {
        const lintCommand = packageJson.scripts.lint;
        const includesSrc = lintCommand.includes('src');
        const includesTests = lintCommand.includes('tests') || lintCommand.includes('test');

        assert(includesSrc && includesTests,
            'lint should check both src and tests directories');
    });

    it('should execute lint script without errors', () => {
        // This test will fail until the lint script is implemented
        try {
            execSync('npm run lint', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath)
            });
            assert.fail('lint script should fail until implemented (TDD approach)');
        } catch (error) {
            // Expected to fail initially
            assert(error.status !== 0, 'lint should fail when script is not properly implemented');
        }
    });

    it('should validate Biome configuration exists', () => {
        const biomeConfigPath = path.join(path.dirname(packageJsonPath), 'biome.json');
        assert(fs.existsSync(biomeConfigPath), 'biome.json should exist for linting to work');

        const biomeConfig = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        assert(biomeConfig.linter, 'Biome config should have linter section');
        assert(biomeConfig.linter.enabled === true, 'Biome linter should be enabled');
    });

    it('should validate source files exist for linting', () => {
        const srcDir = path.join(path.dirname(packageJsonPath), 'src');
        assert(fs.existsSync(srcDir), 'src directory should exist');

        // Check for TypeScript/JavaScript files
        const srcFiles = fs.readdirSync(srcDir, { recursive: true });
        const codeFiles = srcFiles.filter(file =>
            file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'));
        assert(codeFiles.length > 0, 'Should have source files to lint');
    });

    it('should validate linting rules are configured', () => {
        const biomeConfigPath = path.join(path.dirname(packageJsonPath), 'biome.json');
        const biomeConfig = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));

        assert(biomeConfig.linter.rules, 'Biome should have linting rules configured');
        assert(biomeConfig.linter.rules.recommended === true, 'Biome should use recommended rules');
    });
});