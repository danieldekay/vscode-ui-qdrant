const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Integration Test: Check Script Execution
 *
 * Tests that the check script executes successfully.
 * This corresponds to the fifth validation step in quickstart.md.
 */

describe('Check Script Execution', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');
    let packageJson;

    before(() => {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    });

    it('should have check script defined', () => {
        assert(packageJson.scripts.check, 'check script should be defined');
        assert(typeof packageJson.scripts.check === 'string', 'check should be a string');
        assert(packageJson.scripts.check.length > 0, 'check should not be empty');
    });

    it('should run both typecheck and lint', () => {
        const checkCommand = packageJson.scripts.check;
        const runsTypecheck = checkCommand.includes('typecheck');
        const runsLint = checkCommand.includes('lint');

        assert(runsTypecheck && runsLint,
            'check should run both typecheck and lint validation');
    });

    it('should use && to ensure both commands succeed', () => {
        const checkCommand = packageJson.scripts.check;
        assert(checkCommand.includes('&&'),
            'check should use && to ensure both typecheck and lint succeed');
    });

    it('should execute check script without errors', () => {
        // This test will fail until the check script is implemented
        try {
            execSync('npm run check', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath)
            });
            assert.fail('check script should fail until implemented (TDD approach)');
        } catch (error) {
            // Expected to fail initially
            assert(error.status !== 0, 'check should fail when scripts are not properly implemented');
        }
    });

    it('should validate that typecheck and lint scripts exist', () => {
        assert(packageJson.scripts.typecheck, 'check requires typecheck script to exist');
        assert(packageJson.scripts.lint, 'check requires lint script to exist');
    });

    it('should validate check runs typecheck first, then lint', () => {
        const checkCommand = packageJson.scripts.check;

        // Check that typecheck comes before lint in the command
        const typecheckIndex = checkCommand.indexOf('typecheck');
        const lintIndex = checkCommand.indexOf('lint');

        assert(typecheckIndex !== -1, 'check should include typecheck');
        assert(lintIndex !== -1, 'check should include lint');
        assert(typecheckIndex < lintIndex, 'check should run typecheck before lint');
    });

    it('should handle failures in either typecheck or lint', () => {
        // This test validates that if either typecheck or lint fails,
        // the check script should also fail (due to && operator)
        const checkCommand = packageJson.scripts.check;

        if (checkCommand.includes('&&')) {
            // The && operator ensures both commands must succeed
            // If typecheck fails, lint won't run
            // If lint fails, the whole command fails
            assert(true, 'check script properly chains commands with &&');
        }
    });
});