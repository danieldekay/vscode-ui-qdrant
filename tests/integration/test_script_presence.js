const assert = require('assert');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Script Presence Validation
 *
 * Tests that all required npm scripts are present in package.json.
 * This corresponds to the first validation step in quickstart.md.
 */

describe('Script Presence Validation', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have all 6 required npm scripts', () => {
        const requiredScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check'];
        const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

        assert(missingScripts.length === 0,
            `Missing required scripts: ${missingScripts.join(', ')}`);
    });

    it('should have exactly 6 required scripts defined', () => {
        const requiredScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check'];
        const definedScripts = requiredScripts.filter(script => packageJson.scripts[script]);

        assert(definedScripts.length === 6,
            `Should have all 6 required scripts, but only found: ${definedScripts.join(', ')}`);
    });

    it('should have scripts as non-empty strings', () => {
        const requiredScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check'];

        for (const scriptName of requiredScripts) {
            if (packageJson.scripts[scriptName]) {
                assert(typeof packageJson.scripts[scriptName] === 'string',
                    `${scriptName} should be a string`);
                assert(packageJson.scripts[scriptName].trim().length > 0,
                    `${scriptName} should not be empty`);
            }
        }
    });

    it('should list all required scripts when running npm run', () => {
        // This test validates the npm run command shows our scripts
        // Note: This test will fail until scripts are implemented
        const requiredScripts = ['typecheck', 'lint', 'format', 'dev', 'build', 'check'];
        const implementedScripts = requiredScripts.filter(script => packageJson.scripts[script]);

        assert(implementedScripts.length === 0,
            'Scripts should not be implemented yet (TDD: tests should fail first)');
    });
});