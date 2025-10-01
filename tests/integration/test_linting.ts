import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Test: Linting Validation
 *
 * Validates that Biome linting correctly identifies and reports
 * code quality issues in TypeScript files.
 *
 * This test MUST FAIL before biome.json configuration is created.
 */
describe('Linting Validation', () => {
  const testFilePath = path.join(__dirname, '../../src/test-linting.ts');

  beforeEach(() => {
    // Create a test file with intentional linting violations
    const codeWithIssues = `import * as fs from 'fs';
import * as path from 'path'; // Unused import

export function testFunction(param: string): string {
  let unused = 'test'; // Unused variable
  const result = \`Hello, \${param}\`;
  return result;
}

// Missing semicolon and poor formatting
function poorlyFormatted( param:string ){return param}`;

    fs.writeFileSync(testFilePath, codeWithIssues);
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('should detect linting violations in test file', () => {
    // This test will fail until Biome is configured
    // It validates that linting can identify issues
    try {
      execSync('npx biome check src/test-linting.ts', { encoding: 'utf8' });
      assert.fail('Expected linting to fail on file with violations');
    } catch (error) {
      // Expected to fail - validate error structure
      const execError = error as { stdout?: string; stderr?: string };
      assert.ok(execError.stdout || execError.stderr, 'Should have error output');
      const output = execError.stdout || execError.stderr || '';

      // Should contain error information
      assert.ok(output.includes('error') || output.includes('Error'), 'Should report errors');
    }
  });

  it('should have biome.json configuration for linting rules', () => {
    const biomeConfigPath = path.join(__dirname, '../../biome.json');
    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for linting');

    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
    assert.ok(config.linter?.rules, 'linter rules must be configured');
  });

  it('should validate specific linting rules are active', () => {
    const biomeConfigPath = path.join(__dirname, '../../biome.json');
    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist');

    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));

    // Check for recommended rules
    assert.ok(config.linter?.rules?.recommended !== false, 'recommended rules should be enabled');

    // Check for specific correctness rules
    const correctnessRules = config.linter?.rules?.correctness || {};
    assert.ok(correctnessRules.noUnusedVariables !== 'off', 'noUnusedVariables should be enabled');
    assert.ok(correctnessRules.noUnusedImports !== 'off', 'noUnusedImports should be enabled');
  });
});
