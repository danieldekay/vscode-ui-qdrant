import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Source Map Generation Validation', () => {
  const srcDir = path.join(__dirname, '../../src');
  const distDir = path.join(__dirname, '../../dist');

  it('should generate source map files alongside JavaScript output', () => {
    // Create a test TypeScript file
    const testFile = path.join(srcDir, 'test-source-maps.ts');
    const testContent = `
export function testFunction(param: string): string {
  return \`Hello, \${param}!\`;
}
`;
    fs.writeFileSync(testFile, testContent);

    try {
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

      // Compile with source maps enabled
      execSync('npx tsc', { cwd: path.join(__dirname, '../..') });

      // Check output files exist
      const jsFile = path.join(distDir, 'test-source-maps.js');
      const sourceMapFile = path.join(distDir, 'test-source-maps.js.map');
      assert.ok(fs.existsSync(jsFile), 'JavaScript output file should exist');
      assert.ok(fs.existsSync(sourceMapFile), 'Source map file should exist');

      // Check JavaScript contains source map reference
      const jsContent = fs.readFileSync(jsFile, 'utf8');
      assert.ok(
        jsContent.includes('//# sourceMappingURL=test-source-maps.js.map'),
        'JavaScript should reference source map',
      );
    } finally {
      // Clean up
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
    }
  });

  it('should create valid source map with correct structure', () => {
    // Create a test TypeScript file
    const testFile = path.join(srcDir, 'test-source-maps.ts');
    const testContent = `
export class TestClass {
  greet(): string {
    return 'Hello World';
  }
}
`;
    fs.writeFileSync(testFile, testContent);

    try {
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

      // Compile with source maps enabled
      execSync('npx tsc', { cwd: path.join(__dirname, '../..') });

      // Check source map exists and is valid
      const sourceMapFile = path.join(distDir, 'test-source-maps.js.map');
      assert.ok(fs.existsSync(sourceMapFile), 'Source map file should exist');

      const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, 'utf8'));
      assert.strictEqual(sourceMap.version, 3, 'Source map version should be 3');
      assert.ok(Array.isArray(sourceMap.sources), 'Sources should be an array');
      assert.ok(
        sourceMap.sources.includes('src/test-source-maps.ts'),
        'Should contain source file',
      );
      assert.ok(typeof sourceMap.mappings === 'string', 'Mappings should be a string');
      assert.ok(sourceMap.mappings.length > 0, 'Mappings should not be empty');
    } finally {
      // Clean up
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
    }
  });
});
