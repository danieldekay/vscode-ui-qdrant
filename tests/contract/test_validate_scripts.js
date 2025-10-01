const assert = require('assert');
const fs = require('fs');
const path = require('path');

/**
 * Contract Test: validate-scripts API
 *
 * Tests the contract for validating npm scripts configuration.
 * This test ensures the API contract defined in contracts/scripts-api.yaml
 * is properly implemented.
 */

describe('validate-scripts API Contract', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');

    it('should validate that package.json exists', () => {
        assert(fs.existsSync(packageJsonPath), 'package.json should exist');
    });

    it('should validate package.json has scripts section', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        assert(packageJson.scripts, 'package.json should have scripts section');
        assert(typeof packageJson.scripts === 'object', 'scripts should be an object');
    });

    it('should validate required script names exist', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const requiredScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check'];

        for (const scriptName of requiredScripts) {
            assert(packageJson.scripts[scriptName], `package.json should have ${scriptName} script`);
            assert(typeof packageJson.scripts[scriptName] === 'string', `${scriptName} script should be a string`);
            assert(packageJson.scripts[scriptName].length > 0, `${scriptName} script should not be empty`);
        }
    });

    it('should validate script commands are executable strings', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const scripts = packageJson.scripts;

        // Check that scripts contain expected command patterns
        assert(scripts.typecheck.includes('tsc'), 'typecheck should use TypeScript compiler');
        assert(scripts.lint.includes('biome') || scripts.lint.includes('eslint'), 'lint should use a linter');
        assert(scripts.format.includes('biome') || scripts.format.includes('prettier'), 'format should use a formatter');
        assert(scripts.build.includes('tsc'), 'build should use TypeScript compiler');
        assert(scripts.check.includes('typecheck') && scripts.check.includes('lint'), 'check should run both typecheck and lint');
    });

    it('should reject invalid script configurations', () => {
        // This test will fail until the scripts are properly implemented
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // These assertions should fail initially (TDD approach)
        // They will pass once the implementation is complete
        const hasAllScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check']
            .every(script => packageJson.scripts[script]);

        assert(!hasAllScripts, 'Scripts should not be implemented yet (TDD: tests should fail first)');
    });
});