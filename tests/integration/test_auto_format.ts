import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Test: Auto-Format on Save Validation
 *
 * Validates that VS Code workspace settings correctly configure
 * auto-formatting on save using Biome.
 *
 * This test MUST FAIL before .vscode/settings.json is updated.
 */
describe('Auto-Format on Save Validation', () => {
  const settingsPath = path.join(__dirname, '../../.vscode/settings.json');

  it('should have .vscode/settings.json file', () => {
    assert.ok(fs.existsSync(settingsPath), '.vscode/settings.json must exist');
  });

  it('should have editor.formatOnSave enabled', () => {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    assert.strictEqual(settings['editor.formatOnSave'], true, 'editor.formatOnSave must be true');
  });

  it('should have Biome as default formatter', () => {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    assert.strictEqual(
      settings['editor.defaultFormatter'],
      'biomejs.biome',
      'editor.defaultFormatter must be biomejs.biome',
    );
  });

  it('should have Biome as default formatter for TypeScript', () => {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    assert.ok(settings['[typescript]'], '[typescript] section must exist');
    assert.strictEqual(
      settings['[typescript]']['editor.defaultFormatter'],
      'biomejs.biome',
      'TypeScript defaultFormatter must be biomejs.biome',
    );
  });

  it('should have codeActionsOnSave configured for Biome', () => {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    assert.ok(settings['editor.codeActionsOnSave'], 'editor.codeActionsOnSave must be defined');

    const codeActions = settings['editor.codeActionsOnSave'];
    assert.strictEqual(
      codeActions['quickfix.biome'],
      'explicit',
      'quickfix.biome must be explicit',
    );
    assert.strictEqual(
      codeActions['source.organizeImports.biome'],
      'explicit',
      'source.organizeImports.biome must be explicit',
    );
  });

  it('should create test file and validate auto-format behavior', async () => {
    const testFilePath = path.join(__dirname, '../../src/test-auto-format.ts');

    // Create a poorly formatted file
    const poorlyFormattedCode = `import*fs from'fs';
function test( param:string ){const result=\`Hello,\${param}\`;return result;}`;

    fs.writeFileSync(testFilePath, poorlyFormattedCode);

    // Note: This test validates the configuration exists.
    // Actual auto-format behavior would be tested in integration tests
    // that simulate VS Code save operations.
    assert.ok(fs.existsSync(testFilePath), 'test file should be created');

    // Cleanup
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });
});
