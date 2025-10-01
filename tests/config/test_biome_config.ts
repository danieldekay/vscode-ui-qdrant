import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Test: Biome Configuration Validation
 *
 * Validates that biome.json contains required configuration sections
 * and follows constitutional requirements for linting and formatting.
 *
 * This test MUST FAIL before biome.json is created.
 */
describe('Biome Configuration Validation', () => {
  const biomeConfigPath = path.join(__dirname, '../../biome.json');

  it('should have biome.json file at project root', () => {
    assert.ok(fs.existsSync(biomeConfigPath), 'biome.json must exist at project root');
  });

  it('should have valid biome.json structure', () => {
    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));

    // Required sections
    assert.ok(config.formatter, 'formatter section must be present');
    assert.ok(config.linter, 'linter section must be present');
    assert.ok(config.files, 'files section must be present');

    // Formatter requirements
    assert.strictEqual(config.formatter.enabled, true, 'formatter must be enabled');
    assert.strictEqual(config.formatter.indentStyle, 'space', 'indentStyle must be space');
    assert.strictEqual(config.formatter.indentWidth, 2, 'indentWidth must be 2');
    assert.ok(config.formatter.lineWidth <= 120, 'lineWidth must be <= 120');

    // Linter requirements
    assert.strictEqual(config.linter.enabled, true, 'linter must be enabled');
    assert.ok(config.linter.rules, 'linter rules must be defined');

    // Files requirements
    assert.ok(config.files.ignore, 'files.ignore must be defined');
    assert.ok(config.files.ignore.includes('dist/'), 'must ignore dist/');
    assert.ok(config.files.ignore.includes('node_modules/'), 'must ignore node_modules/');
  });

  it('should have organizeImports enabled', () => {
    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
    assert.ok(config.organizeImports, 'organizeImports section must be present');
    assert.strictEqual(config.organizeImports.enabled, true, 'organizeImports must be enabled');
  });

  it('should include TypeScript files in processing', () => {
    const config = JSON.parse(fs.readFileSync(biomeConfigPath, 'utf8'));
    assert.ok(config.files.include, 'files.include must be defined');
    assert.ok(
      config.files.include.some((pattern: string) => pattern.includes('src/**/*.ts')),
      'must include src/**/*.ts',
    );
    assert.ok(
      config.files.include.some((pattern: string) => pattern.includes('tests/**/*.ts')),
      'must include tests/**/*.ts',
    );
  });
});
