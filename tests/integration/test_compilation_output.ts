import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Compilation Output Validation', () => {
  const srcDir = path.join(__dirname, '../../src');
  const distDir = path.join(__dirname, '../../dist');

  it('should compile TypeScript files to ES2022+ output', () => {
    // Create a test TypeScript file
    const testFile = path.join(srcDir, 'test-compilation.ts');
    const testContent = `
export function testFunction(param: string): string {
  return \`Hello, \${param}!\`;
}

// This should trigger unused parameter warning
function unusedFunction(unused: number): void {
  console.log('This function has unused parameter');
}
`;
    fs.writeFileSync(testFile, testContent);

    try {
      // This test should fail until tsconfig.json is created
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

      // Attempt compilation
      execSync('npx tsc', { cwd: path.join(__dirname, '../..') });

      // Check output exists
      const outputFile = path.join(distDir, 'test-compilation.js');
      assert.ok(fs.existsSync(outputFile), 'Compiled output file should exist');

      // Check output contains ES2022+ features (should work with ES2022 target)
      const output = fs.readFileSync(outputFile, 'utf8');
      assert.ok(output.includes('testFunction'), 'Output should contain testFunction');
      assert.ok(/Hello, \$\{param\}/.test(output), 'Template literal should be preserved');
    } finally {
      // Clean up test file
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      // Clean up dist directory
      if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
    }
  });

  it('should generate source map files', () => {
    // Create a test TypeScript file
    const testFile = path.join(srcDir, 'test-compilation.ts');
    const testContent = `
export function testFunction(param: string): string {
  return \`Hello, \${param}!\`;
}
`;
    fs.writeFileSync(testFile, testContent);

    try {
      // This test should fail until tsconfig.json is created
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

      // Attempt compilation
      execSync('npx tsc', { cwd: path.join(__dirname, '../..') });

      // Check source map exists
      const sourceMapFile = path.join(distDir, 'test-compilation.js.map');
      assert.ok(fs.existsSync(sourceMapFile), 'Source map file should exist');

      // Validate source map content
      const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, 'utf8'));
      assert.strictEqual(sourceMap.version, 3, 'Source map version should be 3');
      assert.ok(
        sourceMap.sources.includes('src/test-compilation.ts'),
        'Source map should contain source file',
      );
      assert.ok(sourceMap.mappings, 'Source map should have mappings');
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

  it('should enforce strict type checking', () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

    // Create a file with type errors
    const errorFile = path.join(srcDir, 'test-errors.ts');
    const errorContent = `
// This should cause type errors
function badFunction(param: any): string {
  return param + 1; // Type error: any + number
}
`;
    fs.writeFileSync(errorFile, errorContent);

    try {
      // This should fail with type errors
      execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '../..') });
      assert.fail('Expected TypeScript compilation to fail with type errors');
    } catch (error) {
      const execError = error as { status: number; stdout: Buffer; stderr: Buffer };
      assert.notStrictEqual(execError.status, 0, 'Should exit with error code');
      assert.ok(/error|Error/.test(execError.stdout.toString()), 'Should have error output');
    } finally {
      // Clean up
      if (fs.existsSync(errorFile)) {
        fs.unlinkSync(errorFile);
      }
    }
  });
});
