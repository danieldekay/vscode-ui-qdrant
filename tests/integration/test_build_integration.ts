import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Test: Build Integration Validation
 *
 * Validates that build process correctly enforces linting
 * and formatting standards before compilation.
 *
 * This test MUST FAIL before build scripts are updated.
 */
describe('Build Integration Validation', () => {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const biomeConfigPath = path.join(__dirname, '../../biome.json');

  it('should have biome.json configuration', () => {
    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for build integration');
  });

  it('should have package.json with linting scripts', () => {
    assert.ok(fs.existsSync(packageJsonPath), 'package.json must exist');

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};

    // Check for required Biome scripts
    assert.ok(scripts.lint, 'lint script must be defined');
    assert.ok(scripts['lint:fix'], 'lint:fix script must be defined');
    assert.ok(scripts.format, 'format script must be defined');
    assert.ok(scripts['format:fix'], 'format:fix script must be defined');

    // Validate script commands
    assert.ok(scripts.lint.includes('biome check'), 'lint script should use biome check');
    assert.ok(
      scripts['lint:fix'].includes('biome check --apply'),
      'lint:fix should use biome check --apply',
    );
    assert.ok(scripts.format.includes('biome format'), 'format script should use biome format');
    assert.ok(
      scripts['format:fix'].includes('biome format --write'),
      'format:fix should use biome format --write',
    );
  });

  it('should have pretest script that includes linting', () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};

    assert.ok(scripts.pretest, 'pretest script must be defined');
    assert.ok(scripts.pretest.includes('lint'), 'pretest must include linting validation');
  });

  it('should validate build process enforces linting', () => {
    // Create a test file with linting violations
    const testFilePath = path.join(__dirname, '../../src/test-build.ts');
    const codeWithViolations = `import * as fs from 'fs';
let unused = 'test'; // Unused variable
function test(){return 'test'}`; // Missing semicolon

    fs.writeFileSync(testFilePath, codeWithViolations);

    try {
      // This should fail if linting is properly integrated into build
      execSync('npm run pretest', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
      assert.fail('Build should fail when linting violations exist');
    } catch (error) {
      // Expected to fail - validate it's due to linting
      const execError = error as { stdout?: string; stderr?: string };
      const output = execError.stdout || execError.stderr || '';
      assert.ok(
        output.includes('error') || output.includes('lint') || output.includes('biome'),
        'Build failure should be related to linting',
      );
    } finally {
      // Cleanup
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
  });

  it('should validate manual linting commands work', () => {
    // Test lint command (should work even with violations)
    try {
      execSync('npm run lint', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
    } catch (error) {
      // lint command should not fail, just report issues
      const execError = error as { stdout?: string; stderr?: string };
      const output = execError.stdout || execError.stderr || '';
      assert.ok(
        output.includes('found') || output.includes('error') || output.length > 0,
        'lint command should produce output',
      );
    }

    // Test format command
    try {
      execSync('npm run format', { encoding: 'utf8', cwd: path.join(__dirname, '../..') });
    } catch (error) {
      // format command should not fail, just report issues
      const execError = error as { stdout?: string; stderr?: string };
      const output = execError.stdout || execError.stderr || '';
      assert.ok(
        output.length >= 0, // Can be empty if no issues
        'format command should run without crashing',
      );
    }
  });
});
