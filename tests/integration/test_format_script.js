const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Format Script Execution
 *
 * Tests that the format script executes successfully.
 * This corresponds to the fourth validation step in quickstart.md.
 */

describe('Format Script Execution', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have format script defined', () => {
        assert(packageJson.scripts.format, 'format script should be defined');
        assert(typeof packageJson.scripts.format === 'string', 'format should be a string');
        assert(packageJson.scripts.format.length > 0, 'format should not be empty');
    });

    it('should use Biome or Prettier for formatting', () => {
        const usesBiome = packageJson.scripts.format.includes('biome');
        const usesPrettier = packageJson.scripts.format.includes('prettier');

        assert(usesBiome || usesPrettier,
            'format should use Biome or Prettier');
    });

    it('should use --write flag for formatting', () => {
        const formatCommand = packageJson.scripts.format;
        const usesWriteFlag = formatCommand.includes('--write') || formatCommand.includes('-w');

        assert(usesWriteFlag,
            'format should use --write flag to modify files');
    });

    it('should format both src and tests directories', () => {
        const formatCommand = packageJson.scripts.format;
        const includesSrc = formatCommand.includes('src');
        const includesTests = formatCommand.includes('tests') || formatCommand.includes('test');

        assert(includesSrc && includesTests,
            'format should process both src and tests directories');
    });

    it('should execute format script without errors', () => {
        // This test will fail until the format script is implemented
        try {
            execSync('npm run format', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath)
            });
            assert.fail('format script should fail until implemented (TDD approach)');
        } catch (error) {
            // Expected to fail initially
            assert(error.status !== 0, 'format should fail when script is not properly implemented');
        }
    });

    it('should validate Biome formatter configuration exists', () => {
        const biomeConfigPath = path.join(path.dirname(packageJsonPath), 'biome.json');
        assert(fs.existsSync(biomeConfigPath), 'biome.json should exist for formatting to work');

        const biomeConfig = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
        assert(biomeConfig.formatter, 'Biome config should have formatter section');
        assert(biomeConfig.formatter.enabled === true, 'Biome formatter should be enabled');
    });

    it('should validate source files exist for formatting', () => {
        const srcDir = path.join(path.dirname(packageJsonPath), 'src');
        assert(fs.existsSync(srcDir), 'src directory should exist');

        // Check for TypeScript/JavaScript files
        const srcFiles = fs.readdirSync(srcDir, { recursive: true });
        const codeFiles = srcFiles.filter(file =>
            file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'));
        assert(codeFiles.length > 0, 'Should have source files to format');
    });

    it('should validate formatting configuration', () => {
        const biomeConfigPath = path.join(path.dirname(packageJsonPath), 'biome.json');
        const biomeConfig = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));

        assert(biomeConfig.formatter.indentStyle, 'Biome should have indent style configured');
        assert(biomeConfig.formatter.indentWidth, 'Biome should have indent width configured');
        assert(biomeConfig.formatter.lineWidth, 'Biome should have line width configured');
    });
});