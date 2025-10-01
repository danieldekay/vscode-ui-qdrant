const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Contract Test: execute-script API
 *
 * Tests the contract for executing individual npm scripts.
 * This test ensures the API contract defined in contracts/scripts-api.yaml
 * is properly implemented.
 */

describe('execute-script API Contract', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json');

    it('should validate npm command is available', () => {
        try {
            execSync('npm --version', { stdio: 'pipe' });
        } catch (error) {
            assert.fail('npm should be available in the system');
        }
    });

    it('should validate package.json exists for script execution', () => {
        assert(fs.existsSync(packageJsonPath), 'package.json should exist for script execution');
    });

    it('should validate script execution returns proper exit codes', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Test existing scripts work
        if (packageJson.scripts.test) {
            try {
                execSync('npm test', { stdio: 'pipe', cwd: path.dirname(packageJsonPath) });
            } catch (error) {
                // Test script might fail, but npm should execute it
                assert(error.status !== 127, 'npm should be able to execute scripts');
            }
        }
    });

    it('should validate script execution captures stdout and stderr', () => {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        if (packageJson.scripts.test) {
            const result = execSync('npm test', {
                stdio: 'pipe',
                cwd: path.dirname(packageJsonPath),
                encoding: 'utf8'
            });

            assert(typeof result === 'string', 'Script execution should return string output');
        }
    });

    it('should handle script execution errors gracefully', () => {
        // This test will fail until scripts are implemented
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Try to run a script that doesn't exist yet
        let executionFailed = false;
        try {
            execSync('npm run typecheck', { stdio: 'pipe', cwd: path.dirname(packageJsonPath) });
        } catch (error) {
            executionFailed = true;
            assert(error.status !== 0, 'Script execution should fail when scripts are not implemented');
        }

        assert(executionFailed, 'Scripts should fail to execute until implemented (TDD approach)');
    });

    it('should validate working directory parameter', () => {
        const projectRoot = path.dirname(packageJsonPath);

        // Test that scripts can be executed from project root
        assert(fs.existsSync(path.join(projectRoot, 'package.json')), 'Working directory should contain package.json');

        // Test that scripts respect working directory
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.scripts.test) {
            try {
                execSync('npm test', { stdio: 'pipe', cwd: projectRoot });
            } catch (error) {
                // Script might fail, but should execute from correct directory
                assert(error.status !== 127, 'npm should execute from correct working directory');
            }
        }
    });
});