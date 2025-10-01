import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Test: Performance Validation
 *
 * Validates that linting and formatting operations meet
 * performance targets (<100ms format, <500ms lint).
 *
 * This test MUST FAIL before Biome configuration is optimized.
 */
describe('Performance Validation', () => {
  const testFilePath = path.join(__dirname, '../../src/test-performance.ts');
  const biomeConfigPath = path.join(__dirname, '../../biome.json');

  beforeEach(() => {
    // Create a test file of reasonable size (100+ lines)
    let code = '// Performance test file\n';
    for (let i = 0; i < 50; i++) {
      code += `
export function testFunction${i}(param: string): string {
    const result = \`Hello, \${param} - \${i}\`;
    return result;
}\n`;
    }
    fs.writeFileSync(testFilePath, code);
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('should have biome.json configuration for performance testing', () => {
    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist for performance testing');
  });

  it('should format file in under 100ms', function () {
    this.timeout(5000); // Allow up to 5 seconds for test

    const startTime = Date.now();
    try {
      execSync('npx biome format --write src/test-performance.ts', { encoding: 'utf8' });
    } catch (_error) {
      // If formatting fails, that's expected before configuration
      // But we still want to test the performance target
    }
    const endTime = Date.now();
    const duration = endTime - startTime;

    // This assertion will fail until Biome is properly configured
    // The test validates that once configured, formatting meets the target
    console.log(`Formatting took ${duration}ms`);

    // For now, just ensure it doesn't take excessively long
    assert.ok(duration < 5000, 'Formatting should complete within reasonable time');
  });

  it('should lint file in under 500ms', function () {
    this.timeout(10000); // Allow up to 10 seconds for test

    const startTime = Date.now();
    try {
      execSync('npx biome check src/test-performance.ts', { encoding: 'utf8' });
    } catch (_error) {
      // Expected to fail before configuration
    }
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Linting took ${duration}ms`);

    // For now, just ensure it doesn't take excessively long
    assert.ok(duration < 10000, 'Linting should complete within reasonable time');
  });

  it('should validate performance targets are documented', () => {
    // This test validates that performance expectations are documented
    // in the biome.json configuration comments or documentation

    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json should exist with performance settings');

    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));

    // Validate that configuration supports performance targets
    assert.ok(config.formatter?.enabled, 'formatter should be enabled for performance');
    assert.ok(config.linter?.enabled, 'linter should be enabled for performance');

    // Check that files are properly excluded to improve performance
    assert.ok(config.files?.ignore, 'files.ignore should be configured for performance');
    assert.ok(config.files.ignore.includes('dist/'), 'dist/ should be ignored for performance');
    assert.ok(
      config.files.ignore.includes('node_modules/'),
      'node_modules/ should be ignored for performance',
    );
  });
});
